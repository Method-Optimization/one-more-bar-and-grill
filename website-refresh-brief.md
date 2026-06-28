# One More Bar & Grill — Website Refresh Brief

> Research brief to hand to Claude Code as project context for rebuilding **onemorebng.org**.
> Compiled June 2026. Menu and specials transcribed via OCR from the current site's menu pages and the June calendar. Facts verified against the current site, Google Business listing, and public directories. Open questions are listed in Section 9.
>
> **Companion files (in this folder):** `animation-spec.md` (standalone motion spec — mirrors Section 11) and `assets/image-assets.md` (photo manifest with alt-text + usage). Image and brand assets live in `assets/`. See Section 12 for the full file map.

---

## 1. Business snapshot

| Field | Value |
|---|---|
| Name | One More Bar & Grill |
| Address | 1375 US Route 206, Tabernacle, NJ 08088 |
| Phone | (609) 388-5386 |
| Email | wendyonemore@gmail.com (owner/manager contact, likely "Wendy") |
| Current site | https://onemorebng.org (built on GoDaddy Website Builder) |
| Facebook | https://www.facebook.com/onemorebarandgrillNJ (6,400+ followers — most active channel) |
| Instagram | @onemore_tabernacle_nj (~786 followers) |
| Opened | ~June 2012 (10-year anniversary badge appears on the site) |
| Category | Neighborhood bar & grill / nightlife ($$) |
| Ordering | **Dine-in & call-ahead takeout only — NO online ordering** |
| POS system | Unknown / TBD |

**Setting matters.** Tabernacle sits in Burlington County, deep in the New Jersey Pine Barrens — Jersey Devil country. The brand leans hard into this: the logo features two Jersey Devil mascots hoisting beer mugs, menu items are named for it (Jersey Devil burger, Jersey Devil wrap, "Devil's Breath" wing sauce), and local lore (Weird NJ) calls it the spot "where the Jersey Devil hangs out." This is a strong, ownable local identity the new site should amplify.

---

## 2. Brand identity

**Logo:** "One More" in large white script with red outline, "Bar & Grill" beneath, flanked by two brown Jersey Devil creatures holding frothy beer mugs, on a black background.

**Color palette (from current site):** black background, red accents, white type, amber/gold beer tones. Dark, gritty, tavern feel. Suggested starting hexes (extract exact values from the logo): near-black `#0E0E0E`/`#1A1A1A`, red `#C0392B`, white `#FFFFFF`, amber/gold `#E8A317`.

**Voice / tone:** casual, self-deprecating, local, playful. The homepage tagline nails it:
> "Just your local bar trying to get through the day like you, our loyal customers."

