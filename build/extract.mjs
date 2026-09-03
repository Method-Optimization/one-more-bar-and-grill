/* =============================================================================
   EXTRACT — read the content back out of the hand-written site
   -----------------------------------------------------------------------------
   Run once, to migrate. It reads the three pages plus data.js and writes
   content.json: the same content the site already ships, in the shape Sanity
   will store it and the shape build.mjs renders from.

       node build/extract.mjs

   The point of doing it this way — rather than retyping 138 menu items into the
   Studio — is that build.mjs can then re-render content.json and the result is
   compared against the file it came from. Nothing is lost in the move.
   ============================================================================= */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import { decodeEntities, ROOT, SITE } from "./lib.mjs";

/* Markers are stripped before parsing so this migration script keeps working
   after the pages have been marked up. */
const read = (p) =>
  readFileSync(join(SITE, p), "utf8").replace(/<!-- OM:[a-z-]+:(?:start|end) -->/g, "");
const d = (s) => (s == null ? s : decodeEntities(s).trim());

/* ---------------------------------------------------------------------------
   data.js — evaluated rather than pattern-matched, so we get exactly what the
   browser gets.
   --------------------------------------------------------------------------- */
function loadData() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(read("assets/js/data.js"), ctx);
  return ctx.window.OM_DATA;
}

/* ---------------------------------------------------------------------------
   menu.html
   --------------------------------------------------------------------------- */
function between(html, startMark, endMark) {
  const a = html.indexOf(startMark);
  if (a === -1) throw new Error("start marker not found: " + startMark);
  const b = html.indexOf(endMark, a + startMark.length);
  if (b === -1) throw new Error("end marker not found: " + endMark);
  return html.slice(a + startMark.length, b);
}

function parseMenuItems(ulHtml) {
  const items = [];
  const liRe = /<li class="menu-item([^"]*)">([\s\S]*?)<\/li>/g;
  let m;
  while ((m = liRe.exec(ulHtml))) {
    const mods = m[1];
    const body = m[2];
    const name = /<span class="menu-item__name">([\s\S]*?)<\/span>/.exec(body);
    const lead = /<span class="menu-item__lead">([\s\S]*?)<\/span>/.exec(body);
    const price = /<span class="menu-item__price">([\s\S]*?)<\/span>/.exec(body);
    const desc = /<p class="menu-item__desc">([\s\S]*?)<\/p>/.exec(body);
    const tiers = /<p class="menu-item__tiers">([\s\S]*?)<\/p>/.exec(body);

    const item = { name: d(name && name[1]) };
    if (lead && d(lead[1])) item.lead = d(lead[1]);
    if (price) item.price = d(price[1]);
    if (desc) item.desc = d(desc[1]);
    if (tiers) item.tiers = d(tiers[1]);
    if (/menu-item--tiered/.test(mods) && !item.tiers) {
      throw new Error("tiered item without tiers: " + item.name);
    }
    items.push(item);
  }
  return items;
}

function parseMenuDefs(ulHtml) {
  const entries = [];
  const liRe = /<li><span class="menu-defs__t">([\s\S]*?)<\/span>([\s\S]*?)<\/li>/g;
  let m;
  while ((m = liRe.exec(ulHtml))) {
    entries.push({ term: d(m[1]), detail: d(m[2]) });
  }
  return entries;
}

