/**
 * POST /api/form — the sponsorship / donation request form.
 *
 * Cloudflare Pages picks up anything under /functions automatically. The
 * site's build (build/build.mjs, run from the repo root) never touches this
 * folder, so this route ships and deploys independently of the Sanity-driven
 * pages. netlify.toml's `publish = "site"` only tells a (now-unused) Netlify
 * build where the static output lives; Pages Functions are routed off the
 * repo root regardless of that setting, so this file at functions/api/form.ts
 * is picked up on its own. (netlify.toml and vercel.json are both stale
 * leftovers from before the Cloudflare migration — see the note in the repo
 * root and this task's final report. Left in place, not deleted, pending a
 * decision from PJ.)
 *
 * Ported from Pic-A-Lilli's functions/api/form.ts, trimmed to what One More
 * actually has:
 *
 *   - NO D1 write. This site has no database at all. Pic's version inserts a
 *     row into a `submissions` table and that table is what the Pic export
 *     and staff review flow read from; One More doesn't have one, and isn't
 *     getting one for a single form. The Method dashboard (via
 *     forwardSubmission below) is the only place this submission is stored.
 *
 *   - NO staff email. Pic's version sends a notification through Resend from
 *     a verified picalilli.com sending domain. onemorebng.org isn't set up
 *     to send mail through Resend (or anything else) today, so there is no
 *     local notify.ts here and no email leaves this Worker. The dashboard is
 *     responsible for emailing the owners when a submission lands in their
 *     Requests inbox — see docs/form-submissions.md in the Method Rewards
 *     v2 repo. If that ever changes, wire in a notify helper the way Pic's
 *     is wired in, but don't assume it was simply forgotten until then.
 *
 * Bindings required (Cloudflare Pages → Settings → Environment variables):
 *   FORM_INGEST_SECRET   secret — shared with the dashboard Worker, proves
 *                         this site to /api/forms/submit. Not set yet.
 *   FORM_SITE_KEY         plain var (not secret) — this site's
 *                         client_sites.analytics_site_key, the same 24-hex
 *                         value already hardcoded as hit.js's data-site on
 *                         every page. Not set yet either; until it is,
 *                         forwarding is skipped (see forwardIfConfigured).
 *   TURNSTILE_SECRET_KEY  secret, optional. Absent = verification skipped;
 *                         see turnstilePassed() below and the comment next
 *                         to the widget in site/sponsorship.html.
 */

import { forwardSubmission, type SubmissionField } from "../_lib/forward-submission";
import { formAllowed, visitorAllowed, type Limited } from "../_lib/rate-limit";

interface Env {
  FORM_INGEST_SECRET?: string;
  FORM_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const DASHBOARD_FORMS_URL = "https://dashboard.methodoptimization.com/api/forms/submit";

/** Generous, but stops someone pasting a novel into a field. */
const MAX_FIELD_LENGTH = 2000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const tooMany = (limit: Extract<Limited, { ok: false }>, message: string) =>
  new Response(JSON.stringify({ error: message }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Retry-After": String(limit.retryAfter),
    },
  });

/**
 * The 501(c)(3) letter a sponsorship request can carry.
 *
 * 8MB is generous for a scanned letter and matches the cap the dashboard's
 * own /api/forms/submit enforces (see form-submissions.md), while still
 * capping what one POST can cost us. HEIC is on the list because that is
 * what an iPhone produces when someone photographs the letter rather than
 * scanning it — rejecting it would send the most likely submission straight
 * into an error message.
 */
const MAX_DOC_BYTES = 8 * 1024 * 1024;

/**
 * File type is decided by sniffing the bytes, never by the filename or the
 * browser-supplied Content-Type — either can be wrong or spoofed. Each
 * checker looks at the file's magic bytes and returns the real MIME type,
 * or null if it doesn't match.
 */
