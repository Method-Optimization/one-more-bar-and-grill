/* =============================================================================
   RENDERERS — content object  ->  the exact HTML the site ships
   -----------------------------------------------------------------------------
   Every function here returns a string that is dropped between a marker pair in
   one of the three pages. Indentation is baked in to match the surrounding
   hand-written HTML, so a generated file still reads like a file a person wrote.
   ============================================================================= */

import { esc, jsStr } from "./lib.mjs";

const NL = "\n";

/* An image is either a file that ships with the site, stored as a bare
   filename, or one the owner uploaded to Sanity, which arrives as a full URL. */
export function imgSrc(img) {
  if (!img) return "";
  return /^https?:\/\//i.test(img) ? img : "assets/img/" + img;
}

/* --------------------------------------------------------------------------
   MENU
   -------------------------------------------------------------------------- */

function renderMenuItem(it) {
  const tiered = !!(it.tiers && String(it.tiers).trim());
  const parts = [];
  parts.push('<li class="menu-item' + (tiered ? " menu-item--tiered" : "") + '">');
  parts.push('<div class="menu-item__top">');
  parts.push('<span class="menu-item__name">' + esc(it.name) + "</span>");
  if (!tiered) {
    // The lead span is always present on a priced row even when empty: the grid
    // uses it as the dotted leader between the name and the price.
    parts.push('<span class="menu-item__lead">' + esc(it.lead || "") + "</span>");
    parts.push('<span class="menu-item__price">' + esc(it.price || "") + "</span>");
  }
  parts.push("</div>");
  if (it.desc) parts.push('<p class="menu-item__desc">' + esc(it.desc) + "</p>");
  if (tiered) parts.push('<p class="menu-item__tiers">' + esc(it.tiers) + "</p>");
  parts.push("</li>");
  return "          " + parts.join("");
}

function renderMenuBlock(b) {
  const t = b._type;
  if (t === "menuHeading") {
    return '        <h3 class="menu-cat__sub">' + esc(b.text) + "</h3>";
  }
  if (t === "menuNote") {
    const cls = "menu-cat__note" + (b.top ? " menu-cat__note--top" : "");
    const lead = b.lead ? "<strong>" + esc(b.lead) + "</strong> " : "";
    return '        <p class="' + cls + '">' + lead + esc(b.text) + "</p>";
  }
  if (t === "menuDefs") {
    const rows = (b.entries || []).map(function (d) {
      return '          <li><span class="menu-defs__t">' + esc(d.term) + "</span> " +
        esc(d.detail) + "</li>";
    });
    return ['        <ul class="menu-defs">'].concat(rows, ["        </ul>"]).join(NL);
  }
  if (t === "menuItems") {
    const rows = (b.items || []).map(renderMenuItem);
    return ['        <ul class="menu-grid">'].concat(rows, ["        </ul>"]).join(NL);
  }
  throw new Error("Unknown menu block type: " + t);
}

export function renderMenuCategories(categories) {
  const out = categories.map(function (cat) {
    const banner = cat.comment || String(cat.anchor || "").toUpperCase();
    const head = [
      "      <!-- ===================== " + banner + " ===================== -->",
      '      <section class="menu-cat" id="' + esc(cat.anchor) + '">',
      '        <h2 class="menu-cat__title">' + esc(cat.title) + "</h2>"
    ];
    const body = (cat.blocks || []).map(renderMenuBlock);
    return head.concat(body, ["      </section>"]).join(NL);
  });
  return NL + NL + out.join(NL + NL) + NL + NL + "    ";
}

export function renderMenuJump(categories) {
  const rows = categories.map(function (c) {
    return '        <a href="#' + esc(c.anchor) + '">' + esc(c.jumpLabel || c.title) + "</a>";
  });
  return NL + rows.join(NL) + NL + "    ";
}

