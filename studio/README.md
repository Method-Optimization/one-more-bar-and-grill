# Sanity Studio

The screen the owner logs into to change the site. It holds **all** the site's
content — the menu included — and is a separate app from the website: this
folder builds and deploys on its own.

The website does not read from Sanity at view time. `npm run build` in the repo
root pulls the content out and writes it into the static HTML, which is what
Cloudflare serves. See [`build/README.md`](../build/README.md) for the pipeline.

## Project

| | |
|---|---|
| Project | **One More Bar and Grill** — `1gjbq9h5` |
| Studio | <https://onemorebng.sanity.studio> — app id `jijj0di8rosp6gui5e9tih2n` |
| Dataset | `production`, **public** (readable with no API token) |
| Project ID wired into | `sanity.config.js`, `sanity.cli.js`, `build/sanity.mjs`, `site/assets/js/sanity-config.js` |
| CORS origins | `https://onemorebng.org`, `https://www.onemorebng.org`, `http://localhost:8099`, `http://localhost:3333` |

## The documents

Six singletons plus one list. Singletons can be edited but not created or
deleted, so the owner can't end up with two home pages or none.

| Type | id | Holds |
|---|---|---|
| `specials` | `specials` | Daily specials, weekly events, rotating features |
| `calendar` | `calendar` | The monthly calendar image |
| `homePage` | `homePage` | Every word and photo on the front page |
| `menuPage` | `menuPage` | The menu page's hero copy |
| `menuCategory` | `menuCategory.<anchor>` | One per menu section — 17 of them |
| `calendarPage` | `calendarPage` | The calendar page's hero copy |
| `siteSettings` | `siteSettings` | Business details, hours, nav, footer |

`menuCategory.blocks` is an ordered array of four block types — `menuItems`,
`menuHeading`, `menuNote`, `menuDefs` — which is what lets a section mix priced
items, sub-headings, small print and price-less lists the way the printed menu
does. `build/render.mjs` switches on `_type` to render each one.

## Running it

```bash
cd studio
npm install
npm run dev      # http://localhost:3333
npm run deploy   # pushes to onemorebng.sanity.studio
```

The hostname and app id are pinned in `sanity.cli.js`, so a deploy always lands
on the same address and never prompts.

A deployed studio is reached through Sanity's org dashboard — the
`.sanity.studio` address redirects to `sanity.io/@<org>/studio/<appId>`. That's
why it only appears on the Sanity website *after* a deploy; building locally
isn't enough.

**Deploy after any schema change.** The hosted Studio runs the schema that was
bundled at deploy time, so a field added here isn't visible to the owner until
`npm run deploy` has run.

### Giving the owner access

Invite them under **Project → Members** at
<https://www.sanity.io/manage/project/1gjbq9h5>. An **Editor** seat lets them
change content but not settings or schema — that's the seat you want. They sign
in with Google or GitHub; there's no separate password to issue.

## Seeding

Done once, already run. It pushed the site's existing content — all 17 menu
sections and 144 items among it — into the Studio.

```bash
node build/make-seed.mjs                                  # from the repo root
cd studio
npx sanity exec scripts/seed-content.mjs --with-user-token
```

`--with-user-token` borrows the login the Sanity CLI already has, so no API
token has to be created, pasted or stored. The script leaves `specials` and
`calendar` alone if they already exist, because the owner had been editing those
before the rest of the site moved in.

`scripts/upload-calendar.mjs` runs the same way and exists because the MCP
connector can't upload binaries.

## Two behaviours worth knowing

**Empty lists are ignored, per field.** If a list comes back blank the build
keeps whatever `content.json` already had rather than rendering an empty
section. A half-filled Studio can't blank out the page — but it does mean a list
you have deliberately emptied will look like editing it "does nothing".

**The CDN lags about a minute after Publish.** Measured, not guessed: right
after seeding, `apicdn.sanity.io` kept returning the old response for roughly a
minute. If a build didn't pick up an edit, wait a minute and run it again before
assuming something is broken.