function sniffDocType(bytes: Uint8Array): string | null {
  const startsWith = (sig: number[]) =>
    sig.every((b, i) => bytes[i] === b);

  // %PDF
  if (startsWith([0x25, 0x50, 0x44, 0x46])) return "application/pdf";

  // JPEG: FF D8 FF
  if (startsWith([0xff, 0xd8, 0xff])) return "image/jpeg";

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";

  // WEBP: "RIFF" .... "WEBP"
  if (
    bytes.length >= 12 &&
    startsWith([0x52, 0x49, 0x46, 0x46]) &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  // HEIC/HEIF: ISO base media file, box at offset 4 is "ftyp", brand at
  // offset 8 is one of a handful of HEIF flavors.
  if (bytes.length >= 12 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    const brand = new TextDecoder().decode(bytes.slice(8, 12));
    if (["heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(brand)) {
      return brand === "mif1" || brand === "msf1" ? "image/heif" : "image/heic";
    }
  }

  return null;
}

/** A filename safe to hand off in a multipart part and show in the dashboard. */
function safeFilename(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^[._]+/, "");
  return cleaned.slice(0, 80) || "501c3";
}

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Ask Cloudflare whether this Turnstile token is good.
 *
 * Fails OPEN on a network error: if Cloudflare's own verify endpoint is
 * unreachable, a real group shouldn't lose their request over it. A bot
 * can't force that failure, and the honeypot and rate limit are still in
 * play either way. A token that is present but genuinely invalid fails
 * closed, as it should.
 *
 * Enforced only when TURNSTILE_SECRET_KEY is configured — which it isn't
 * yet for this site. Until PJ adds Turnstile keys (site key in
 * site/sponsorship.html's data-sitekey, secret here), this function is
 * never called and the honeypot + rate limit below carry the load alone.
 */
async function turnstilePassed(secret: string, token: string, ip: string | null): Promise<boolean> {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[]; hostname?: string };
    if (data.success !== true) {
      console.error("Turnstile rejected a submission", {
        codes: data["error-codes"] ?? [],
        hostname: data.hostname ?? null,
      });
    }
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verify unreachable, allowing submission", err);
    return true;
  }
}