export function renderMenuHero(hero, business) {
  return [
    "",
    '      <span class="script">' + esc(hero.script) + "</span>",
    "      <h1>" + esc(hero.title) + "</h1>",
    '      <p class="menu-hero__sub">' + esc(hero.sub) + "</p>",
    '      <a class="btn btn--primary" href="tel:' + esc(business.phoneDial) + '">' +
      esc(hero.ctaLabel) + " · " + esc(business.phoneDisplay) + "</a>",
    '      <p class="menu-hero__note">' + esc(hero.note) + "</p>",
    "    "
  ].join(NL);
}

/* --------------------------------------------------------------------------
   CALENDAR PAGE
   -------------------------------------------------------------------------- */

export function renderCalendarHero(hero) {
  return [
    "",
    '      <span class="script">' + esc(hero.script) + "</span>",
    "      <h1>" + esc(hero.title) + "</h1>",
    "      <p>" + esc(hero.sub) + "</p>",
    "    "
  ].join(NL);
}

/* The calendar image is baked into the HTML so it is in the markup Google sees
   and the browser can start the download before any script runs. */
export function renderCalendarImage(cal) {
  const src = imgSrc(cal.img);
  const dims = cal.width && cal.height
    ? NL + '           width="' + esc(cal.width) + '" height="' + esc(cal.height) + '"'
    : "";
  return [
    "",
    '      <img id="calImage"',
    '           src="' + esc(src) + '"',
    '           alt="' + esc(cal.alt) + '"' + dims + " />",
    '      <p class="cal-note" id="calNote">' + esc(cal.note) + "</p>",
    "    "
  ].join(NL);
}

/* --------------------------------------------------------------------------
   HOME PAGE
   -------------------------------------------------------------------------- */

export function renderHeroCopy(home) {
  return [
    "",
    '          <p class="hero__tag">' + esc(home.heroTag) + "</p>",
    '          <p class="hero__sub">' + esc(home.heroSub) + "</p>",
    "          "
  ].join(NL);
}

export function renderHeroCta(home) {
  return [
    "",
    '            <a class="btn btn--primary" href="' + esc(home.heroCtaHref) + '">' +
      esc(home.heroCtaLabel) + "</a>",
    "          "
  ].join(NL);
}

export function renderStackCards(cards) {
  const out = cards.map(function (c) {
    return [
      '      <article class="stack__card" data-card>',
      '        <div class="stack__text">',
      '          <span class="script">' + esc(c.script) + "</span>",
      "          <h2>" + esc(c.title) + "</h2>",
      "          <p>" + esc(c.body) + "</p>",
      '          <a class="reveal-btn" href="' + esc(c.linkHref) + '" data-reveal-btn>',
      "            <span>" + esc(c.linkLabel) + "</span>",
      '            <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
      "          </a>",
      "        </div>",
      '        <div class="stack__media">',
      '          <img src="' + esc(imgSrc(c.img)) + '"',
      '               alt="' + esc(c.alt) + '"',
      '               width="' + esc(c.width) + '" height="' + esc(c.height) +
        '" loading="lazy" decoding="async" />',
      "        </div>",
      "      </article>"
    ].join(NL);
  });
  return NL + out.join(NL + NL) + NL + "    ";
}

export function renderShowcaseHead(head) {
  return [
    "",
    '        <span class="script">' + esc(head.script) + "</span>",
    '        <h2 class="reveal-words">' + esc(head.title) + "</h2>",
    '        <p class="showcase__tagline">' + esc(head.tagline) + "</p>",
    "      "
  ].join(NL);
}

export function renderShowcaseCta(head) {
  return NL + '        <a class="btn btn--primary" href="menu.html">' +
    esc(head.ctaLabel) + "</a>" + NL + "      ";
}

export function renderSpecialsHead(head) {
  return [
    "",
    '        <span class="script">' + esc(head.script) + "</span>",
    '        <h2 class="reveal-words">' + esc(head.title) + "</h2>",
    "      "
  ].join(NL);
}

