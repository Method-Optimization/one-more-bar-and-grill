/* =============================================================================
   BUILD — pull the content out of Sanity and write it into the pages
   -----------------------------------------------------------------------------
       npm run build              fetch from Sanity, then write the site
       npm run build -- --offline write the site from the committed snapshot

   Every visible word on the site ends up as real HTML in site/*.html. Nothing
   about the pages depends on Sanity at view time: a visitor with JavaScript
   off, and Google's crawler, see the finished page.

   content.json is the snapshot the render actually reads. A fetch updates it
   and the change shows up as a normal diff, so a content edit is reviewable and
   revertable like any other change.
   ============================================================================= */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, SITE, replaceRegion } from "./lib.mjs";
import { queryUrl, fromSanity } from "./sanity.mjs";
import * as R from "./render.mjs";

const OFFLINE = process.argv.includes("--offline");
const SNAPSHOT = join(ROOT, "content.json");

/* ---------------------------------------------------------------------------
   1. Content
   --------------------------------------------------------------------------- */

async function fetchContent(base) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(queryUrl(), { signal: ctrl.signal });
    if (!res.ok) throw new Error("Sanity responded " + res.status);
    const json = await res.json();
    if (!json || !json.result) throw new Error("Sanity returned no result");
    return fromSanity(json.result, base);
  } finally {
    clearTimeout(timer);
  }
}

const base = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
let content = base;

if (OFFLINE) {
  console.log("offline: building from content.json");
} else {
  try {
    content = await fetchContent(base);
    const changed = JSON.stringify(content) !== JSON.stringify(base);
    if (changed) {
      writeFileSync(SNAPSHOT, JSON.stringify(content, null, 2) + "\n", "utf8");
      console.log("content.json updated from Sanity");
    } else {
      console.log("Sanity matches content.json — nothing to update");
    }
  } catch (err) {
    // A build must never fail because a CMS is having a bad day. The snapshot
    // is by definition the last content that was known to render.
    console.warn("Sanity unreachable (" + err.message + ") — using content.json");
    content = base;
  }
}

/* ---------------------------------------------------------------------------
   2. Pages
   --------------------------------------------------------------------------- */

const c = content;
const page = (file) => readFileSync(join(SITE, file), "utf8");
const write = (file, html) => writeFileSync(join(SITE, file), html, "utf8");

/* Regions that are identical on all three pages. */
function chrome(html, self) {
  html = replaceRegion(html, "nav-links", R.renderNavLinks(c.chrome.navLinks, self));
  html = replaceRegion(html, "nav-call", R.renderNavCall(c.business, c.chrome));
  html = replaceRegion(html, "mobile-links",
    R.renderMobileNav(c.chrome.navLinks, self, c.business, c.chrome));
  html = replaceRegion(html, "footer-brand", R.renderFooterBrand(c.business, c.footer));
  html = replaceRegion(html, "footer-hours", R.renderFooterHours(c.footer));
  html = replaceRegion(html, "footer-find", R.renderFooterFind(c.business, c.footer));
  html = replaceRegion(html, "footer-bar", R.renderFooterBar(c.business, c.footer));
  return html;
}

/* ------------------------------------------------------------------ index */
{
  let html = page("index.html");
  html = replaceRegion(html, "seo", R.renderSeo(c.home.seo));
  html = replaceRegion(html, "og", R.renderOg(c.home.seo));
  html = replaceRegion(html, "jsonld",
    R.renderStructuredData(c.business, c.hours, c.home.ratings));
  html = replaceRegion(html, "hero-copy", R.renderHeroCopy(c.home));
  html = replaceRegion(html, "hero-cta", R.renderHeroCta(c.home));
  html = replaceRegion(html, "stack", R.renderStackCards(c.home.stackCards));
  html = replaceRegion(html, "showcase-head", R.renderShowcaseHead(c.home.showcase));
  html = replaceRegion(html, "showcase-cta", R.renderShowcaseCta(c.home.showcase));
  html = replaceRegion(html, "specials-head", R.renderSpecialsHead(c.home.specialsHead));
  html = replaceRegion(html, "specials-grid", R.renderSpecialsGrid(c.home.specialsHead));
  html = replaceRegion(html, "story", R.renderStory(c.home.story));
  html = chrome(html, "index.html");
  write("index.html", html);
}

/* ------------------------------------------------------------------- menu */
{
  let html = page("menu.html");
  html = replaceRegion(html, "seo", R.renderSeo(c.menu.seo));
  html = replaceRegion(html, "og", R.renderOg(c.menu.seo));
  html = replaceRegion(html, "menu-hero", R.renderMenuHero(c.menu.hero, c.business));
  html = replaceRegion(html, "menu-jump", R.renderMenuJump(c.menu.categories));
  html = replaceRegion(html, "menu-body", R.renderMenuCategories(c.menu.categories));
  html = chrome(html, "menu.html");
  write("menu.html", html);
}

/* ----------------------------------------------------------------- events */
{
  let html = page("events.html");
  html = replaceRegion(html, "seo", R.renderSeo(c.events.seo));
  html = replaceRegion(html, "events-hero", R.renderEventsHero(c.events.hero));
  html = replaceRegion(html, "events-body",
    R.renderEvents(c.events.items, c.events.emptyMessage));
  html = chrome(html, "events.html");
  write("events.html", html);
}

/* --------------------------------------------------------------- calendar */
{
  let html = page("calendar.html");
  html = replaceRegion(html, "seo", R.renderSeo(c.calendarPage.seo));
  html = replaceRegion(html, "cal-hero", R.renderCalendarHero(c.calendarPage.hero));
  html = replaceRegion(html, "cal-image", R.renderCalendarImage(c.calendar));
  html = chrome(html, "calendar.html");
  write("calendar.html", html);
}

/* --------------------------------------------------------------- data.js */
writeFileSync(join(SITE, "assets/js/data.js"), R.renderDataJs(c), "utf8");

const items = c.menu.categories.reduce(
  (n, cat) => n + cat.blocks.reduce((k, b) => k + (b.items ? b.items.length : 0), 0), 0);

console.log("built  index.html  menu.html  events.html  calendar.html  assets/js/data.js");
console.log("       " + c.menu.categories.length + " menu sections, " + items + " items, " +
  c.events.items.length + " events");
