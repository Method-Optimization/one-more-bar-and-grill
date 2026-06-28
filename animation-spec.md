# One More Bar & Grill — Animation & Interaction Spec

> Standalone motion spec for the website rebuild, to hand to Claude Code alongside `website-refresh-brief.md`.
> Reference site: **lepainquotidien.com/be/en**, analyzed via live DOM / React-fiber inspection (confirmed, not inferred).
> Goal: recreate Le Pain Quotidien's scroll "wow factor" in **One More's dark, gritty dive-bar voice** — not LPQ's airy European one.
> Dominant signature: **scroll-scrubbed, not time-based.** Almost nothing fires on its own; everything is driven by the user's scroll, smoothed by inertia.

---

## 1. Tech stack to replicate the feel (confirmed on LPQ)

- **Lenis** — smooth / inertia scrolling. LPQ config: `lerp: 0.1`, custom exponential ease-out `t => Math.min(1, 1.001 - Math.pow(2, -10*t))`, `smoothWheel: true`, vertical, `infinite: false`. This is the source of the "floating on water / moving through honey" glide.
- **Framer Motion** — all scroll-linked animation via `useScroll` / `useTransform` (driving `opacity`, `translateY`, `filter: blur`). **No GSAP, no ScrollTrigger.**
- **Next.js (App Router) + Tailwind CSS** — layout, durations, easings as utilities.
- **ReactPlayer + HLS.js** — the full-bleed autoplaying section video (streamed as an HLS blob).
- **One site-wide custom easing:** `cubic-bezier(0.49, 0.03, 0.13, 0.99)` — very slow start, sharp deceleration (drifts, then snaps). Used for the nav logo swap and menu transitions.

---

## 2. Signature effects → mapped to One More

### 1. Sticky parallax hero (LPQ: 300vh tall)
A `sticky` hero ~3 viewports tall with a `fixed h-screen` panel inside; the user stays pinned while scrolling through it. Background image pre-scaled to `transform: scale(1.15)` with a JS-updated `translateY` parallax drift (pre-scaling avoids white edges during translation).
→ **One More:** pin a dark hero — the Jersey Devil logo over a moody shot of the bar / saucy Tails — with the same slow parallax drift.

### 2. Scroll-scrubbed cycling headline, word-by-word brighten
A stacked list of phrases clipped to one visible line; `translateY` scrubs them upward with scroll, while each word's `opacity` ramps `0 → 1` as it enters the "active zone" (graduated values like `0.07 → 0.40 → 0.73 → 1.0`). Words ahead are dark, words behind are bright. A second set of `<span>`s carries the per-word opacity.
→ **One More:** cycle short bar lines — e.g. *"Cold beer." / "Whole wings — not just pieces." / "Your local bar." / "Where the Jersey Devil drinks."* Same word-by-word light-up.

### 3. Infinite scroll-cue arrows
Two arrow SVGs loop inside an `overflow-hidden` circle via `requestAnimationFrame` (one at `top: 48px`, one at `top: 0`), creating a seamless downward loop.
→ **One More:** keep as-is.

### 4. Sticky nav with animated logo swap
Fixed full-width bordered bar. The center logo runs a **30s infinite loop** swapping the wordmark for the italic tagline (slides up/in), and swaps **instantly on hover** (`0.5s` custom cubic-bezier). A thin colored accent strip sits above the nav and hides on sections flagged `data-top-hide="true"`.
→ **One More:** swap the One More wordmark ⇄ "just your local bar trying to get through the day like you." Accent strip in One More red/amber (LPQ used `dough-500`).

### 5. Sticky card stack (menu / catering / gift)
Large two-column cards (`lg:sticky lg:top-[4.35rem]`) that stack on scroll: text/headline panel + image panel. A **handwritten brush-script accent** (yellow italic font, `rotate(-2deg)`) sits above the bold block headline — this is the "drawn highlight," purely typographic, no SVG. Each card's circular CTA button is hidden at `translateY(80px)` below the card edge and **glides up on hover** (`group-hover`, `700ms`, custom easing).
→ **One More:** stack Menu / Specials / Takeout cards; script accent in a red or amber marker font over the block headline; hover-reveal "View Menu" / "Call to Order" buttons.

### 6. Scattered "polaroid" food cards
Four photos start at `translateY(600px) rotate(24deg)` (below, uniformly tilted) and, on scroll-enter, settle to scattered final rotations (`-9°, +2°, -4°, +3°`). One-shot fly-in (~600–800ms), **not** a scrub.
→ **One More:** scattered polaroids of Tails, wings, burgers, the bar — high-energy and casual, very on-brand.

### 7. Scroll-pinned video reveal (LPQ: 200vh sticky)
A `h-[200vh]` container with a `sticky h-screen` inner div. Full-bleed video behind layered overlays that `translateY` off-screen as scroll progresses:
- a dark scrim (`bg-black/40`) → `translateY(0 → -100vh)`;
- a colored `mix-blend-lighten` overlay carrying a big headline (black text renders creamy/white over the dark video);
- a ghost/outlined twin of the same headline underneath for depth;
- a CTA that ascends with the overlay.
The overlay lifts away to reveal the raw video.
→ **One More:** a looping video of wings being sauced / a busy Friday night; overlay lifts to reveal it; headline **"WINGS. BEER. LOCALS."** in the mix-blend treatment.

### 8. Big typographic headline word fade-in
Per-word `opacity + filter:blur(0px) + translate3d` reveal that fires **once** on viewport entry (not scrubbed).
→ **One More:** use for section headlines.

### 9. Heritage timeline
A `sticky top-0` white banner with `©1990 → 2026` in heavy display type and a horizontal rule; content cards scroll over it via z-index stacking (no explicit animation).
→ **One More:** `©2012 → 2026`.

### 10. Editorial / magazine cards
Two-column grid; image scales slightly on hover (`group-hover`); text static.
→ **One More:** the "Happenings" / events cards.

---

## 3. Timing & feel

Slow, luxurious, scroll-scrubbed. Lenis `lerp 0.1` gives heavy inertia — momentum carries the view ~2–3× past where you stop scrolling before it catches up. Reveals are pace-controlled by the user, not fixed durations. Hover transitions run ~`0.5–0.7s` on the custom `cubic-bezier(0.49, 0.03, 0.13, 0.99)` (slow start, sharp snap). The hero headline scrub, word-by-word opacity, and video overlays are all 1:1 with Lenis-smoothed scroll.

---

## 4. One More adaptation notes (important)

- **Keep the techniques, adjust the temperament.** LPQ's "moving through honey" reads as refined-European calm. A Piney dive bar should feel more **alive and punchy** — consider a slightly higher Lenis lerp (~`0.12–0.15`) and snappier reveals so it's energetic, not sleepy. Preserve the scroll-scrubbed wow; drop the slow-luxury serenity.
- **Dark, tactile execution:** black / red / amber; reclaimed-wood and chalkboard textures instead of white plaster/marble; Jersey Devil motifs throughout.
- **Performance & accessibility:** honor `prefers-reduced-motion` (disable scrub/parallax, fall back to simple fades). Test pinned/scrubbed sections on mobile — heavy scroll-jacking can feel broken on phones; provide a lighter mobile variant. Keep it fast: most traffic is phones checking hours and the menu.
- **Don't over-animate utility pages.** Menu, hours, and takeout must be instant and frictionless. Spend the wow budget on the **home page** and the **story / specials** sections.

---

*Reference: live animation/DOM inspection of lepainquotidien.com/be/en. Companion document: `website-refresh-brief.md`.*