export function renderSpecialsGrid(head) {
  return [
    "",
    '        <div class="specials__col">',
    "          <h3>" + esc(head.dailyHeading) + "</h3>",
    '          <ul class="daily" id="dailyList"><!-- filled from data.js --></ul>',
    "        </div>",
    "",
    '        <div class="specials__col">',
    "          <h3>" + esc(head.eventsHeading) + "</h3>",
    '          <ul class="events" id="eventsList"><!-- filled from data.js --></ul>',
    "",
    '          <h3 class="specials__roth">' + esc(head.rotatingHeading) + "</h3>",
    '          <ul class="rotating" id="rotatingList"><!-- filled from data.js --></ul>',
    "        </div>",
    "      "
  ].join(NL);
}

export function renderStory(story) {
  return [
    "",
    '        <span class="script">' + esc(story.script) + "</span>",
    '        <h2 class="reveal-words">' + esc(story.title) + "</h2>",
    '        <p class="reveal-words">' + esc(story.body) + "</p>",
    '        <p class="story__order">' + esc(story.orderLine) + "</p>",
    "      "
  ].join(NL);
}

/* --------------------------------------------------------------------------
   SHARED CHROME — nav links, call buttons, footer
   -------------------------------------------------------------------------- */

/* Links to a spot on the home page are stored fully qualified
   ("index.html#specials") because that is what they have to be on the menu and
   calendar pages. On the home page itself the prefix is dropped, so the click
   scrolls instead of reloading the page. */
function localize(href, self) {
  return self === "index.html" && href.indexOf("index.html#") === 0
    ? href.slice("index.html".length)
    : href;
}

/* self: the file name of the page being written, so its own nav link is marked
   aria-current. */
export function renderNavLinks(links, self) {
  return NL + links.map(function (l) {
    const cur = l.href === self ? ' aria-current="page"' : "";
    return '        <a href="' + esc(localize(l.href, self)) + '"' + cur + ">" +
      esc(l.label) + "</a>";
  }).join(NL) + NL + "      ";
}

export function renderNavCall(business, chrome) {
  return [
    "",
    '        <a class="btn btn--call" href="tel:' + esc(business.phoneDial) + '">',
    '          <svg viewBox="0 0 24 24" aria-hidden="true" class="ico"><path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.24 1z"/></svg>',
    "          <span>" + esc(chrome.callLabel) + "</span>",
    "        </a>",
    "        "
  ].join(NL);
}

export function renderMobileNav(links, self, business, chrome) {
  const rows = links.map(function (l) {
    const cur = l.href === self ? ' aria-current="page"' : "";
    return '      <a href="' + esc(localize(l.href, self)) + '"' + cur + ">" +
      esc(l.label) + "</a>";
  });
  rows.push('      <a class="mobile-nav__call" href="tel:' + esc(business.phoneDial) + '">' +
    esc(chrome.callLabel) + " · " + esc(business.phoneDisplay) + "</a>");
  return NL + rows.join(NL) + NL + "    ";
}

export function renderFooterBrand(business, footer) {
  return [
    "",
    '        <div class="footer__social">',
    '          <a href="' + esc(business.facebook) +
      '" target="_blank" rel="noopener" aria-label="One More on Facebook">Facebook</a>',
    '          <a href="' + esc(business.instagram) +
      '" target="_blank" rel="noopener" aria-label="One More on Instagram">Instagram</a>',
    "        </div>",
    '        <p class="footer__sms">',
    "          <strong>" + esc(footer.smsHeading) + "</strong>",
    '          Text <span class="footer__sms-kw">' + esc(footer.smsKeyword) + "</span> to " +
      '<a class="footer__link" href="sms:' + esc(footer.smsDial) + '">' +
      esc(footer.smsDisplay) + "</a>",
    "        </p>",
    "      "
  ].join(NL);
}

