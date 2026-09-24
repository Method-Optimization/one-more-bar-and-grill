/**
 * Rate limits for the public form, in two layers.
 *
 * Ported from Pic-A-Lilli's functions/_lib/rate-limit.ts. That version's
 * per-form counter queries D1 ("how many rows landed in the last window") —
 * One More has no database at all (see the comment at the top of
 * ../api/form.ts), so both counters here live in Cloudflare's edge cache
 * instead. Same idea, same fail-open behavior, just no D1 dependency.
 *
 * Per visitor: at most VISITOR_MAX posts from one IP address per window,
 * counted in Cloudflare's edge cache. The cache is per data center and only
 * roughly consistent, so this is a speed bump rather than an exact count —
 * which is all a form needs. The IP is hashed before it becomes a cache key
 * and is never stored anywhere.
 *
 * Per form: at most FORM_MAX posts to this form, sitewide, per window —
 * also counted in the edge cache under a fixed key. That catches a flood
 * spread over many addresses, which the per-visitor count can't see. Real
 * traffic is a handful of requests a month.
 *
 * Both fail open. If the cache can't answer, a real submission matters more
 * than a perfect count; the honeypot and (once configured) Turnstile still
 * apply either way.
 */

const WINDOW_SECONDS = 10 * 60;
const VISITOR_MAX = 6;
const FORM_MAX = 20;

export type Limited = { ok: true } | { ok: false; retryAfter: number };

type Counter = { count: number; resetAt: number };

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function bump(origin: string, cacheKeyPath: string, max: number): Promise<Limited> {
  try {
    const cache = (caches as unknown as { default: Cache }).default;
    const key = new Request(`${origin}${cacheKeyPath}`);
    const now = Math.floor(Date.now() / 1000);

    let state: Counter = { count: 0, resetAt: now + WINDOW_SECONDS };
    const hit = await cache.match(key);
    if (hit) {
      const stored = (await hit.json()) as Counter;
      if (stored.resetAt > now) state = stored;
    }

    if (state.count >= max) {
      return { ok: false, retryAfter: state.resetAt - now };
    }

    state.count += 1;
    await cache.put(
      key,
      new Response(JSON.stringify(state), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `max-age=${Math.max(1, state.resetAt - now)}`,
        },
      })
    );
    return { ok: true };
  } catch (err) {
    console.error("Rate limit unavailable, allowing submission", err);
    return { ok: true };
  }
}

/**
 * Count one post from this visitor and say whether it's allowed. `origin`
 * is the site's own origin, so the cache key stays on this zone; the path
 * is never a real page, and cache entries are only read back through here.
 */
export async function visitorAllowed(origin: string, ip: string | null): Promise<Limited> {
  if (!ip) return { ok: true };
  const hashed = await sha256Hex(ip);
  return bump(origin, `/__rate-limit/form/visitor/${hashed}`, VISITOR_MAX);
}

/** Whether this form has already taken FORM_MAX posts inside the window, sitewide. */
export async function formAllowed(origin: string, form: string): Promise<Limited> {
  return bump(origin, `/__rate-limit/form/count/${form}`, FORM_MAX);
}
