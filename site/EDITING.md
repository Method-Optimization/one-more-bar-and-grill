# Updating the One More website — the simple guide

You don't need to know any code. Almost everything you'll ever want to change
lives in **one file**:

```
site/assets/js/data.js
```

Open it in **Notepad** (right-click → Open with → Notepad) or any text editor.
Change the words *between the quotation marks*, keep the quotes and commas where
they are, **save**, then refresh the website.

---

## The things you'll change most often

Look for the section marked **ROTATING FEATURES ★ UPDATE THESE OFTEN ★**:

```js
rotating: [
  { label: "Soup of the Week",  value: "Mary Ann's homemade — ask your server" },
  { label: "Cake of the Week",  value: "Aimee's homemade cake" },
  { label: "Roll of the Month", value: "Cuban Roll" },
  { label: "Dessert Roll of the Month", value: "Strawberry Cheesecake Roll" }
]
```

Just change the text after `value:`. For example, to set July's roll:

```js
  { label: "Roll of the Month", value: "Philly Roll" },
```

## Daily specials

```js
dailySpecials: [
  { day: "Monday", deal: "$10 your-choice burger & fries" },
  ...
]
```

Change the text after `deal:`. The current day automatically gets a red
**TODAY** tag on the site — you don't do anything for that.

## Events, testimonials, sauces

Same idea — find the section (`weeklyEvents`, `testimonials`, `sauces`) and edit
the text between quotes.

---

## Rules so you don't break it

1. Keep every `"quotation mark"` — text always sits between two of them.
2. Keep the commas at the end of each line.
3. Don't delete the `{ }` braces or the `[ ]` brackets.
4. If something looks broken after editing, undo your change (Ctrl+Z) and save again.

> Tip: make a copy of `data.js` before a big edit. If anything goes wrong, you
> can put the copy back.

---

## Photos

Food photos live in `site/assets/img/`. To swap one, drop a new image in that
folder and point to it in `data.js` under `signatureItems` (the `img:` line).
For best results use a photo that's wider/taller than ~1000px and saved as a
`.jpg`.

---

## Hours

Hours are in `data.js` under `hours:` (24-hour clock). They drive the live
"Open now / Kitchen closes at" badge **and** the footer table, so you only edit
them in one place. They almost never change — if you do change them, also tell
your developer so the Google/search listing stays in sync.