export function renderFooterHours(footer) {
  return [
    "",
    "        <h3>" + esc(footer.hoursHeading) + "</h3>",
    '        <table class="footer__hours" id="footerHours"><!-- filled from data.js --></table>',
    '        <p class="footer__note">' + esc(footer.hoursNote) + "</p>",
    "      "
  ].join(NL);
}

export function renderFooterFind(business, footer) {
  return [
    "",
    "        <h3>" + esc(footer.findHeading) + "</h3>",
    '        <address class="footer__addr">',
    "          " + esc(business.addressStreet) + "<br/>",
    "          " + esc(business.addressLocality) + ", " + esc(business.addressRegion) +
      " " + esc(business.addressZip),
    "        </address>",
    '        <p><a class="footer__link" href="tel:' + esc(business.phoneDial) + '">' +
      esc(business.phoneDisplay) + "</a></p>",
    '        <p><a class="footer__link" href="mailto:' + esc(business.email) + '">' +
      esc(business.email) + "</a></p>",
    "        <p>",
    '          <a class="footer__link" href="' + esc(business.directionsUrl) +
      '" target="_blank" rel="noopener">' + esc(footer.directionsLabel) + " →</a>",
    "        </p>",
    "      "
  ].join(NL);
}

export function renderFooterBar(business, footer) {
  return [
    "",
    '      <span>© <span id="year"></span> ' + esc(business.name) + " · " +
      esc(business.addressLocality) + ", " + esc(business.addressRegion) + "</span>",
    '      <span class="footer__devil">' + esc(footer.devilLine) + "</span>",
    "      "
  ].join(NL);
}

/* --------------------------------------------------------------------------
   HEAD — title, description, social card, structured data
   -------------------------------------------------------------------------- */

export function renderSeo(seo) {
  return [
    "",
    "  <title>" + esc(seo.title) + "</title>",
    '  <meta name="description" content="' + esc(seo.description) + '" />',
    "  "
  ].join(NL);
}

export function renderOg(seo) {
  return [
    "",
    '  <meta property="og:type" content="' + esc(seo.ogType || "restaurant.restaurant") + '" />',
    '  <meta property="og:title" content="' + esc(seo.ogTitle) + '" />',
    '  <meta property="og:description" content="' + esc(seo.ogDescription) + '" />',
    '  <meta property="og:image" content="assets/img/wings-buffalo-plate.jpg" />',
    '  <meta property="og:locale" content="en_US" />',
    "  "
  ].join(NL);
}

/* 24:00 and 26:00 in the hours model mean midnight and 2am the next day.
   schema.org wants a real wall-clock time, so fold anything past midnight. */
function schemaTime(hhmm) {
  const p = String(hhmm).split(":");
  return String(parseInt(p[0], 10) % 24).padStart(2, "0") + ":" + p[1];
}

