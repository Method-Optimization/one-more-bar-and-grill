# Updating the One More website

Everything on the website is now edited in one place — a web page you log into.
No files, no code, and nothing to install.

> ## https://onemorebng.sanity.studio
>
> Bookmark that. You'll be asked to sign in the first time.

**Nothing goes live until you press Publish.** After you do, the website
updates itself within a few minutes.

---

## What you'll see when you sign in

The list down the left is ordered by how often you'll need it.

| | What's in it |
|---|---|
| **Specials & Events** | The daily specials, Music Bingo and Karaoke, and the rotating soup / cake / roll |
| **Monthly Calendar** | The calendar picture |
| **Home Page** | Every word and photo on the front page |
| **Menu Page** | The wording at the top of the menu page |
| **Menu Sections** | The menu itself — all 17 sections and every item and price |
| **Calendar Page** | The wording at the top of the calendar page |
| **Business Info & Hours** | Address, phone, hours, the menu bar, the footer |

---

## The things you'll change most often

### This month's calendar

Open **Monthly Calendar**, click the picture, upload the new one, update the
description line underneath, and press **Publish**. That's the whole job — no
filenames to get right, no sizes to set. The picture resizes itself to fit
whatever shape you upload.

### Specials

**Specials & Events** has three lists:

- **Daily specials** — one row per day, Sunday first. Whichever day it is gets a
  red **TODAY** tag on the website automatically; you don't set that.
- **Weekly entertainment** — Music Bingo, Karaoke.
- **Rotating features** — Soup of the Week, Cake of the Week, Roll of the Month.

### A price change on the menu

Open **Menu Sections**, click the section the item is in, find the item, change
the price, **Publish**. Drag items up and down to reorder them.

---

## The menu, in more detail

Each section — Fingerfoods, Salads, Wings and so on — is one entry under **Menu
Sections**. Inside a section is a list called **Contents**, which runs down the
page in the order you put it. You can drag anything in it to reorder, and add
four kinds of thing:

| | When to use it |
|---|---|
| **Item list** | The normal one. A group of dishes with prices. |
| **Sub-heading** | Splits a section in two, e.g. "Specialty Pizzas" inside Pizza. |
| **Note** | A line of small print, like the list of dressings under Salads. Tick *Show directly under the section heading* for a note that introduces the whole section. |
| **Name-and-description list** | For lists with no prices — the sauces, the happy hour deals. |

On an individual item:

- **Price** is free text, so "$9", "Cup $8 / Bowl $9.50" and "Market" all work.
- **Sizes instead of one price** is for things sold by the count. Fill it in —
  e.g. `6 pc $9 · 13 pc $15 · 25 pc $27` — and the price field is ignored.
- **Link id** on a section is the bit after the # in the address bar. Changing
  it breaks any existing link to that section, so leave it alone unless you mean
  it.

---

## Photos

You can now swap any photo yourself. Every photo field works the same way: click
it, upload the new picture, and write a short description of what's in it (that
line is for screen readers and for Google, so it's worth doing).

- **Home Page → The three cards** — the three big full-screen cards
- **Home Page → Favorites photos** — the tilted "polaroid" snapshots
- **Monthly Calendar** — the calendar

For best results shoot food photos **taller than they are wide**, at least about
1000px on the short side. If you upload nothing, the photo that's already there
stays.

---

## Hours

**Business Info & Hours → Hours** has one row per day, with the bar and kitchen
times on each. These drive three things at once: the live "Open now / Kitchen
closes at" badge, the footer table, and what Google shows for your listing.

Times are on a 24-hour clock — `11:00` is 11am, `21:00` is 9pm. For a closing
time after midnight, keep counting: `24:00` is midnight and `26:00` is 2am.

The plain-English version in the footer ("Sun – Thu, 11am – 12am") is separate,
under **Hours as written in the footer** — change both if the hours change.

---

## If something doesn't show up

1. Check you pressed **Publish** — a draft doesn't count.
2. Give it about five minutes and refresh.
3. Specials and the calendar update faster than the rest, so if those changed
   and other things didn't, that's normal for the first minute or two.

If it's been longer than that, tell your developer — the rebuild that pushes
your changes to the live site may have failed, and it's fixable from the
GitHub Actions tab.

---

## One thing to know

Empty means "leave it alone", not "delete it". If you clear a list out
completely, the website keeps showing what was there before rather than
rendering an empty section. That's deliberate — a half-finished edit can't blank
out part of the page. But it does mean that if you actually want something gone,
you need to remove that item rather than emptying the whole list around it.