function parseMenu(html) {
  const wrap = between(html, '<div class="menu-wrap">', "\n    </div>");

  const categories = [];
  const catRe =
    /<!-- =+ ([^=]*?) =+ -->\s*<section class="menu-cat" id="([^"]+)">([\s\S]*?)<\/section>/g;
  let m;
  while ((m = catRe.exec(wrap))) {
    const comment = m[1].trim();
    const anchor = m[2];
    const inner = m[3];

    const title = /<h2 class="menu-cat__title">([\s\S]*?)<\/h2>/.exec(inner);
    const afterTitle = inner.slice(inner.indexOf("</h2>") + 5);

    // Walk the children in document order so the rendered output keeps the
    // exact sequence of headings, notes and lists the printed menu has.
    const blocks = [];
    const nodeRe =
      /<h3 class="menu-cat__sub">([\s\S]*?)<\/h3>|<p class="menu-cat__note([^"]*)">([\s\S]*?)<\/p>|<ul class="(menu-grid|menu-defs)">([\s\S]*?)<\/ul>/g;
    let n;
    while ((n = nodeRe.exec(afterTitle))) {
      if (n[1] !== undefined) {
        blocks.push({ _type: "menuHeading", text: d(n[1]) });
      } else if (n[3] !== undefined) {
        const raw = n[3];
        const strong = /^\s*<strong>([\s\S]*?)<\/strong>([\s\S]*)$/.exec(raw);
        const block = { _type: "menuNote" };
        if (/menu-cat__note--top/.test(n[2])) block.top = true;
        if (strong) {
          block.lead = d(strong[1]);
          block.text = d(strong[2]);
        } else {
          block.text = d(raw);
        }
        blocks.push(block);
      } else if (n[4] === "menu-grid") {
        blocks.push({ _type: "menuItems", items: parseMenuItems(n[5]) });
      } else {
        blocks.push({ _type: "menuDefs", entries: parseMenuDefs(n[5]) });
      }
    }

    categories.push({
      anchor: anchor,
      comment: comment,
      title: d(title && title[1]),
      jumpLabel: null, // filled from the jump nav below
      blocks: blocks
    });
  }

  // Jump nav supplies the short label for each category.
  const jump = between(html, '<nav class="menu-jump" aria-label="Jump to a section">', "</nav>");
  const jumpRe = /<a href="#([^"]+)">([\s\S]*?)<\/a>/g;
  let j;
  const labels = {};
  while ((j = jumpRe.exec(jump))) labels[j[1]] = d(j[2]);
  categories.forEach((c) => { c.jumpLabel = labels[c.anchor] || c.title; });

  const hero = between(html, '<section class="menu-hero" aria-label="The menu">', "</section>");
  const grab = (re) => { const r = re.exec(hero); return r ? d(r[1]) : ""; };

  return {
    hero: {
      script: grab(/<span class="script">([\s\S]*?)<\/span>/),
      title: grab(/<h1>([\s\S]*?)<\/h1>/),
      sub: grab(/<p class="menu-hero__sub">([\s\S]*?)<\/p>/),
      ctaLabel: grab(/<a class="btn btn--primary"[^>]*>([\s\S]*?)\s·/),
      note: grab(/<p class="menu-hero__note">([\s\S]*?)<\/p>/)
    },
    categories: categories
  };
}

/* ---------------------------------------------------------------------------
   index.html
   --------------------------------------------------------------------------- */