export function renderStructuredData(business, hours, ratings) {
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Collapse runs of days that share the same bar hours into one spec.
  const specs = [];
  for (let i = 0; i < 7; i++) {
    const h = hours.bar[String(i)] || hours.bar[i];
    if (!h) continue;
    const key = h.open + "-" + h.close;
    const last = specs[specs.length - 1];
    if (last && last.key === key) last.days.push(DAYS[i]);
    else specs.push({ key: key, days: [DAYS[i]], open: h.open, close: h.close });
  }

  const google = (ratings || []).filter(function (r) { return /google/i.test(r.source); })[0];
  const tel = business.phoneDial.replace(/^\+?1/, "").replace(/\D/g, "")
    .replace(/^(\d{3})(\d{3})(\d{4})$/, "+1-$1-$2-$3");

  const lines = [
    "  {",
    '    "@context": "https://schema.org",',
    '    "@type": "BarOrPub",',
    '    "name": ' + JSON.stringify(business.name) + ",",
    '    "image": "assets/img/wings-buffalo-plate.jpg",',
    '    "url": ' + JSON.stringify(business.siteUrl || "https://onemorebng.org") + ",",
    '    "telephone": ' + JSON.stringify(tel) + ",",
    '    "email": ' + JSON.stringify(business.email) + ",",
    '    "priceRange": "$$",',
    '    "servesCuisine": ["American", "Bar Food", "Wings"],',
    '    "foundingDate": ' + JSON.stringify(String(business.establishedYear)) + ",",
    '    "address": {',
    '      "@type": "PostalAddress",',
    '      "streetAddress": ' + JSON.stringify(business.addressStreet) + ",",
    '      "addressLocality": ' + JSON.stringify(business.addressLocality) + ",",
    '      "addressRegion": ' + JSON.stringify(business.addressRegion) + ",",
    '      "postalCode": ' + JSON.stringify(business.addressZip) + ",",
    '      "addressCountry": "US"',
    "    },",
    '    "openingHoursSpecification": ['
  ];

  lines.push(specs.map(function (s) {
    const days = "[" + s.days.map(function (d) { return JSON.stringify(d); }).join(",") + "]";
    return '      { "@type": "OpeningHoursSpecification", "dayOfWeek": ' + days +
      ', "opens": "' + schemaTime(s.open) + '", "closes": "' + schemaTime(s.close) + '" }';
  }).join("," + NL));

  lines.push("    ],");
  lines.push('    "sameAs": [');
  lines.push("      " + JSON.stringify(business.facebook) + ",");
  lines.push("      " + JSON.stringify(business.instagram));
  lines.push("    ]" + (google ? "," : ""));

  if (google) {
    lines.push('    "aggregateRating": {');
    lines.push('      "@type": "AggregateRating",');
    lines.push('      "ratingValue": ' + JSON.stringify(String(google.score)) + ",");
    lines.push('      "reviewCount": ' +
      JSON.stringify(String(google.count).replace(/\D/g, "")));
    lines.push("    }");
  }
  lines.push("  }");

  /* The <script> element is emitted here rather than left in the page, because
     an HTML comment inside a JSON-LD block makes it invalid JSON and Google
     silently drops the whole listing. Markers have to sit outside it. */
  return NL + '  <script type="application/ld+json">' + NL +
    lines.join(NL) + NL + "  </script>" + NL + "  ";
}

/* --------------------------------------------------------------------------
   data.js — the runtime content file, regenerated from Sanity
   -------------------------------------------------------------------------- */

function jsList(items, indent, fn) {
  if (!items || !items.length) return "[]";
  return "[" + NL + items.map(function (i) { return indent + "  " + fn(i); }).join("," + NL) +
    NL + indent + "]";
}

function jsObj(pairs) {
  return "{ " + pairs.map(function (p) { return p[0] + ": " + p[1]; }).join(", ") + " }";
}

function dayHours(map) {
  const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return "{" + NL + [0, 1, 2, 3, 4, 5, 6].map(function (i) {
    const d = map[String(i)] || map[i];
    return "      " + i + ': { open: "' + d.open + '", close: "' + d.close + '" }, // ' + DAY[i];
  }).join(NL) + NL + "    }";
}

