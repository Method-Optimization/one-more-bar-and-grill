# The build — how content gets from Sanity onto the page

Every word, price and photo on the site is stored in Sanity and written into
`site/*.html` and `site/assets/js/data.js` by `npm run build`. The pages that
ship are ordinary static HTML: a visitor with JavaScript disabled, and Google's
crawler, get the finished page with no CMS in the loop.

```
Sanity Studio          content.json            site/*.html
(the owner edits)  ->  (committed snapshot) ->  site/assets/js/data.js
                                                (what Cloudflare serves)
```

## Commands

```bash
npm run build            # fetch from Sanity, then write the site
npm run build:offline    # write the site from content.json, no network
npm run extract          # re-derive content.json from the site files (migration only)
```

## The pieces

| File | What it does |
|---|---|
| `build/build.mjs` | The build. Fetches, merges, writes the four output files. |
| `build/sanity.mjs` | The GROQ query and both directions of the Sanity ⇄ `content.json` translation. |
| `build/render.mjs` | Every content-to-HTML function. |
| `build/lib.mjs` | Escaping, entity handling, and the marker surgery. |
| `build/extract.mjs` | One-time migration: reads the content back out of the hand-written pages. |
| `build/make-seed.mjs` | Turns `content.json` into the documents the seed script pushes. |
| `content.json` | The committed snapshot the render actually reads. |

## Why markers instead of templates

The pages are not generated from templates. Each editable stretch of HTML is
fenced off in the real file:

```html
<div class="showcase__head">
  <!-- OM:showcase-head:start -->
  <span class="script">the good stuff</span>
  <h2 class="reveal-words">Our Favorites</h2>
  <!-- OM:showcase-head:end -->
</div>
```

The build replaces what is between the markers and touches nothing else. So the
HTML stays a readable, hand-editable file — you can still open `index.html` and
see the whole page — and the diff of a content change shows only the lines that
actually changed. A missing marker stops the build rather than silently
skipping a region.

## Why content.json is committed

It is the build's real input; Sanity is where it comes from.

- A build works when Sanity is down or the network is out.
- Every content change lands in git history as a reviewable diff, and can be
  reverted like any other change.
- The seed and the round-trip checks have something concrete to compare against.

If Sanity is unreachable, the build says so and uses the snapshot. It never
fails because a CMS is having a bad day.

## What happens on Publish

1. The owner presses **Publish** in the Studio.
2. A Sanity webhook POSTs to GitHub's `repository_dispatch` API.
3. `.github/workflows/rebuild.yml` runs `npm run build`, commits the changed
   files, and pushes to `main`.
4. Cloudflare deploys the push like any other commit.

Roughly two to three minutes end to end. Nothing is committed if nothing
changed, so a stray webhook costs nothing.

Alongside that, `site/assets/js/main.js` still fetches specials and the calendar
from Sanity at page load and overlays them. That is a deliberate belt and
braces: those two are the highest-churn content, and if the rebuild pipeline
ever breaks they keep updating on their own. Everything else — the menu
included — comes from the built HTML.

### Setting the webhook up

The workflow already accepts `workflow_dispatch`, so the **Run workflow** button
on the Actions tab works with no further setup. To have Publish trigger it:

1. Create a GitHub fine-grained personal access token with **Contents: write**
   on `Method-Optimization/one-more-bar-and-grill`.
2. In <https://www.sanity.io/manage/project/1gjbq9h5> → **API → Webhooks**, add
   a webhook:
   - URL: `https://api.github.com/repos/Method-Optimization/one-more-bar-and-grill/dispatches`
   - Trigger on: Create, Update, Delete
   - Filter: `_type in ["siteSettings","homePage","menuPage","calendarPage","menuCategory","specials","calendar"]`
   - HTTP method: `POST`
   - Headers: `Authorization: Bearer <the token>`, `Accept: application/vnd.github+json`
   - Body: `{"event_type": "sanity-publish"}`

## The migration, and why it can be trusted

`content.json` was not retyped by hand. `build/extract.mjs` read it back out of
the pages that were already live, and the result was checked in both
directions:

- **Render check** — `content.json` rendered back through `build/render.mjs`
  reproduces `index.html` and `calendar.html` exactly, and `menu.html` apart
  from one added `og:locale` tag. The regenerated `data.js` evaluates to an
  identical object.
- **Sanity check** — `content.json` → Sanity documents → back through the query
  shape → `content.json` is identical.

All 17 menu sections and 144 items came across without a keystroke.

## Adding a new editable region

1. Wrap the region in `<!-- OM:name:start -->` / `<!-- OM:name:end -->`.
2. Add a render function to `build/render.mjs`.
3. Add the field to the matching schema in `studio/schemas/`.
4. Map it in both directions in `build/sanity.mjs`.
5. Call `replaceRegion` for it in `build/build.mjs`.
6. `npm run build:offline` and check the diff is only what you expected.