function parseIndex(html) {
  const grab = (re, src) => { const r = re.exec(src || html); return r ? d(r[1]) : ""; };

  const cards = [];
  const cardRe = /<article class="stack__card" data-card>([\s\S]*?)<\/article>/g;
  let m;
  while ((m = cardRe.exec(html))) {
    const c = m[1];
    const img = /<img src="assets\/img\/([^"]+)"[\s\S]*?alt="([^"]*)"[\s\S]*?width="(\d+)" height="(\d+)"/.exec(c);
    cards.push({
      script: grab(/<span class="script">([\s\S]*?)<\/span>/, c),
      title: grab(/<h2>([\s\S]*?)<\/h2>/, c),
      body: grab(/<p>([\s\S]*?)<\/p>/, c),
      linkLabel: grab(/<a class="reveal-btn"[\s\S]*?<span>([\s\S]*?)<\/span>/, c),
      linkHref: grab(/<a class="reveal-btn" href="([^"]+)"/, c),
      img: img ? img[1] : "",
      alt: img ? d(img[2]) : "",
      width: img ? Number(img[3]) : null,
      height: img ? Number(img[4]) : null
    });
  }

  const showcase = between(html, '<div class="showcase__head">', "</div>");
  const specialsHead = between(html, '<div class="specials__head">', "</div>");
  const story = between(html, '<div class="story__body">', "</div>");

  return {
    seo: {
      title: grab(/<title>([\s\S]*?)<\/title>/),
      description: grab(/<meta name="description" content="([^"]*)"/),
      ogTitle: grab(/<meta property="og:title" content="([^"]*)"/),
      ogDescription: grab(/<meta property="og:description" content="([^"]*)"/)
    },
    heroTag: grab(/<p class="hero__tag">([\s\S]*?)<\/p>/),
    heroSub: grab(/<p class="hero__sub">([\s\S]*?)<\/p>/),
    heroCtaLabel: grab(/<div class="hero__cta">\s*<a class="btn btn--primary" href="[^"]*">([\s\S]*?)<\/a>/),
    heroCtaHref: grab(/<div class="hero__cta">\s*<a class="btn btn--primary" href="([^"]*)"/),
    stackCards: cards,
    showcase: {
      script: grab(/<span class="script">([\s\S]*?)<\/span>/, showcase),
      title: grab(/<h2 class="reveal-words">([\s\S]*?)<\/h2>/, showcase),
      tagline: grab(/<p class="showcase__tagline">([\s\S]*?)<\/p>/, showcase),
      ctaLabel: grab(/<div class="showcase__cta">\s*<a class="btn btn--primary" href="menu\.html">([\s\S]*?)<\/a>/)
    },
    specialsHead: {
      script: grab(/<span class="script">([\s\S]*?)<\/span>/, specialsHead),
      title: grab(/<h2 class="reveal-words">([\s\S]*?)<\/h2>/, specialsHead),
      dailyHeading: grab(/<div class="specials__col">\s*<h3>([\s\S]*?)<\/h3>/),
      eventsHeading: grab(/<ul class="daily"[\s\S]*?<h3>([\s\S]*?)<\/h3>/),
      rotatingHeading: grab(/<h3 class="specials__roth">([\s\S]*?)<\/h3>/)
    },
    story: {
      script: grab(/<span class="script">([\s\S]*?)<\/span>/, story),
      title: grab(/<h2 class="reveal-words">([\s\S]*?)<\/h2>/, story),
      body: grab(/<p class="reveal-words">([\s\S]*?)<\/p>/, story),
      orderLine: grab(/<p class="story__order">([\s\S]*?)<\/p>/, story)
    }
  };
}

/* ---------------------------------------------------------------------------
   Shared chrome — nav links, call label, footer copy. Read off index.html;
   all three pages carry the same markup.
   --------------------------------------------------------------------------- */
function parseChrome(html) {
  const grab = (re, src) => { const r = re.exec(src || html); return r ? d(r[1]) : ""; };

  const nav = between(html, '<nav class="nav__links" aria-label="Primary">', "</nav>");
  const links = [];
  const linkRe = /<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  // Stored fully qualified; renderNavLinks strips the prefix on the home page.
  while ((m = linkRe.exec(nav))) {
    const href = m[1].charAt(0) === "#" ? "index.html" + m[1] : m[1];
    links.push({ href: href, label: d(m[2]) });
  }

  const footer = between(html, '<footer class="footer" id="find-us">', "</footer>");

  return {
    chrome: {
      navLinks: links,
      callLabel: grab(/<a class="btn btn--call"[\s\S]*?<span>([\s\S]*?)<\/span>/)
    },
    footer: {
      smsHeading: grab(/<p class="footer__sms">\s*<strong>([\s\S]*?)<\/strong>/, footer),
      smsKeyword: grab(/<span class="footer__sms-kw">([\s\S]*?)<\/span>/, footer),
      smsDial: grab(/href="sms:([^"]+)"/, footer),
      smsDisplay: grab(/href="sms:[^"]+">([\s\S]*?)<\/a>/, footer),
      hoursHeading: grab(/<h3>(Hours)<\/h3>/, footer),
      hoursNote: grab(/<p class="footer__note">([\s\S]*?)<\/p>/, footer),
      findHeading: grab(/<h3>(Find Us)<\/h3>/, footer),
      directionsLabel: grab(/Get directions/.test(footer) ? /(Get directions)\s*→/ : /()/, footer),
      devilLine: grab(/<span class="footer__devil">([\s\S]*?)<\/span>/, footer)
    }
  };
}

