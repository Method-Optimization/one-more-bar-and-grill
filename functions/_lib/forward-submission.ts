/**
 * Forward a form submission to the Method dashboard's Requests inbox.
 *
 * Generic on purpose: it knows nothing about any particular site or form.
 * Call it from any Cloudflare Pages Function form handler with that form's
 * own slug, label, fields and files — see docs/form-submissions.md for the
 * full HTTP contract this implements.
 *
 * Fire-and-forget from the caller's point of view: this never throws for a
 * failed forward (network error, dashboard 4xx/5xx, …) because the
 * submission has already been saved and emailed by the site's own handler
 * by the time this runs. Log and move on; a failed forward costs a dashboard
 * copy, not the submission itself.
 */

export type SubmissionFieldType = "text" | "long_text" | "email" | "phone" | "date" | "url";

export type SubmissionField = {
  label: string;
  value: string;
  type?: SubmissionFieldType;
};

export type SubmissionFile = {
  /** The uploaded filename, shown in the dashboard. */
  filename: string;
  /** application/pdf, image/jpeg, image/png, image/webp, image/heic, or image/heif. */
  contentType: string;
  bytes: Uint8Array;
};

export type ForwardSubmissionInput = {
  /** e.g. "https://dashboard.methodoptimization.com/api/forms/submit" */
  endpoint: string;
  /** The shared secret set as FORM_INGEST_SECRET on the dashboard Worker. */
  secret: string;
  /** This site's client_sites.analytics_site_key (24 hex chars). Not a secret. */
  siteKey: string;
  /** A slug for this form: lowercase letters, digits, hyphens/underscores. */
  form: string;
  /** What a human calls this form, e.g. "Sponsorship request". */
  formLabel: string;
  fields: SubmissionField[];
  files?: SubmissionFile[];
  /** This site's own idempotency key, if it has one. See "Idempotency" in the docs. */
  externalId?: string;
  /** Defaults to "now" on the dashboard side if omitted. */
  submittedAt?: Date;
};

export async function forwardSubmission(input: ForwardSubmissionInput): Promise<boolean> {
  const form = new FormData();
  form.set("site", input.siteKey);
  form.set(
    "payload",
    JSON.stringify({
      form: input.form,
      form_label: input.formLabel,
      external_id: input.externalId,
      submitted_at: (input.submittedAt ?? new Date()).toISOString(),
      fields: input.fields,
    }),
  );

  for (const [i, file] of (input.files ?? []).slice(0, 3).entries()) {
    form.set(
      `file${i}`,
      new File([new Uint8Array(file.bytes)], file.filename, { type: file.contentType }),
    );
  }

  try {
    const res = await fetch(input.endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${input.secret}` },
      body: form,
    });
    if (!res.ok) {
      console.error("Dashboard form forward failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Dashboard form forward threw", err);
    return false;
  }
}

/**
 * Example: wired into a Cloudflare Pages Function form handler, after that
 * handler has already validated the post and saved/emailed its own copy.
 *
 *   import { forwardSubmission } from "./forward-submission";
 *
 *   interface Env {
 *     FORM_INGEST_SECRET: string;
 *   }
 *
 *   export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
 *     const form = await request.formData();
 *
 *     // ... this site's own validation, D1 write, staff email ...
 *
 *     const letter = form.get("doc");
 *     const files =
 *       letter && typeof letter !== "string" && letter.size > 0
 *         ? [
 *             {
 *               filename: letter.name || "letter",
 *               contentType: letter.type || "application/pdf",
 *               bytes: new Uint8Array(await letter.arrayBuffer()),
 *             },
 *           ]
 *         : [];
 *
 *     waitUntil(
 *       forwardSubmission({
 *         endpoint: "https://dashboard.methodoptimization.com/api/forms/submit",
 *         secret: env.FORM_INGEST_SECRET,
 *         siteKey: "REPLACE_WITH_SITE_KEY", // client_sites.analytics_site_key
 *         form: "sponsorship",
 *         formLabel: "Sponsorship request",
 *         fields: [
 *           { label: "Organization", value: String(form.get("org_name") ?? ""), type: "text" },
 *           { label: "Contact email", value: String(form.get("email") ?? ""), type: "email" },
 *           { label: "Phone", value: String(form.get("phone") ?? ""), type: "phone" },
 *           { label: "What are you asking for?", value: String(form.get("ask") ?? ""), type: "long_text" },
 *         ].filter((f) => f.value),
 *         files,
 *       }),
 *     );
 *
 *     return new Response(JSON.stringify({ ok: true }), {
 *       headers: { "Content-Type": "application/json" },
 *     });
 *   };
 */
