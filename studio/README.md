# Sanity Studio — setup

The Studio is the screen the owner logs into to change specials and swap the
monthly calendar. It is a separate app from the website: this folder builds and
deploys on its own, and the website in `site/` just *reads* from it.

## Current state — already done

| | |
|---|---|
| Project | **One More Bar and Grill** — `1gjbq9h5` |
| Studio (deployed) | <https://onemorebng.sanity.studio> — app id `jijj0di8rosp6gui5e9tih2n` |
| Dataset | `production`, **public** (readable with no API token) |
| Project ID wired into | `sanity.config.js`, `sanity.cli.js`, `site/assets/js/sanity-config.js` |
| CORS origins | `https://onemorebng.org`, `https://www.onemorebng.org`, `http://localhost:8099`, `http://localhost:3333` |
| Specials & Events | **seeded** from the values in `data.js`, verified rendering live on the site |
| Monthly Calendar | **not created yet** — needs an image upload, see below |

### The one thing left: the calendar image

The Studio's calendar document doesn't exist yet, because the image has to be
uploaded through the Studio (there's no CLI command for asset uploads). Until
it's done the calendar page falls back to `data.js`, which currently shows the
correct August image — so nothing is broken, it just isn't owner-editable yet.

To finish it: run the Studio, open **Monthly Calendar**, upload
`site/assets/img/aug-calendar-2026.jpg` (or the current month's), fill in the
description, and press **Publish**.

---

## Running it

```bash
cd studio
npm install
npm run dev
```

That opens the Studio at <http://localhost:3333>. The first run asks you to log
in through the browser.

To push changes to the hosted Studio (after editing a schema, say):

```bash
npm run deploy
```

The hostname and app id are pinned in `sanity.cli.js`, so this always lands on
<https://onemorebng.sanity.studio> and never prompts.

Note that a deployed studio is reached through Sanity's org dashboard — the
`.sanity.studio` address redirects to `sanity.io/@<org>/studio/<appId>`. That's
why it only appears on the Sanity website *after* a deploy; building locally
isn't enough.

### Giving the owner access

Invite them under **Project → Members** at
<https://www.sanity.io/manage/project/1gjbq9h5>. An **Editor** seat lets them
change content but not settings or schema — that's the seat you want. They sign
in with Google or GitHub; there's no separate password to issue.

---

## A note on empty fields

**Empty lists in Sanity are ignored, per-list.** If the `rotating` array is
blank, the site keeps showing the `data.js` version rather than rendering an
empty section. This is deliberate — a half-filled Studio can't blank out the
page — but it does mean a list you haven't filled in yet will look like editing
it "does nothing." Specials & Events is already seeded, so this only applies to
anything added later.

## Publish delay

Sanity's CDN takes up to about a minute to serve a change after Publish. This
was measured, not guessed: right after seeding, the CDN kept returning the old
(empty) response for roughly a minute before catching up. If an edit hasn't
appeared, wait a minute and refresh before assuming something is broken.

---

## How the site uses it

`site/assets/js/main.js` renders every section from `data.js` immediately, then
fetches Sanity in the background and re-renders the sections Sanity covers. The
consequences are worth knowing:

- The page never waits on the network and is never blank.
- If Sanity is slow, unreachable, or returns an error, the visitor sees the
  `data.js` content. No error, no empty section.
- Because `data.js` is a live fallback, **keep it roughly in sync**. If it drifts
  badly and Sanity has an outage, visitors would see very stale specials.
- Content edits made in the Studio do **not** appear in git history.

### What Sanity controls vs. what stays in the repo

| In Sanity (owner edits) | In the repo (developer edits) |
|---|---|
| Daily specials | All page copy in the HTML |
| Weekly events | Signature/polaroid photos + captions |
| Rotating features (soup, cake, roll) | Sauces list, ratings, hours |
| The monthly calendar image | Everything about layout and design |

Deliberately small. Everything not in the left column stays editable the normal
way — edit the file, commit, push.
