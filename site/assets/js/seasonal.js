/* =============================================================================
   THANKSGIVING 2026 (hand-written, not Sanity)
   -----------------------------------------------------------------------------
   Two things that switch themselves off, so nobody has to remember to:

   1. The closed-Thanksgiving banner. The text lives in the <div class="notice">
      at the top of every page; this script only decides whether it shows. It
      runs in the <head>, before the page paints, so the header never jumps
      when the banner appears.
   2. The Thanksgiving Roll pop-up, ~4 seconds into a visit. Opted into per
      page with a data-popup attribute on this script tag (home, menu and
      calendar have it; Special Events already shows the flyer, and the legal
      pages are left alone).

   Both are visible through the end of Thursday, Nov 26, 2026 (Tabernacle
   time) and gone from Nov 27. That is the only date here; to reuse this next
   year, change LAST_DAY, the banner text in the pages, and the pop-up words.

   The pop-up is Method's pop-up look (the .mo-pop classes in style.css) but its
   own script: Method's popup.js is built around a Rewards sign-up link and
   stays off until Wingman Rewards is switched on. Its remembered-dismissal key
   is separate from that one, so closing this never silences the Rewards pop-up.
   ============================================================================= */
(function () {
  "use strict";

  var LAST_DAY = "2026-11-26";          // inclusive, in America/New_York
  var DELAY_MS = 4000;                  // pop-up appears 4s after landing
  var KEY = "om-thanksgiving-roll-2026";
  var FLYER = "assets/img/thanksgiving-roll-flyer.webp";
  var FLYER_W = 800, FLYER_H = 1120;

  /* Today's date in Tabernacle, as YYYY-MM-DD. A visitor's own clock or time
     zone shouldn't decide whether the restaurant is "still" closed that day. */
  function today() {
    try {
      var s = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    } catch (e) { /* older browser: fall through to the device's own date */ }
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }

  if (today() > LAST_DAY) return; // past Thanksgiving: banner and pop-up both stay hidden

  var root = document.documentElement;
  root.classList.add("has-notice");

  var script = document.currentScript;
  if (!script || !script.hasAttribute("data-popup")) return;

  /* ------------------------------------------------------------- pop-up */
  function seen() {
    try { return !!localStorage.getItem(KEY); } catch (e) { /* blocked */ }
    try { return !!sessionStorage.getItem(KEY); } catch (e2) { return false; }
  }
  function remember() {
    try { localStorage.setItem(KEY, String(Date.now())); return; } catch (e) { /* private mode */ }
    try { sessionStorage.setItem(KEY, "1"); } catch (e2) { /* it may show again */ }
  }

  function open() {
    if (seen() || typeof HTMLDialogElement === "undefined") return;
    if (document.querySelector("dialog[open]")) return; // never stack on another pop-up
    var active = document.activeElement;
    if (active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)) return;

    var onCalendar = /\/calendar(\.html)?\/?$/.test(location.pathname);
    var dialog = document.createElement("dialog");
    dialog.className = "mo-pop mo-pop--image mo-pop--flyer";
    dialog.setAttribute("aria-labelledby", "omRollTitle");
    dialog.setAttribute("data-lenis-prevent", "");
    dialog.innerHTML =
      '<div class="mo-pop__card">' +
        '<img class="mo-pop__img" src="' + FLYER + '" width="' + FLYER_W + '" height="' + FLYER_H + '" ' +
          'alt="The Thanksgiving Roll, cut in half on a plate with turkey gravy and cranberry sauce." />' +
        '<div class="mo-pop__body">' +
          '<p class="mo-pop__eyebrow">Roll of the Month</p>' +
          '<h2 id="omRollTitle" class="mo-pop__title">The Thanksgiving Roll is back.</h2>' +
          '<p class="mo-pop__text">Oven-roasted turkey, Mom&#39;s homemade stuffing and Mary Ann&#39;s mashed potatoes, ' +
            'wrapped in a wonton and deep fried. Turkey gravy and cranberry sauce on the side. ' +
            'Last November we sold 1,350 of them.</p>' +
          '<div class="mo-pop__actions">' +
            (onCalendar ? "" : '<a class="btn btn--primary mo-pop__join" href="calendar.html">See the November calendar</a>') +
            '<button class="mo-pop__later" type="button">Maybe later</button>' +
          '</div>' +
        '</div>' +
        '<button class="mo-pop__close" type="button" aria-label="Close">&times;</button>' +
      '</div>';
    document.body.appendChild(dialog);

    // Every way out records the dismissal itself rather than trusting the
    // dialog's "close" event, which some browsers were seen not to fire.
    function close() { remember(); if (dialog.open) dialog.close(); }
    dialog.addEventListener("close", function () { remember(); dialog.remove(); });
    dialog.addEventListener("cancel", remember); // Esc
    dialog.addEventListener("keydown", function (ev) { if (ev.key === "Escape") remember(); });
    dialog.querySelector(".mo-pop__close").addEventListener("click", close);
    dialog.querySelector(".mo-pop__later").addEventListener("click", close);
    var join = dialog.querySelector(".mo-pop__join");
    if (join) join.addEventListener("click", remember);
    // A click on the backdrop lands on the <dialog> itself, outside the card.
    dialog.addEventListener("click", function (ev) { if (ev.target === dialog) close(); });

    dialog.showModal();
    (join || dialog.querySelector(".mo-pop__later")).focus({ preventScroll: true });
  }

  function arm() { window.setTimeout(open, DELAY_MS); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arm);
  else arm();
})();
