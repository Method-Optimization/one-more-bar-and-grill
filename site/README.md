# One More Bar & Grill — website (home page)

A self-contained static site — no framework, no bundler, no runtime
dependencies. `index.html` opens directly in a browser and can be hosted
anywhere static.

The files in this folder are **build output**. Every word, price and photo comes
from the Sanity Studio and is written in by `npm run build` from the repo root;
see [`../build/README.md`](../build/README.md). Edit the HTML directly and the
next build overwrites the parts between the `<!-- OM:...:start -->` markers.
Everything outside those markers is hand-written and stays put.

## Run / preview it
- **Double-click** `index.html`, **or**
- Serve the folder (nicer for testing):
  ```powershell
  cd "site"
  python -m http.server 8080
  # then open http://localhost:8080
  ```

> Fonts and the Lenis smooth-scroll library load from a CDN, so previewing with
> an internet connection looks best. If they fail to load, the site still works
> with system fonts and native scrolling.

## What's here
```
site/
├─ index.html              # the page (semantic HTML + JSON-LD SEO)
├─ assets/
│  ├─ css/style.css        # all styling + responsive + reduced-motion
│  ├─ js/data.js           # GENERATED from Sanity — do not edit by hand
│  ├─ js/main.js           # animations, live hours badge, rendering
│  └─ img/                 # food photos + logo (web-optimized)
├─ EDITING.md              # plain-English guide for the owner
└─ README.md
```

## Design / motion
Dark Pine Barrens tavern: black / blood-red / amber / warm cream, condensed
poster type (Oswald), marker-script accents (Caveat), film grain. Scroll-scrubbed
animations inspired by the project brief — parallax pinned hero, cycling
word-by-word headline, sticky card stack, fly-in polaroids, a video-reveal
section, and a ©2012→2026 heritage banner. All scrubbing/parallax is disabled
under `prefers-reduced-motion` and lightened on small screens.

## Notes / next steps
- **This is the home page** (first pass). Next pages to build: full **Menu**
  (the brief has the complete OCR'd menu as real HTML), **Specials & Events**,
  **About**, **Hours & Location** (embed the Google map), **Takeout**,
  **Contact/Careers**.
- **Video-reveal section** currently uses a slow Ken-Burns zoom on the wings
  close-up as a stand-in. Drop a real looping clip (wings being sauced / a busy
  Friday night) in and swap the `<img>` in `index.html` `#reveal` for a muted,
  autoplay, loop `<video>` — the overlay-lift effect already works.
- **Images:** food photos are compressed; for maximum mobile speed before
  launch, convert them to WebP/AVIF and add `srcset` sizes.
- **Still-needed photos** (per the brief): interior (bar, wood paneling, pool
  tables, jukebox), live music / karaoke nights, the dog-friendly patio, and a
  beer/cocktail shot. These would elevate the hero and the story section.
- **Nav links** smooth-scroll to on-page sections for now; repoint them to the
  Menu/Specials/About/Hours pages once those are built.