export function renderDataJs(c) {
  const b = c.business;
  const h = c.hours;

  const business = [
    "{",
    "    name: " + jsStr(b.name) + ",",
    "    tagline: " + jsStr(b.tagline) + ",",
    "    addressStreet: " + jsStr(b.addressStreet) + ",",
    "    addressLocality: " + jsStr(b.addressLocality) + ",",
    "    addressRegion: " + jsStr(b.addressRegion) + ",",
    "    addressZip: " + jsStr(b.addressZip) + ",",
    "    phoneDisplay: " + jsStr(b.phoneDisplay) + ",",
    "    phoneDial: " + jsStr(b.phoneDial) + ",",
    "    email: " + jsStr(b.email) + ",",
    "    facebook: " + jsStr(b.facebook) + ",",
    "    instagram: " + jsStr(b.instagram) + ",",
    "    directionsUrl: " + jsStr(b.directionsUrl) + ",",
    "    establishedYear: " + JSON.stringify(b.establishedYear),
    "  }"
  ].join(NL);

  const out = [];
  out.push("/* =============================================================================");
  out.push("   ONE MORE BAR & GRILL — SITE CONTENT");
  out.push("   -----------------------------------------------------------------------------");
  out.push("   GENERATED FILE — DO NOT EDIT BY HAND.");
  out.push("");
  out.push("   Everything below comes from the Sanity Studio at");
  out.push("   https://onemorebng.sanity.studio and is written here by `npm run build`.");
  out.push("   Editing this file directly works until the next build, then it is overwritten.");
  out.push("");
  out.push("   To change any of it, edit it in the Studio and publish.");
  out.push("   ============================================================================= */");
  out.push("");
  out.push("window.OM_DATA = {");
  out.push("");
  out.push("  business: " + business + ",");
  out.push("");
  out.push("  hours: {");
  out.push("    bar: " + dayHours(h.bar) + ",");
  out.push("    kitchen: " + dayHours(h.kitchen) + ",");
  out.push("    summary: " + jsList(h.summary, "    ", function (r) {
    return jsObj([["label", jsStr(r.label)], ["bar", jsStr(r.bar)],
                  ["kitchen", jsStr(r.kitchen)], ["late", jsStr(r.late || "")]]);
  }));
  out.push("  },");
  out.push("");
  out.push("  heroLines: " + jsList(c.home.heroLines, "  ", function (l) { return jsStr(l); }) + ",");
  out.push("");
  out.push("  dailySpecials: " + jsList(c.specials.dailySpecials, "  ", function (s) {
    return jsObj([["day", jsStr(s.day)], ["deal", jsStr(s.deal)]]);
  }) + ",");
  out.push("");
  out.push("  weeklyEvents: " + jsList(c.specials.weeklyEvents, "  ", function (e) {
    return jsObj([["name", jsStr(e.name)], ["when", jsStr(e.when)]]);
  }) + ",");
  out.push("");
  out.push("  rotating: " + jsList(c.specials.rotating, "  ", function (r) {
    return jsObj([["label", jsStr(r.label)], ["value", jsStr(r.value)]]);
  }) + ",");
  out.push("");
  out.push("  calendar: " + jsObj([
    ["img", jsStr(c.calendar.img)],
    ["alt", jsStr(c.calendar.alt)],
    ["note", jsStr(c.calendar.note)],
    ["width", JSON.stringify(c.calendar.width || null)],
    ["height", JSON.stringify(c.calendar.height || null)]
  ]) + ",");
  out.push("");
  out.push("  signatureItems: " + jsList(c.home.signatureItems, "  ", function (i) {
    return jsObj([["img", jsStr(i.img)], ["alt", jsStr(i.alt)],
                  ["caption", jsStr(i.caption)], ["note", jsStr(i.note)]]);
  }) + ",");
  out.push("");
  out.push("  sauces: " + jsList(c.home.sauces, "  ", function (s) { return jsStr(s); }) + ",");
  out.push("");
  out.push("  ratings: " + jsList(c.home.ratings, "  ", function (r) {
    return jsObj([["source", jsStr(r.source)], ["score", jsStr(String(r.score))],
                  ["count", jsStr(r.count)]]);
  }) + ",");
  out.push("");
  out.push("  testimonials: " + jsList(c.home.testimonials, "  ", function (t) {
    return jsObj([["quote", jsStr(t.quote)], ["who", jsStr(t.who)], ["where", jsStr(t.where)]]);
  }));
  out.push("};");
  out.push("");
  return out.join(NL);
}

/* --------------------------------------------------------------------------
   SPECIAL EVENTS PAGE
   -------------------------------------------------------------------------- */

export function renderEventsHero(hero) {
  return [
    "",
    '      <span class="script">' + esc(hero.script) + "</span>",
    "      <h1>" + esc(hero.title) + "</h1>",
    "      <p>" + esc(hero.sub) + "</p>",
    "    "
  ].join(NL);
}