/** Fields shown in the dashboard, in the order asked on the page. */
const FIELD_ORDER: { key: string; label: string; type?: SubmissionField["type"] }[] = [
  { key: "org_name", label: "Organization", type: "text" },
  { key: "name", label: "Contact", type: "text" },
  { key: "phone", label: "Phone", type: "phone" },
  { key: "email", label: "Email", type: "email" },
  { key: "tax_id", label: "Tax ID / EIN", type: "text" },
  { key: "org_address", label: "Address", type: "text" },
  { key: "about_group", label: "About the group", type: "long_text" },
  { key: "donation_requested", label: "Asking for", type: "text" },
  { key: "event_date", label: "Event date", type: "date" },
  { key: "donation_purpose", label: "Event / cause", type: "long_text" },
  { key: "community_benefit", label: "Community benefit", type: "long_text" },
  { key: "pickup_when", label: "Pickup window", type: "text" },
  { key: "recognition", label: "Recognition offered", type: "long_text" },
  { key: "comments", label: "Other notes", type: "long_text" },
];

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  let form: FormData;
  try {
    // Both the fetch path and a no-JS native submit land here.
    const type = request.headers.get("content-type") || "";
    if (type.includes("application/json")) {
      const body = (await request.json()) as Record<string, string>;
      form = new FormData();
      for (const [k, v] of Object.entries(body)) form.append(k, String(v));
    } else {
      form = await request.formData();
    }
  } catch {
    return json({ error: "Could not read the submission." }, 400);
  }

  const get = (key: string) => (form.get(key) ?? "").toString().trim();
  const origin = new URL(request.url).origin;
  const ip = request.headers.get("CF-Connecting-IP");

  // Honeypot: real people never fill a hidden field. Return 200 so bots
  // think they succeeded and don't retry with a different approach.
  if (get("bot-field")) return json({ ok: true });

  // Every other post counts toward this visitor's limit, valid or not: a
  // flood of junk costs as much to handle as a flood of real-looking ones.
  const visitor = await visitorAllowed(origin, ip);
  if (!visitor.ok) {
    return tooMany(visitor, "Too many tries from here. Please wait a few minutes and try again.");
  }

  const formName = get("form-name") || get("form");
  if (formName !== "sponsorship") {
    return json({ error: "Unknown form." }, 400);
  }

  const email = get("email");
  const name = get("name");
  const orgName = get("org_name");
  const phone = get("phone");
  const aboutGroup = get("about_group");
  const donationRequested = get("donation_requested");

  // Deliberately loose. Strict email regexes reject valid addresses.
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: "A valid email address is required." }, 400);
  }
  if (!name) return json({ error: "Contact person is required." }, 400);
  if (!orgName) return json({ error: "Organization name is required." }, 400);
  if (!phone) return json({ error: "Phone is required." }, 400);
  if (!aboutGroup) return json({ error: "Tell us what your group does." }, 400);
  if (!donationRequested) return json({ error: "Tell us what you're asking for." }, 400);

  // Optional 501(c)(3) letter, forwarded to the dashboard. Validated here —
  // both size and, by sniffing the actual bytes, type — so a too-big or
  // wrong-typed file is rejected before any network call is made.
  const upload = form.get("doc");
  const doc = upload && typeof upload !== "string" && upload.size > 0 ? upload : null;
  let docBytes: Uint8Array | null = null;
  let docType: string | null = null;
  if (doc) {
    if (doc.size > MAX_DOC_BYTES) {
      return json({ error: "That file is over 8MB. Please send a smaller scan or photo." }, 400);
    }
    docBytes = new Uint8Array(await doc.arrayBuffer());
    docType = sniffDocType(docBytes);
    if (!docType) {
      return json({ error: "Please attach a PDF or a photo of the letter (PDF, JPEG, PNG, WEBP, HEIC or HEIF)." }, 400);
    }
  }

  // Before any further work, and only for posts that would otherwise be
  // saved.
  const flood = await formAllowed(origin, formName);
  if (!flood.ok) {
    return tooMany(flood, "We're getting a lot of requests right now. Please try again in a few minutes.");
  }

  // Turnstile. Enforced only when the secret is configured, so this code
  // deploys before the keys exist without breaking a single submission —
  // see the doc comment on turnstilePassed() above.
  if (env.TURNSTILE_SECRET_KEY) {
    const token = get("cf-turnstile-response");
    const ok = !!token && (await turnstilePassed(env.TURNSTILE_SECRET_KEY, token, ip));
    if (!ok) {
      return json({ error: "We couldn't verify that you're human. Please try again." }, 400);
    }
  }

  // Build the ordered field list the dashboard renders. Blank optional
  // answers are dropped rather than sent as empty strings.
  const fields: SubmissionField[] = FIELD_ORDER
    .map(({ key, label, type }) => ({ label, value: get(key).slice(0, MAX_FIELD_LENGTH), type }))
    .filter((f) => f.value);

  // Forwarding is the ONLY place this submission is stored (see the file
  // comment) — skipped only if the site key isn't configured yet, since a
  // POST with no site key can't be attributed to a merchant on the
  // dashboard side. FORM_INGEST_SECRET missing is handled the same way:
  // there is nothing useful to send without it, and the dashboard would
  // 503 the request anyway (see docs/form-submissions.md).
  if (env.FORM_INGEST_SECRET && env.FORM_SITE_KEY) {
    waitUntil(
      forwardSubmission({
        endpoint: DASHBOARD_FORMS_URL,
        secret: env.FORM_INGEST_SECRET,
        siteKey: env.FORM_SITE_KEY,
        form: "sponsorship",
        formLabel: "Sponsorship request",
        fields,
        files: docBytes && docType
          ? [{ filename: safeFilename(doc?.name || "501c3"), contentType: docType, bytes: docBytes }]
          : [],
      })
    );
  } else {
    console.error("Form forward skipped: FORM_INGEST_SECRET or FORM_SITE_KEY not configured yet");
  }

  // No-JS fallback: a native form POST would otherwise render raw JSON.
  if (!(request.headers.get("accept") || "").includes("application/json")) {
    return new Response(
      `<!doctype html><meta charset="utf-8">
       <title>Thanks — One More Bar &amp; Grill</title>
       <meta name="robots" content="noindex">
       <body style="font-family:system-ui;max-width:32rem;margin:20vh auto;padding:0 1.5rem;text-align:center;background:#0e0e0e;color:#f3ecdd">
       <h1>Thanks — we got it.</h1>
       <p>If we can help, someone will be in touch. <a href="/" style="color:#e8a317">Back to the site</a></p>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  return json({ ok: true });
};

/**
 * Someone opening /api/form in a browser. Cloudflare already 405s unhandled
 * methods when a method-specific handler exists; this just makes a GET
 * explain itself instead of returning a bare error.
 */
export const onRequestGet: PagesFunction<Env> = async () =>
  json({ error: "This endpoint accepts POST submissions only." }, 405);
