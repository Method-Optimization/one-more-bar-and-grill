/* =============================================================================
   SANITY <-> content.json
   -----------------------------------------------------------------------------
   One module holds both directions of the translation, so the seed script and
   the build script can never drift apart on the shape of a document.

   content.json is the build's actual input. Sanity is where it comes from; the
   file is the last-known-good copy, committed so a build still works when the
   API is unreachable and so every content change shows up as a reviewable diff.
   ============================================================================= */

export const PROJECT_ID = "1gjbq9h5";
export const DATASET = "production";
export const API_VERSION = "2024-03-11";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* Ask for the resolved image URL and its real dimensions in the same round
   trip; without the dimensions the page can't reserve the right-shaped box and
   the layout jumps as photos load. */
const PHOTO = `{
  alt, fallback, fallbackWidth, fallbackHeight,
  "url": image.asset->url,
  "width": image.asset->metadata.dimensions.width,
  "height": image.asset->metadata.dimensions.height
}`;

export const QUERY = `{
  "settings": *[_id == "siteSettings"][0],
  "home": *[_id == "homePage"][0]{
    ...,
    stackCards[]{..., photo${PHOTO}},
    signatureItems[]{..., photo${PHOTO}}
  },
  "menuPage": *[_id == "menuPage"][0],
  "calendarPage": *[_id == "calendarPage"][0],
  "specials": *[_id == "specials"][0]{dailySpecials, weeklyEvents, rotating},
  "calendar": *[_id == "calendar"][0]{
    alt, note,
    "img": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  },
  "menu": *[_type == "menuCategory"] | order(order asc){
    title, jumpLabel, anchor, order, comment, blocks
  }
}`;

export function queryUrl() {
  return "https://" + PROJECT_ID + ".apicdn.sanity.io/v" + API_VERSION +
    "/data/query/" + DATASET + "?query=" + encodeURIComponent(QUERY);
}

/* ---------------------------------------------------------------------------
   Sanity -> content.json
   --------------------------------------------------------------------------- */

const has = (v) => Array.isArray(v) ? v.length > 0 : (v !== undefined && v !== null && v !== "");

/* Sanity stamps _key (and sometimes _type) onto every object inside an array.
   They are bookkeeping for the editor, not content, so they are dropped on the
   way into the snapshot — otherwise every reordered row would show up as a
   diff. Menu blocks are the exception and are handled by cleanBlock, which
   rebuilds them and keeps the _type the renderer switches on. */
function cleanRows(v) {
  if (!Array.isArray(v)) return v;
  return v.map(function (row) {
    if (!row || typeof row !== "object") return row;
    const out = {};
    Object.keys(row).forEach(function (k) {
      if (k !== "_key" && k !== "_type") out[k] = row[k];
    });
    return out;
  });
}

/* Take the Sanity value when there is one, otherwise keep what the snapshot
   already had. A half-filled Studio can then never blank out a live section. */
const pick = (v, fallback) => (has(v) ? cleanRows(v) : fallback);

/* Sanity serves the original upload — a phone photo or a scanned calendar can
   be 3000px+ wide. The widest the site ever shows one is under 1000 CSS px, so
   ask its CDN for something sane and let it re-encode to a modern format. The
   width/height attributes are scaled to match, or the page reserves a box the
   image never fills. */
const MAX_IMAGE_WIDTH = 1800;

function cdnImage(url, w, h) {
  if (!url || url.indexOf("cdn.sanity.io") === -1) {
    return { img: url, width: w || null, height: h || null };
  }
  if (!w || w <= MAX_IMAGE_WIDTH) {
    return { img: url + "?auto=format", width: w || null, height: h || null };
  }
  return {
    img: url + "?w=" + MAX_IMAGE_WIDTH + "&q=80&auto=format",
    width: MAX_IMAGE_WIDTH,
    height: h ? Math.round((h * MAX_IMAGE_WIDTH) / w) : null
  };
}

function photoOut(p, fallback) {
  if (!p) return fallback;
  if (p.url) {
    const sized = cdnImage(p.url, p.width, p.height);
    return {
      img: sized.img,
      alt: pick(p.alt, fallback && fallback.alt),
      width: sized.width,
      height: sized.height
    };
  }
  return {
    img: pick(p.fallback, fallback && fallback.img),
    alt: pick(p.alt, fallback && fallback.alt),
    width: pick(p.fallbackWidth, fallback && fallback.width) || null,
    height: pick(p.fallbackHeight, fallback && fallback.height) || null
  };
}