Positioning line in use: **"Dine In or Take Out."** The menu copy is full of personality — punny item names, sauces with attitude, dishes named after staff/locals (Mary Ann's soups & meatballs, Aimee's cakes, Russell's sauce). The rebuild should preserve this voice, not sand it down into generic restaurant copy.

---

## 3. Hours

| | Bar open | Full kitchen | Late-night menu |
|---|---|---|---|
| Sun–Thu | 11:00 am – 12:00 am | 11:00 am – 9:00 pm | 9:00 pm – 11:00 pm |
| Fri–Sat | 11:00 am – 2:00 am | 11:00 am – 11:00 pm | 11:00 pm – 1:00 am |

Open 7 days, including holidays (e.g., Memorial Day). Put hours in structured data (`OpeningHoursSpecification`) so Google shows them correctly, and ideally a live "Open now / kitchen closes at X" indicator.

---

## 4. Full menu (transcribed from current menu pages)

Wings-forward bar food with a big, characterful menu. Three signature formats run throughout: **WINGS** (whole wings), **TAILS** (boneless top-cut breast, the customer favorite), and **EARS** (breaded chicken filets). Prices below are transcribed from the current printed menu and owner-approved for use as-is.

### Wings, Tails & Morsels
- **Wings** (whole wing, not pieces): 6/$9 · 13/$15 · 25/$27
- **Tails** (boneless): 5/$11 · 10/$20 · 20/$35
- **Ears** (breaded filets in wing sauce): 5/$11 · 10/$20 · 20/$35
- One More Combo — 3 Ears & 3 Tails $10
- Buffalo Shrimp (½ lb) $14 · Buffalo Scallops (½ lb) $23
- Double Buffalo Rolls $9.50 · Buffalo Stix (buffalo-style mozz sticks) $9

**Sauces:** Devil's Breath ("ludicrous hot"), Hot, Spicy, Mild ("super sweet with a small bite"), Garlic Parm, Johnny Yaki (teriyaki w/ kick), Russell's Pick (sweeter than sweet, tangy), Bourbon, Sesame Ginger, Sweet BBQ. Sides: celery & blue cheese / ranch.

### Finger Foods (most $8.50)
Bavarian Pretzel Rods, Broccoli Bites (now w/ bacon), Fried Mushrooms, Buffalo Roll (single $5), Jalapeño Poppers, Mozzarella Sticks, Chicken Fingers, Onion Petals, Corn Nuggets, Fried Green Beans, Fried Pickles, Buffalo Chicken Dip, Cordon Bleu Balls ($9), Nachos & Cheese ($8) / Supreme ($12.50), Cup o' Chili ($6.50), Hot Dog ($3 / $4 w/ cheese).

### Soups & Salads
- Mary Ann's Gourmet Homemade Soup of the Week (rotates weekly, price varies)
- Lobster Bisque — cup $7 / bowl $9 (daily)
- Salads $12.50–$22.75: One More Salad (flat-iron steak) $22.75, Southwestern $14.50, Turkey BLT $14.50, Chicken Caesar $13.50, Shrimp Caesar $16.75, Buffalo Chicken $14.50, Bourbon Chicken $14.50, Buffalo Shrimp $16.75, Cheese Steak $14.50, Caesar $12.50, House $9.25
- Dressings: blue cheese, ranch, caesar, honey mustard, balsamic, Italian, oil & vinegar, 1000 island, spicy ranch, sesame ginger

### Fries, Tots & More
Steak Fries $5.50 · Curly Fries $7 · Tater Tots $7 · Sweet Potato Fries $7. Loaded options (+): Cheese, Prime Rib (+$9), Railroad (wing sauce + sweet soy), Bacon & Cheese, Junk Yard (gravy + cheddar), Loaded, Old Bay/Cajun.

### Sandwiches & Grills ($9.50–$23)
Open-Faced Turkey, **One More Dip** (prime rib, $19), Flat Iron Steak Grill ($23), Meatball (Mary Ann's, $15.50), Buffalo Chicken, Grilled Chicken, Turkey Grill, **Black Angus Burger Melt** ($16), Chicken Parm, Pork Roll & Cheese ($13), BLT, Grilled Cheese, **S.O. Grilled Cheese** (with two Ears inside, $11), Turkey Club, 2 Dog Reenie Special.

### Wraps ($12–$14)
Buffalo Chicken, **Jersey Devil Wrap** (chicken fingers, bourbon sauce, cheddar), **Julius Wrap** (grilled chicken caesar).

### Burgers (build-your-own; Impossible/veggie patty +$2.50)
Blue Suede Shoe ($14.50), Candied Bacon ($15), Black Angus Melt ($16), Rodeo ($14.50), The Farm (fried egg + bacon, $15.50), Buffalo ($14.50), Bacon Cheese ($14), **Jersey Devil** (bourbon sauce + cheddar, $12), Swiss Mushroom ($13), Cheese ($12).

### Cheesesteaks / Hoagies (½ & full)
Flying Cow (steak + chicken), Wiz With, Cheese Steak Hoagie, Rodeo, Buffalo, Jersey Devil, Cheese.

### Quesadillas
Shrimp $14.50, Taco $9.50, Veggie $10, Chicken $9, Cheese $7.50, Steak $10, Cheeseburger $10.50; specialty: Buffalo Chicken $10, One More Dilla (prime rib, $18), Buffalo Shrimp $15.

### Pizza
- 16" Family $14 · 10" Personal $8.50 (toppings extra; regular & premium tiers)
- White Pizza, **The Gut Buster** (sausage/bacon/porkroll/pepperoni), Buffalo Chicken, BBQ Chicken
- **Gluten-free 10"** available ($10)

### Kids — "For the Little Ones"
Cheeseburger $9, Chicken Fingers $8.50, Hot Dog w/ fries $7, Grilled Cheese $8, Mac & Cheese $7.

### Desserts
Aimee's Homemade Cake of the Week $7.50, Funnel Fries $7.50, Fried Cheesecake Roll $5.75, Specialty Dessert Roll (changes monthly) $7.

### Take-Out Party Trays
50 Wings $52.50 / 100 $95 · 50 Tails $67.50 / 100 $120 · 50 Ears $67.50 / 100 $120 · 25/25 combos $60–$67.50.

### Late Night Menu (Sun–Thu 9–11pm; Fri–Sat 11pm–1am)
Wings 6/$9, 12/$15 · Tails 5/$11, 10/$20 · Ears 5/$11, 10/$20 · One More Combo 12 Ears & 5 Tails · Mac & Cheese $7 · Steak Fries $5.50 / Chili Fries $7 / Sweet Pot Fries $7 / Tots $7 · plus a "$8.50 your choice" lineup (Broc Bites, Jalapeño Poppers, Chicken Fingers, Onion Petals, Corn Nuggets, Fried Green Beans, Fried Pickles, Buffalo Chicken Dip, Fried Mushrooms).

---

## 5. Specials, events & rotating features

This is a major content opportunity — today it all lives inside **one static calendar image** that can't be read on a phone or indexed by Google. The new site should make it real, structured, and easy for staff to update monthly.

**Weekly entertainment**
- **Karaoke** — every Saturday, 9:00 pm–1:00 am
- **Music Bingo** — every Tuesday, 7:00 pm–9:00 pm

**Daily dine-in specials**
- Sunday — 75¢ wings; $2 Coors Light draft
- Monday — $10 your-choice burger & fries
- Tuesday — $8 mini cheesesteak & fries (eat-in)
- Wednesday — 4 free wings with purchase (eat-in)
- Thursday — Tails 3 for $5 (eat-in)
- Friday — Personal pizza $6

**Rotating monthly / weekly features** (great for "freshness" + repeat visits)
- **Roll of the Month** (e.g., June: Cuban Roll) and **Dessert Roll of the Month** (e.g., Strawberry Cheesecake Roll)
- **Mary Ann's Soup of the Week** (changes Mondays)
- **Aimee's Cake of the Week**

These named, rotating items are part of the charm and should be featured prominently with an easy update mechanism.

---

## 6. Reputation & customers

| Platform | Rating | Volume |
|---|---|---|
| Google | 4.5 ★ | ~812 reviews |
| Facebook | 4.8 ★ | 266 reviews (96% recommend) |
| TripAdvisor | 4.4 ★ | 22 reviews |
| Yelp | 3.8 ★ | 91 reviews |
| Nextdoor | — | 59 "faves" |

*(Rating figures vary by source and date; treat as directional. The strong Facebook score + 96% recommend rate best reflects the community-favorite standing.)*

**Who comes in:** loyal locals plus regulars from surrounding Pine Barrens towns (Chatsworth, Shamong, Vincentown, Medford, Mount Laurel) and the occasional out-of-towner who gets "hooked." Strong repeat-visit loyalty. Price perceived as great value (~$10–$20/person).

**What customers love (themes across all platforms):**
- **The Wings & Tails** — the #1 highlight everywhere: "perfectly cooked," generous (whole wings, not just flats/drums), bold sauces. Most-loved sauces: **Garlic Parm**, Buffalo, Spicy, Russell's Pick, Devil's Breath. (One reviewer: the Garlic Parm is so good "they should bottle it.")
- **Other standouts:** buffalo chicken cheesesteak, meatball roll, prime rib cheesesteak, buffalo chicken egg rolls, fried mushrooms, fried cheesecake, rotating homemade soups, burgers. Portions called massive and well-priced.
- **Atmosphere** — cozy, casual, "divey" neighborhood "Piney bar": wood paneling, Jersey Devil decor, jukebox, **pool tables**, live music, trivia/music-bingo nights, and **dog-friendly outdoor seating**. Unpretentious and welcoming.
- **Staff** — friendly, attentive, "down to earth," treat you "like a regular." Bartender **Reenie** is named repeatedly for her warm style and cocktails (note: the menu's "2 Dog Reenie Special" ties to her — a fun brand detail).
- **Local pedigree** — the ownership has roots in the **Pic family** (of the well-known Pic-A-Lilli Inn in nearby Shamong); locals rate One More as a favorite in its own right.

**Pain points to be aware of (isolated, not systemic):**
- Occasional **inconsistent table service** (servers not checking back, missed refills, not pointing out the draft list on the wall).
- A few **food-consistency** complaints, mostly on takeout (an under-portioned/undercooked wing order; one "tough as shoe leather" item alongside good ones).
- One mention of a stale-beer smell on entry; one negative front-of-house/management interaction.

**Testimonial pull-quotes** (owner-approved for publishing):
- "This is what a country bar should be. Cheap beer, great service, live music and pretty damn good food. The Garlic Parm Mild Wings are ridiculous." — Ryan B., Medford NJ (Yelp Elite)
- "The coolest laid-back cozy place… They make proper drinks (not weak). The meatball roll RULED. I'll always stop here from now on." — Liz F. (Yelp Elite)
- "A local Piney bar; the highest compliment! Prices, service and atmosphere are a total package." — Marybeth P. (Yelp)
- "The tails and wings here are so damn good… There's no food here I can say I don't like." — Blaze C. (Yelp)

> Note: the current site's "Reviews" section is just a "Reviews coming soon!" placeholder — this real social proof is going completely unused. The rebuild should surface ratings + rotating testimonials prominently.

---

## 7. Current website audit (why a refresh is justified)

GoDaddy Website Builder template. Pages: Home · Calendar · What's New ("The Happenings") · Menu Front · Menu Back · Hours/Contact · Opt In.

**Problems to fix:**
1. **Menus are scanned PDFs** — don't render inline, unreadable on phones, can't be updated easily, invisible to Google/SEO. Biggest issue. (The full menu in Section 4 above is the OCR'd content for rebuilding these as real HTML.)
2. **Specials/events are a single static image** on the Calendar page — same problems as the menus.
3. **Content rendered as images / non-semantic markup** — text extraction returns almost nothing → poor SEO and accessibility.
4. **Empty pages** — "What's New / The Happenings" has no content; events really live on Facebook.
5. **Reviews section is a placeholder** ("coming soon") despite a strong Google rating.
6. **Confusing navigation** — duplicate "Menu Back" links (`/menu-back` vs `/menu-back-1`).
7. **No structured data** (hours, menu, business) for local search.
8. **Generic builder look** that underuses the strong Jersey Devil brand.
9. Hours/Contact page *does* have a working embedded Google map and a contact form — keep these.

---

## 8. Recommended site for the rebuild (content & features)

**Primary goals:** make it trivially easy on a phone to (1) read the menu, (2) get hours/directions/phone, (3) see specials & events, and (4) call to place a takeout order.

### Pages / sections
- **Home** — bold Jersey Devil hero, the "your local bar" tagline, today's hours + open/closed status, primary CTAs (View Menu, **Call for Takeout**, Directions), signature items (the Tails), social-proof bar (4.5★ Google / 4.8★ Facebook + a rotating testimonial), this week's specials/events, Instagram feed.
- **Menu** — real, responsive HTML built from Section 4 (no PDFs). Sections: Wings/Tails/Ears, Finger Foods, Soups & Salads, Fries & More, Sandwiches & Grills, Wraps, Burgers, Cheesesteaks, Quesadillas, Pizza, Kids, Desserts, Party Trays. Tag spicy / vegetarian (Impossible burger, Veggie quesadilla) / **gluten-free (GF pizza)**. Show the sauce list. Keep a "Download PDF" link as a secondary option only. Surface Full vs Late Night with their time windows.
- **Specials & Events** — daily specials, weekly Karaoke (Sat) & Music Bingo (Tue), and the rotating Roll/Soup/Cake of the week/month. Built to be edited monthly by a non-technical owner.
- **About** — local story, opened 2012, the Jersey Devil / Pine Barrens angle, the Pic-A-Lilli family pedigree, staff personality (Mary Ann's soups, Aimee's cakes, bartender Reenie), the "your local bar" voice. Call out amenities customers love: **pool tables, jukebox, live music, trivia/music bingo, and dog-friendly outdoor seating** (with photos).
- **Hours & Location** — keep the embedded Google map; full hours table (bar / kitchen / late-night); click-to-call; directions; parking note.
- **Takeout** — clear "Call (609) 388-5386 to order" with hours; mention party trays for catering. **No online-ordering integration** (they don't offer it). Leave room to add one later if they adopt a POS/ordering provider.
- **Careers / "We're Hiring"** — keep the existing application form; they actively recruit.
- **Contact** — form + email (wendyonemore@gmail.com) + phone, with a dietary/event-request prompt.
- **Email/SMS opt-in** — keep; they already collect subscribers.

### Technical / build notes for Claude Code
- **Mobile-first** — most traffic is phones checking hours and menu.
- Real semantic HTML for all menu / hours / specials content (no image-only text).
- Add `Restaurant` + `Menu` + `OpeningHoursSpecification` JSON-LD structured data.
- Local SEO: titles/meta around "wings / bar & grill Tabernacle NJ"; NAP consistency with the Google listing.
- Click-to-call and click-for-directions on mobile.
- Dark tavern aesthetic (black / red / amber) consistent with the logo; feature the Jersey Devil brand.
- Accessibility: alt text, color contrast, keyboard nav.
- Make menu, hours, and specials editable by a non-technical owner (CMS, markdown, or a clearly documented data file). Specials especially rotate weekly/monthly.

---

## 9. Open items to confirm before/while building
- **Competitor audit** — intentionally skipped (conflict of interest).
- **Menu & testimonials** — confirmed: menu (Section 4) and testimonial quotes (Section 6) are approved to transcribe/publish as-is.
- **POS system** — unknown. Confirm what they use (affects any future ordering/loyalty integration).
- **Reservations / large parties / events** — do they take bookings? Determines whether to add a booking flow.
- **Assets** — food photos and a logo crop are in `assets/` (see Section 12). Still needed: a vector/high-res logo, plus interior, event (live music/karaoke), patio, and beer/cocktail photos.
- **Domain** — keep onemorebng.org or move to a cleaner domain?

---

## 10. Design direction (reference: lepainquotidien.com/be/en)

PJ flagged Le Pain Quotidien's site as a design reference. LPQ is a rustic-European bakery/café — a very different brand from a Pine Barrens dive bar — so the goal is to **borrow its underlying principles, not its look.** Don't make One More airy, beige, and minimalist; keep it dark, gritty, and Jersey Devil. What's worth stealing is *how LPQ tells its story and structures the experience.*

**What LPQ does well (the transferable philosophy):**
1. **Story- and provenance-led.** The brand leads with heritage and craft — "©1990 → 2026," an "Atelier" tour, "Four ingredients. Millions of loaves. One tradition.," and a communal-table origin story (tables built from reclaimed Belgian train-floor wood). The site sells a story, not just a menu.
2. **A single ownable metaphor.** Everything ladders up to "the communal table" / "The Daily Bread." One clear idea repeated everywhere.
3. **Short, sensory, declarative copy.** "Simple. Fresh. Honest." · "Welcome to the communal table." · "Food nourishes not only the body, but also the soul." Punchy three-word taglines and warm, human voice.
4. **Photography-led, generous whitespace.** Big, full-bleed, high-quality food photography on clean textured backgrounds, lots of room to breathe, an editorial/magazine rhythm rather than a cluttered template.
5. **Editorial content engine.** A "Magazine," behind-the-scenes kitchen videos, "Better Choices" nutrition stories — reasons to come back beyond the menu.
6. **Clean structure & clear conversion paths.** Minimal nav (Menu, Locations), with obvious routes to Order Online, Catering, Gift Cards, and a loyalty club (Tartine Club app).

**How to translate each to One More (in its own voice):**
1. **Lead with the One More story** — opened 2012, the Pic-A-Lilli family pedigree, the Jersey Devil / Piney-bar identity, staff characters (Mary Ann's soups, Aimee's cakes, Reenie behind the bar). Give it an "our story" section with real warmth and grit.
2. **Own one metaphor:** "your local bar" / "the Piney bar where the Jersey Devil drinks." Repeat it.
3. **Three-word, bar-voice taglines** instead of bakery-poetry — e.g., "Wings. Beer. Locals." / "Cold beer, whole wings." Keep the existing self-deprecating tone ("just your local bar trying to get through the day like you").
4. **Photography-led, but dark and moody** — big shots of saucy Tails, the bar, the patio, live music nights, on black/wood backgrounds. Same generous-whitespace discipline, opposite color temperature.
5. **A "Happenings" content engine** — instead of a static calendar image: rotating specials, event recaps, the Soup/Cake/Roll of the week, music-bingo and karaoke nights. This is One More's version of the Magazine.
6. **Clean structure, clear actions** — minimal nav with obvious CTAs: View Menu, **Call for Takeout** (no online ordering), Directions, See Specials. Keep the existing email/SMS opt-in as the loyalty analog to Tartine Club.

**Net:** adopt LPQ's *storytelling, craft-and-community ethos, photography-first layout, sensory copy, and clean conversion structure* — but execute it all in One More's dark, playful, dive-bar visual language (black / red / amber, Jersey Devil, reclaimed-wood texture rather than white plaster). Think "the soul of LPQ's storytelling, dressed as a Pine Barrens tavern."

---

## 11. Animation & interaction spec (the "wow factor")

Confirmed via live DOM/React inspection of lepainquotidien.com. This is the motion system to recreate — in One More's dark, gritty voice, not LPQ's airy one. The dominant signature is **scroll-scrubbed, not time-based**: almost nothing fires on its own; everything is driven by the user's scroll, smoothed by inertia.

### Confirmed tech stack to replicate the feel
- **Lenis** — smooth/inertia scrolling. Config: `lerp: 0.1`, custom exponential ease-out `t => Math.min(1, 1.001 - Math.pow(2, -10*t))`, `smoothWheel: true`, vertical. This is what makes scrolling feel like "floating on water / moving through honey."
- **Framer Motion** — all scroll-linked animation via `useScroll` / `useTransform` (opacity, `translateY`, `filter: blur`). No GSAP, no ScrollTrigger.
- **Next.js (App Router) + Tailwind CSS** — layout, durations, easings as utilities.
- **ReactPlayer + HLS.js** — the full-bleed autoplaying section video.
- **One site-wide custom easing:** `cubic-bezier(0.49, 0.03, 0.13, 0.99)` — very slow start, sharp deceleration (drifts, then snaps).

### The signature effects, mapped to One More
1. **Sticky parallax hero (theirs: 300vh tall).** A `sticky` hero ~3 viewports tall with a `fixed h-screen` panel inside; you stay pinned while scrolling through it. Background image pre-scaled to `scale(1.15)` with a JS `translateY` parallax drift.
   → *One More:* pin on a dark hero — the Jersey Devil logo over a moody shot of the bar / saucy Tails, with the same slow parallax drift.
2. **Scroll-scrubbed cycling headline with word-by-word brighten.** A stacked list of phrases clipped to one visible line; `translateY` scrubs them upward as you scroll, while each word's `opacity` ramps `0 → 1` as it enters the "active zone" (graduated values like 0.07 → 0.40 → 0.73 → 1.0). Dark ahead, bright behind.
   → *One More:* cycle short bar lines — e.g. *"Cold beer." / "Whole wings — not just pieces." / "Your local bar." / "Where the Jersey Devil drinks."* Same word-by-word light-up.
3. **Infinite scroll-cue arrows** looping inside an `overflow-hidden` circle via `requestAnimationFrame`. → keep as-is.
4. **Sticky nav with animated logo swap.** Fixed bordered bar; the center logo runs a 30s loop swapping the wordmark for the italic tagline (slides up/in), and swaps instantly on hover (`0.5s` custom cubic-bezier).
   → *One More:* swap the One More wordmark ⇄ "just your local bar trying to get through the day like you." Keep a colored accent strip (their `dough-500` → One More red/amber) that hides on flagged sections.
5. **Sticky card stack** (menu / catering / gift). Large two-column cards that `sticky`-stack on scroll; a **handwritten script accent** (yellow italic brush font, `rotate(-2deg)`) sits above the bold block headline — that's the "highlight," purely typographic, no SVG. Each card's circular CTA button hides at `translateY(80px)` below the edge and **glides up on hover** (`700ms`, custom easing).
   → *One More:* stack Menu / Specials / Takeout cards; script accent in red or amber marker font over the block headline; hover-reveal "View Menu" / "Call to Order" buttons.
6. **Scattered "polaroid" food cards.** Four photos start at `translateY(600px) rotate(24deg)` (below, uniformly tilted) and, on scroll-enter, settle to scattered final rotations (`-9°, +2°, -4°, +3°`) — a one-shot fly-in (~600–800ms), not a scrub.
   → *One More:* perfect for scattered polaroids of Tails, wings, burgers, the bar — high-energy, casual, on-brand.
7. **Scroll-pinned video reveal (theirs: 200vh sticky).** Full-bleed HLS video behind layered overlays that `translateY` off-screen as you scroll: a dark scrim, a colored `mix-blend-lighten` overlay carrying a big headline (black text reads creamy over dark video), plus a ghost/outlined twin headline for depth, and a CTA that rises with it.
   → *One More:* a looping video of wings being sauced / a busy Friday night, overlay lifting to reveal it, headline **"WINGS. BEER. LOCALS."** in the mix-blend treatment.
8. **Big typographic headline word fade-in** — `opacity + filter:blur + translate3d` per word, fires once on viewport entry.
9. **Heritage timeline** — sticky white banner with `©1990 → 2026` in heavy display type, content cards scrolling over it via z-index stacking (no explicit animation). → *One More:* `©2012 → 2026`.
10. **Editorial/magazine cards** — image scales slightly on hover (`group-hover`); text static. → *One More:* the "Happenings" / events cards.

### Timing & feel
Slow, luxurious, scroll-scrubbed. Lenis `lerp 0.1` gives heavy inertia (momentum carries ~2–3× past where you stop). Reveals are pace-controlled by the user, not fixed durations; hover transitions ~0.5–0.7s on the custom cubic-bezier.

### One More adaptation notes (important)
- **Keep the techniques, adjust the temperament.** LPQ's "moving through honey" reads as refined-European. A Piney dive bar should feel a touch more **alive and punchy** — consider a slightly higher Lenis lerp (~0.12–0.15) and snappier reveals so it's energetic, not sleepy. Preserve the scroll-scrubbed wow; lose the slow-luxury calm.
- **Dark, tactile execution:** black / red / amber, reclaimed-wood and chalkboard textures instead of white plaster/marble; Jersey Devil motifs.
- **Performance & accessibility:** honor `prefers-reduced-motion` (disable scrub/parallax, fall back to simple fades); test the pinned/scrubbed sections on mobile — heavy scroll-jacking can feel broken on phones, so provide a lighter mobile variant. The site must stay fast (most traffic is phones checking hours/menu).
- **Don't over-animate the utility pages.** Menu, hours, and takeout should be instant and frictionless; spend the wow budget on the home page and the story/specials sections.

---

## 12. Project files & assets

Everything below lives in this project folder.

**Docs**
- `website-refresh-brief.md` — this file.
- `animation-spec.md` — standalone motion spec (same content as Section 11, for separate handoff).
- `assets/image-assets.md` — photo manifest: alt-text, captions, suggested web filenames, and usage notes for each image.

**Brand graphics — `assets/`**
- `one-more-logo-hero.png` (2402×660) — logo lockup with the Jersey Devils, on black. Re-export from vector if available.
- `monthly-specials-calendar.png` (1500×1368) — June specials/entertainment calendar. **Reference only** — rebuild as HTML (see Section 5), don't display the image.

**Food photography — `assets/`** (One More's own, cleared to use; details + alt-text in `image-assets.md`)
- `Buffalo Wings.jpg`, `Buffalo Wings 2.jpg`, `Tails.jpg`, `Gator Bites.jpg`, `Bruschetta Sandwich.jpg`, `Dessert 1.jpg`.
- Note: `Tails.jpg` is low-res (720×960) — don't use full-bleed. Wings/Bruschetta are highest-res; several shots are on black backgrounds (drop straight into dark sections).

**Reference (not for display) — `assets/`**
- `screencapture-onemorebng-org-*.png` — full-page captures of the current site (home, calendar, menu front/back, hours/contact) used for the audit and OCR.
- `Website Inspiration.html` (+ `_files/`) — saved Le Pain Quotidien page, the design/animation reference.

---

*Sources: current site onemorebng.org (Home, Calendar, Menu Front, Menu Back, Hours/Contact, What's New) and its menu PDFs, transcribed via OCR from full-page screenshots; Google Business listing for One More Bar & Grill, Tabernacle NJ; review themes and quotes compiled from Google, Facebook, Yelp, TripAdvisor and Postcard via a browser-extension scrape; Instagram and Nextdoor public listings; Trentonian (2012 opening); Weird New Jersey; design-reference and live animation/DOM inspection of lepainquotidien.com/be/en.*
