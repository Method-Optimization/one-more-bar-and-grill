# Updating the One More website — the simple guide

There are now **two** places things get changed, depending on what it is.

## 1. The website editor (specials, events, calendar)

The things that change every week or month are edited in a web page you log into
— no files, no code, and it goes live on its own:

> ## https://onemorebng.sanity.studio
>
> Bookmark that. You'll be asked to sign in the first time.

Sign in and you'll see two items:

- **Specials & Events** — the daily specials, weekly entertainment, and the
  rotating soup / cake / roll of the week
- **Monthly Calendar** — the calendar picture

To put up a new month's calendar: open **Monthly Calendar**, click the picture,
upload the new one, update the description line, and press **Publish**. That's
the whole job — no filenames to get right, no sizes to set.

**Nothing is live until you press Publish.** Changes show up on the website
within a minute or so.

## 2. The content file (everything else)

Things that almost never change — the food photos, the sauce list, hours, and
all the wording on the pages — still live in:

```
site/assets/js/data.js
```

Ask your developer to change these. They need a code change to go live, so
editing this file on your own computer won't update the public website.

---

## The things you'll change most often

All of these live in the **website editor** (part 1 above), not in any file:

| What | Where in the editor |
|---|---|
| Soup / Cake / Roll of the week | Specials & Events → *Rotating features* |
| Monday's burger deal, Sunday wings, etc. | Specials & Events → *Daily specials* |
| Music Bingo, Karaoke times | Specials & Events → *Weekly entertainment* |
| This month's calendar picture | Monthly Calendar |

Two handy things the site does by itself:

- Whichever day it is gets a red **TODAY** tag automatically. You don't set that.
- The calendar picture resizes itself to fit, whatever shape you upload.

> **If you change something and the website doesn't update:** check you pressed
> **Publish**, then refresh the page. If it still shows the old wording after a
> few minutes, tell your developer — there's a backup copy of this content in
> the site's files that may need updating too.

---

## Photos

The **calendar picture** is the one you can change yourself — it's in the
website editor, described above.

The **food photos** (the tilted "polaroid" snapshots and the big cards) are a
developer job. They live in `site/assets/img/` and are pointed at from `data.js`
under `signatureItems`. They get cropped, compressed and given descriptions to
match the design, which is why they aren't in the editor. Send your developer
the photo and they'll place it — for best results shoot it taller than it is
wide, at least ~1000px.

---

## Hours

Hours are in `data.js` under `hours:` (24-hour clock). They drive the live
"Open now / Kitchen closes at" badge **and** the footer table, so you only edit
them in one place. They almost never change — if you do change them, also tell
your developer so the Google/search listing stays in sync.