function hoursOut(rows, fallback) {
  if (!has(rows)) return fallback;
  const bar = {}, kitchen = {};
  rows.forEach(function (r) {
    const i = DAYS.indexOf(r.day);
    if (i === -1) return;
    bar[i] = { open: r.barOpen, close: r.barClose };
    kitchen[i] = { open: r.kitchenOpen, close: r.kitchenClose };
  });
  // Every day has to be present or the open/closed badge would read as closed.
  for (let i = 0; i < 7; i++) {
    if (!bar[i]) return fallback;
  }
  return { bar: bar, kitchen: kitchen, summary: fallback.summary };
}

export function fromSanity(r, base) {
  if (!r) return base;

  const s = r.settings || {};
  const h = r.home || {};
  const out = JSON.parse(JSON.stringify(base));

  /* ------------------------------------------------------------- settings */
  if (s.business) Object.assign(out.business, s.business);
  const hours = hoursOut(s.hours, out.hours);
  out.hours = { bar: hours.bar, kitchen: hours.kitchen, summary: pick(s.hoursSummary, out.hours.summary) };
  if (s.chrome) {
    out.chrome.navLinks = pick(s.chrome.navLinks, out.chrome.navLinks);
    out.chrome.callLabel = pick(s.chrome.callLabel, out.chrome.callLabel);
  }
  if (s.footer) Object.assign(out.footer, stripEmpty(s.footer));

  /* ----------------------------------------------------------- home page */
  if (h.seo) Object.assign(out.home.seo, stripEmpty(h.seo));
  ["heroTag", "heroSub", "heroCtaLabel", "heroCtaHref"].forEach(function (k) {
    out.home[k] = pick(h[k], out.home[k]);
  });
  out.home.heroLines = pick(h.heroLines, out.home.heroLines);
  out.home.sauces = pick(h.sauces, out.home.sauces);
  out.home.ratings = pick(h.ratings, out.home.ratings);
  out.home.testimonials = pick(h.testimonials, out.home.testimonials);
  if (h.showcase) Object.assign(out.home.showcase, stripEmpty(h.showcase));
  if (h.specialsHead) Object.assign(out.home.specialsHead, stripEmpty(h.specialsHead));
  if (h.story) Object.assign(out.home.story, stripEmpty(h.story));

  if (has(h.stackCards)) {
    out.home.stackCards = h.stackCards.map(function (c, i) {
      const was = out.home.stackCards[i] || {};
      const photo = photoOut(c.photo, { img: was.img, alt: was.alt, width: was.width, height: was.height });
      return {
        script: pick(c.script, was.script),
        title: pick(c.title, was.title),
        body: pick(c.body, was.body),
        linkLabel: pick(c.linkLabel, was.linkLabel),
        linkHref: pick(c.linkHref, was.linkHref),
        img: photo.img, alt: photo.alt, width: photo.width, height: photo.height
      };
    });
  }

  if (has(h.signatureItems)) {
    out.home.signatureItems = h.signatureItems.map(function (it, i) {
      const was = out.home.signatureItems[i] || {};
      const photo = photoOut(it.photo, { img: was.img, alt: was.alt });
      return {
        img: photo.img,
        alt: photo.alt,
        caption: pick(it.caption, was.caption),
        note: pick(it.note, was.note)
      };
    });
  }

  /* ------------------------------------------------- specials & calendar */
  if (r.specials) {
    out.specials.dailySpecials = pick(r.specials.dailySpecials, out.specials.dailySpecials);
    out.specials.weeklyEvents = pick(r.specials.weeklyEvents, out.specials.weeklyEvents);
    out.specials.rotating = pick(r.specials.rotating, out.specials.rotating);
  }
  if (r.calendar && r.calendar.img) {
    const cal = cdnImage(r.calendar.img, r.calendar.width, r.calendar.height);
    out.calendar = {
      img: cal.img,
      alt: pick(r.calendar.alt, out.calendar.alt),
      note: pick(r.calendar.note, out.calendar.note),
      width: cal.width,
      height: cal.height
    };
  }

  /* --------------------------------------------------- menu & other pages */
  if (r.menuPage) {
    if (r.menuPage.seo) Object.assign(out.menu.seo, stripEmpty(r.menuPage.seo));
    if (r.menuPage.hero) Object.assign(out.menu.hero, stripEmpty(r.menuPage.hero));
  }
  if (r.calendarPage) {
    if (r.calendarPage.seo) Object.assign(out.calendarPage.seo, stripEmpty(r.calendarPage.seo));
    if (r.calendarPage.hero) Object.assign(out.calendarPage.hero, stripEmpty(r.calendarPage.hero));
  }

  if (has(r.menu)) {
    out.menu.categories = r.menu.map(function (c) {
      return {
        anchor: c.anchor,
        comment: c.comment || String(c.anchor || "").toUpperCase(),
        title: c.title,
        jumpLabel: c.jumpLabel || c.title,
        blocks: (c.blocks || []).map(cleanBlock)
      };
    });
  }

  return out;
}