/* ---------------------------------------------------------------------------
   calendar.html
   --------------------------------------------------------------------------- */
function parseCalendarPage(html) {
  const hero = between(html, '<section class="cal-hero" aria-label="Calendar">', "</section>");
  const grab = (re) => { const r = re.exec(hero); return r ? d(r[1]) : ""; };
  const seoTitle = /<title>([\s\S]*?)<\/title>/.exec(html);
  const seoDesc = /<meta name="description" content="([^"]*)"/.exec(html);
  return {
    seo: { title: d(seoTitle && seoTitle[1]), description: d(seoDesc && seoDesc[1]) },
    hero: {
      script: grab(/<span class="script">([\s\S]*?)<\/span>/),
      title: grab(/<h1>([\s\S]*?)<\/h1>/),
      sub: grab(/<p>([\s\S]*?)<\/p>/)
    }
  };
}

/* --------------------------------------------------------------------------- */

const data = loadData();
const indexHtml = read("index.html");
const menuHtml = read("menu.html");
const calHtml = read("calendar.html");

const index = parseIndex(indexHtml);
const chrome = parseChrome(indexHtml);
const menu = parseMenu(menuHtml);
const calPage = parseCalendarPage(calHtml);

const pageSeo = (html, ogType) => {
  const g = (re) => { const r = re.exec(html); return r ? d(r[1]) : ""; };
  return {
    title: g(/<title>([\s\S]*?)<\/title>/),
    description: g(/<meta name="description" content="([^"]*)"/),
    ogType: ogType,
    ogTitle: g(/<meta property="og:title" content="([^"]*)"/),
    ogDescription: g(/<meta property="og:description" content="([^"]*)"/)
  };
};

const content = {
  business: Object.assign({ siteUrl: "https://onemorebng.org" }, data.business),
  hours: data.hours,
  chrome: chrome.chrome,
  footer: Object.assign({}, chrome.footer, { directionsLabel: "Get directions" }),

  home: {
    seo: Object.assign({ ogType: "restaurant.restaurant" }, index.seo),
    heroLines: data.heroLines,
    heroTag: index.heroTag,
    heroSub: index.heroSub,
    heroCtaLabel: index.heroCtaLabel,
    heroCtaHref: index.heroCtaHref,
    stackCards: index.stackCards,
    showcase: index.showcase,
    specialsHead: index.specialsHead,
    story: index.story,
    signatureItems: data.signatureItems,
    sauces: data.sauces,
    ratings: data.ratings,
    testimonials: data.testimonials
  },

  specials: {
    dailySpecials: data.dailySpecials,
    weeklyEvents: data.weeklyEvents,
    rotating: data.rotating
  },

  calendar: data.calendar,

  calendarPage: {
    seo: calPage.seo,
    hero: calPage.hero
  },

  menu: {
    seo: pageSeo(menuHtml, "restaurant.menu"),
    hero: menu.hero,
    categories: menu.categories
  }
};

writeFileSync(join(ROOT, "content.json"), JSON.stringify(content, null, 2) + "\n", "utf8");

const itemCount = menu.categories.reduce(
  (n, c) => n + c.blocks.reduce((k, b) => k + (b.items ? b.items.length : 0), 0), 0);

console.log("content.json written");
console.log("  menu categories: " + menu.categories.length);
console.log("  menu items:      " + itemCount);
console.log("  stack cards:     " + index.stackCards.length);
console.log("  nav links:       " + chrome.chrome.navLinks.length);