/* The flyer is a picture, so nothing written on it is readable by Google or a
   screen reader. The name, date and blurb are rendered as real text beside it —
   that is what makes an event findable, and it is why the Studio asks for them
   separately instead of just taking the poster. */
export function renderEvents(events, emptyMessage) {
  if (!events || !events.length) {
    return NL + '      <p class="events-empty">' + esc(emptyMessage) + "</p>" + NL + "    ";
  }

  const out = events.map(function (e, i) {
    const src = imgSrc(e.img);
    const dims = e.width && e.height
      ? ' width="' + esc(e.width) + '" height="' + esc(e.height) + '"'
      : "";
    // The top flyer is what the page is about and is almost always the largest
    // thing on screen, so it is fetched eagerly; the rest wait until scrolled to.
    const loading = i === 0
      ? 'fetchpriority="high" decoding="async"'
      : 'loading="lazy" decoding="async"';
    const lines = [
      '      <article class="event">',
      '        <a class="event__flyer" href="' + esc(src) + '" target="_blank" rel="noopener">',
      '          <img src="' + esc(src) + '"',
      '               alt="' + esc(e.alt) + '"' + dims,
      "               " + loading + " />",
      "        </a>",
      '        <div class="event__body">',
      '          <span class="event__when">' + esc(e.when) + "</span>",
      '          <h2 class="event__title">' + esc(e.title) + "</h2>"
    ];
    if (e.blurb) lines.push('          <p class="event__blurb">' + esc(e.blurb) + "</p>");
    lines.push('          <a class="event__zoom" href="' + esc(src) +
      '" target="_blank" rel="noopener">See the full flyer →</a>');
    lines.push("        </div>");
    lines.push("      </article>");
    return lines.join(NL);
  });

  return NL + out.join(NL + NL) + NL + "    ";
}

/* --------------------------------------------------------------------------
   FOOTER LATE NIGHT PANEL
   -------------------------------------------------------------------------- */

/* Repeats one menu section — in practice the late night one — at the bottom of
   every page. It reads straight off that section's own document rather than
   holding a second copy, so a price changed on the menu page cannot fall out of
   step with the footer. Which section appears is the "Also show this section in
   the footer" tick in the Studio. */
export function renderFooterLateNight(categories) {
  const cat = (categories || []).filter(function (c) { return c.showInFooter; })[0];
  if (!cat) return NL + "      ";

  const items = [];
  const notes = [];
  (cat.blocks || []).forEach(function (b) {
    if (b._type === "menuItems") (b.items || []).forEach(function (i) { items.push(i); });
    else if (b._type === "menuNote") notes.push(b);
  });
  if (!items.length) return NL + "      ";

  const rows = items.map(function (i) {
    return '          <li><span class="ln-item__name">' + esc(i.name) + "</span>" +
      '<span class="ln-item__price">' + esc(i.tiers || i.price || "") + "</span></li>";
  });

  const out = [
    "",
    '      <section class="footer__latenight" aria-label="' + esc(cat.title) + '">',
    '        <h3 class="ln-head">' + esc(cat.title) + "</h3>"
  ];
  // The introducing note carries the serving times, which is the whole reason
  // this panel is worth having down here.
  const top = notes.filter(function (n) { return n.top; })[0];
  if (top) out.push('        <p class="ln-when">' + esc(top.text) + "</p>");

  out.push('        <ul class="ln-list">');
  out.push.apply(out, rows);
  out.push("        </ul>");

  notes.filter(function (n) { return !n.top; }).forEach(function (n) {
    const lead = n.lead ? "<strong>" + esc(n.lead) + "</strong> " : "";
    out.push('        <p class="ln-note">' + lead + esc(n.text) + "</p>");
  });

  out.push('        <a class="ln-link" href="menu.html#' + esc(cat.anchor) + '">See the full menu →</a>');
  out.push("      </section>");
  out.push("      ");
  return out.join(NL);
}