/* Sanity adds _key and _type to everything inside an array. _type is what the
   renderer switches on, so it stays; the keys are noise in the snapshot. */
function cleanBlock(b) {
  const out = { _type: b._type };
  if (b._type === "menuItems") {
    out.items = (b.items || []).map(function (i) {
      const o = { name: i.name };
      if (i.lead) o.lead = i.lead;
      if (i.price) o.price = i.price;
      if (i.desc) o.desc = i.desc;
      if (i.tiers) o.tiers = i.tiers;
      return o;
    });
  } else if (b._type === "menuDefs") {
    out.entries = (b.entries || []).map(function (e) {
      return { term: e.term, detail: e.detail || "" };
    });
  } else if (b._type === "menuNote") {
    if (b.top) out.top = true;
    if (b.lead) out.lead = b.lead;
    out.text = b.text;
  } else if (b._type === "menuHeading") {
    out.text = b.text;
  }
  return out;
}

function stripEmpty(o) {
  const out = {};
  Object.keys(o || {}).forEach(function (k) {
    if (k.charAt(0) === "_") return;
    if (has(o[k])) out[k] = o[k];
  });
  return out;
}

/* ---------------------------------------------------------------------------
   content.json -> Sanity documents
   --------------------------------------------------------------------------- */

let keyN = 0;
const key = () => "k" + (keyN++).toString(36) + Date.now().toString(36);

function keyed(arr, type) {
  return (arr || []).map(function (o) {
    const out = Object.assign({ _key: key() }, o);
    if (type) out._type = type;
    return out;
  });
}

function photoIn(item) {
  return {
    _type: "object",
    alt: item.alt || "",
    fallback: item.img || "",
    fallbackWidth: item.width || undefined,
    fallbackHeight: item.height || undefined
  };
}

export function toSanity(c) {
  const docs = [];

  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    business: c.business,
    hours: DAYS.map(function (day, i) {
      return {
        _key: key(),
        _type: "dayHours",
        day: day,
        barOpen: c.hours.bar[i].open,
        barClose: c.hours.bar[i].close,
        kitchenOpen: c.hours.kitchen[i].open,
        kitchenClose: c.hours.kitchen[i].close
      };
    }),
    hoursSummary: keyed(c.hours.summary),
    chrome: {
      navLinks: keyed(c.chrome.navLinks),
      callLabel: c.chrome.callLabel
    },
    footer: c.footer
  });

  docs.push({
    _id: "homePage",
    _type: "homePage",
    seo: c.home.seo,
    heroTag: c.home.heroTag,
    heroSub: c.home.heroSub,
    heroCtaLabel: c.home.heroCtaLabel,
    heroCtaHref: c.home.heroCtaHref,
    heroLines: c.home.heroLines,
    stackCards: c.home.stackCards.map(function (card) {
      return {
        _key: key(),
        _type: "stackCard",
        script: card.script,
        title: card.title,
        body: card.body,
        linkLabel: card.linkLabel,
        linkHref: card.linkHref,
        photo: photoIn(card)
      };
    }),
    showcase: c.home.showcase,
    signatureItems: c.home.signatureItems.map(function (it) {
      return {
        _key: key(),
        _type: "signatureItem",
        photo: photoIn(it),
        caption: it.caption,
        note: it.note
      };
    }),
    sauces: c.home.sauces,
    specialsHead: c.home.specialsHead,
    ratings: keyed(c.home.ratings),
    testimonials: keyed(c.home.testimonials),
    story: c.home.story
  });

  docs.push({ _id: "menuPage", _type: "menuPage", seo: c.menu.seo, hero: c.menu.hero });
  docs.push({
    _id: "calendarPage", _type: "calendarPage",
    seo: c.calendarPage.seo, hero: c.calendarPage.hero
  });

  docs.push({
    _id: "specials",
    _type: "specials",
    dailySpecials: keyed(c.specials.dailySpecials),
    weeklyEvents: keyed(c.specials.weeklyEvents),
    rotating: keyed(c.specials.rotating)
  });

  c.menu.categories.forEach(function (cat, i) {
    docs.push({
      _id: "menuCategory." + cat.anchor,
      _type: "menuCategory",
      title: cat.title,
      jumpLabel: cat.jumpLabel,
      anchor: cat.anchor,
      order: (i + 1) * 10,
      comment: cat.comment,
      blocks: cat.blocks.map(function (b) {
        const out = { _key: key(), _type: b._type };
        if (b._type === "menuItems") {
          out.items = keyed(b.items, "menuItem");
        } else if (b._type === "menuDefs") {
          out.entries = keyed(b.entries);
        } else {
          if (b.lead) out.lead = b.lead;
          if (b.top) out.top = true;
          out.text = b.text;
        }
        return out;
      })
    });
  });

  return docs;
}
