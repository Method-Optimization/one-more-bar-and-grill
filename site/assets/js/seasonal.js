/* =============================================================================
   THANKSGIVING 2026 + POP-UP TEST (hand-written, not Sanity)
   -----------------------------------------------------------------------------
   Three things in one script:

   1. The closed-Thanksgiving banner. The text lives in the <div class="notice">
      at the top of every page; this script only decides whether it shows. It
      runs in the <head>, before the page paints, so the header never jumps
      when the banner appears. Visible through the end of Thursday, Nov 26,
      2026 (Tabernacle time), gone from Nov 27.
   2. A pop-up, ~4 seconds into a visit, opted into per page with a data-popup
      attribute on this script tag (home, menu and calendar have it; Special
      Events already shows the flyer, and the legal pages are left alone).
      It is a 50/50 test between two pop-ups:
        "roll" - the Thanksgiving Roll pop-up (ends after LAST_DAY)
        "sms"  - the text-club sign-up (texts only, no loyalty program)
      A visitor is assigned one at random on their first eligible visit and
      keeps it (localStorage "om-popup-variant-2026"). From Nov 27 the Roll
      pop-up is over, so everyone gets the text-club pop-up.
   3. Counting for the owner's dashboard, through window.moEvent (defined by
      Method's hit.js): sms_popup_shown, sms_popup_signup, promo_popup_shown,
      promo_popup_click. Each is a daily total; nothing identifies anyone.

   The pop-ups use Method's pop-up look (the .mo-pop classes in style.css) but
   their own script: Method's popup.js is built around a Rewards sign-up link
   and stays off until Wingman Rewards is switched on. Each pop-up keeps its
   own remembered-dismissal key, separate from that one, so closing one never
   silences another.

   The text sign-up posts to the Method dashboard (/api/texts/join), which adds
   the number to the restaurant's text list. It sends no text itself yet.
   ============================================================================= */
(function () {
  "use strict";

  var LAST_DAY = "2026-11-26";          // inclusive, in America/New_York
  var DELAY_MS = 4000;                  // pop-up appears 4s after landing
  var VARIANT_KEY = "om-popup-variant-2026";
  var ROLL_KEY = "om-thanksgiving-roll-2026";
  var SMS_KEY = "om-sms-popup";
  var SMS_RESHOW_MS = 30 * 24 * 60 * 60 * 1000; // dismissed without joining: ask again after 30 days
  var FLYER = "assets/img/thanksgiving-roll-flyer.webp";
  var FLYER_W = 800, FLYER_H = 1120;
  var SMS_IMG = "assets/img/wings-buffalo-plate.jpg";
  var SMS_IMG_W = 1536, SMS_IMG_H = 2048;
  var SITE_KEY = "ef59c8c29ec19c207da1b736"; // same key hit.js uses; read from its tag when present
  var JOIN_URL = "https://dashboard.methodoptimization.com/api/texts/join";

  var script = document.currentScript;
  var wantsPopup = !!(script && script.hasAttribute("data-popup"));

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

  var rollOver = today() > LAST_DAY;
  if (!rollOver) document.documentElement.classList.add("has-notice"); // the closed banner
  if (!wantsPopup) return;

  /* ---------------------------------------------------------- storage */
  function get(key) {
    try { var v = localStorage.getItem(key); if (v !== null) return v; } catch (e) { /* blocked */ }
    try { return sessionStorage.getItem(key); } catch (e2) { return null; }
  }
  function set(key, value) {
    try { localStorage.setItem(key, value); return; } catch (e) { /* private mode */ }
    try { sessionStorage.setItem(key, value); } catch (e2) { /* it may show again */ }
  }

  function track(name) {
    try { if (window.moEvent) window.moEvent(name); } catch (e) { /* counting never breaks the page */ }
  }

  /* ---------------------------------------------------------- variant */
  function variant() {
    if (rollOver) return "sms"; // the Roll is over: everyone gets the text club
    var v = get(VARIANT_KEY);
    if (v !== "sms" && v !== "roll") {
      v = Math.random() < 0.5 ? "sms" : "roll";
      set(VARIANT_KEY, v);
    }
    return v;
  }

  function rollSeen() { return !!get(ROLL_KEY); }
  function rollRemember() { set(ROLL_KEY, String(Date.now())); }

  function smsSeen() {
    var v = get(SMS_KEY);
    if (!v) return false;
    if (v === "joined") return true;
    var at = parseInt(v, 10);
    return !isNaN(at) && Date.now() - at < SMS_RESHOW_MS;
  }

  function eligible() {
    if (typeof HTMLDialogElement === "undefined") return false;
    if (document.querySelector("dialog[open]")) return false; // never stack on another pop-up
    var active = document.activeElement;
    if (active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)) return false; // typing
    return true;
  }

  /* ----------------------------------------------- the Roll pop-up */
  function openRoll() {
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
    function close() { rollRemember(); if (dialog.open) dialog.close(); }
    dialog.addEventListener("close", function () { rollRemember(); dialog.remove(); });
    dialog.addEventListener("cancel", rollRemember); // Esc
    dialog.addEventListener("keydown", function (ev) { if (ev.key === "Escape") rollRemember(); });
    dialog.querySelector(".mo-pop__close").addEventListener("click", close);
    dialog.querySelector(".mo-pop__later").addEventListener("click", close);
    var join = dialog.querySelector(".mo-pop__join");
    if (join) join.addEventListener("click", function () { track("promo_popup_click"); rollRemember(); });
    // A click on the backdrop lands on the <dialog> itself, outside the card.
    dialog.addEventListener("click", function (ev) { if (ev.target === dialog) close(); });

    dialog.showModal();
    track("promo_popup_shown");
    (join || dialog.querySelector(".mo-pop__later")).focus({ preventScroll: true });
  }

  /* ----------------------------------------- the text-club pop-up */
  function siteKey() {
    var tag = document.querySelector('script[src*="methodoptimization.com"][data-site]');
    var key = tag && tag.getAttribute("data-site");
    return /^[0-9a-f]{24}$/.test(key || "") ? key : SITE_KEY;
  }

  function openSms() {
    var dialog = document.createElement("dialog");
    dialog.className = "mo-pop mo-pop--image mo-pop--sms";
    dialog.setAttribute("aria-labelledby", "omSmsTitle");
    dialog.setAttribute("data-lenis-prevent", "");
    dialog.innerHTML =
      '<div class="mo-pop__card">' +
        '<img class="mo-pop__img" src="' + SMS_IMG + '" width="' + SMS_IMG_W + '" height="' + SMS_IMG_H + '" ' +
          'alt="A plate of buffalo wings." />' +
        '<div class="mo-pop__body">' +
          '<div class="mo-sms__main">' +
            '<p class="mo-pop__eyebrow">Text club</p>' +
            '<h2 id="omSmsTitle" class="mo-pop__title" tabindex="-1">Get the specials by text.</h2>' +
            '<p class="mo-pop__text">Drink specials, rolls of the month and events, sent to your phone.</p>' +
            '<form class="mo-sms__form" novalidate>' +
              '<div class="mo-sms__field">' +
                '<label for="omSmsName">First name <span class="mo-sms__opt">(optional)</span></label>' +
                '<input id="omSmsName" name="firstName" type="text" autocomplete="given-name" maxlength="60" />' +
              '</div>' +
              '<div class="mo-sms__field">' +
                '<label for="omSmsPhone">Mobile number</label>' +
                '<input id="omSmsPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" ' +
                  'placeholder="(555) 123-4567" required aria-describedby="omSmsError" />' +
              '</div>' +
              '<div class="mo-sms__hp" aria-hidden="true">' +
                '<label>Leave this empty <input name="website" type="text" tabindex="-1" autocomplete="off" /></label>' +
              '</div>' +
              '<label class="mo-sms__check"><input id="omSmsAge" name="age21" type="checkbox" required />' +
                '<span>I&#39;m 21 or older</span></label>' +
              '<label class="mo-sms__check"><input id="omSmsConsent" name="consent" type="checkbox" required />' +
                '<span>Yes, text me specials and events from One More Bar &amp; Grill. Msg frequency varies. ' +
                'Msg &amp; data rates may apply. Reply STOP to cancel, HELP for help. ' +
                'Consent isn&#39;t a condition of purchase. ' +
                '<a href="privacy.html" target="_blank" rel="noopener">Privacy policy</a>.</span></label>' +
              '<p id="omSmsError" class="mo-sms__error" role="alert" hidden></p>' +
              '<div class="mo-pop__actions">' +
                '<button class="btn btn--primary mo-sms__submit" type="submit">Sign me up</button>' +
                '<button class="mo-pop__later" type="button">No thanks</button>' +
              '</div>' +
            '</form>' +
          '</div>' +
        '</div>' +
        '<button class="mo-pop__close" type="button" aria-label="Close">&times;</button>' +
      '</div>';
    document.body.appendChild(dialog);

    var joined = false;
    function remember() { set(SMS_KEY, joined ? "joined" : String(Date.now())); }
    function close() { remember(); if (dialog.open) dialog.close(); }
    dialog.addEventListener("close", function () { remember(); dialog.remove(); });
    dialog.addEventListener("cancel", remember); // Esc
    dialog.addEventListener("keydown", function (ev) { if (ev.key === "Escape") remember(); });
    dialog.querySelector(".mo-pop__close").addEventListener("click", close);
    dialog.querySelector(".mo-pop__later").addEventListener("click", close);
    dialog.addEventListener("click", function (ev) { if (ev.target === dialog) close(); });

    var form = dialog.querySelector("form");
    var errorBox = dialog.querySelector("#omSmsError");
    var submit = dialog.querySelector(".mo-sms__submit");
    var busy = false;

    function fail(message, field) {
      errorBox.textContent = message;
      errorBox.hidden = false;
      if (field) field.focus();
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (busy) return;
      errorBox.hidden = true;
      var phone = form.elements.phone, age = form.elements.age21, consent = form.elements.consent;
      var digits = phone.value.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 15) return fail("Enter a valid mobile number, like (555) 123-4567.", phone);
      if (!age.checked) return fail("You need to be 21 or older to join.", age);
      if (!consent.checked) return fail("Please check the box to agree to get texts.", consent);

      busy = true;
      submit.disabled = true;
      submit.textContent = "Signing you up…";
      var body = {
        s: siteKey(),
        phone: phone.value.trim(),
        firstName: form.elements.firstName.value.trim(),
        consent: true,
        age21: true,
        hp: form.elements.website.value
      };
      var request;
      try {
        request = fetch(JOIN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
      } catch (e) {
        request = Promise.reject(e);
      }
      request.then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (res.ok && data && data.ok) return success();
          var msg = data && typeof data.error === "string" && res.status < 500 ? data.error : "";
          fail(msg || "We couldn't sign you up right now. Please try again in a minute.");
        });
      }).catch(function () {
        fail("We couldn't sign you up right now. Please check your connection and try again.");
      }).then(function () {
        busy = false;
        if (!joined) { submit.disabled = false; submit.textContent = "Sign me up"; }
      });
    });

    function success() {
      joined = true;
      set(SMS_KEY, "joined");
      track("sms_popup_signup");
      var main = dialog.querySelector(".mo-sms__main");
      main.innerHTML =
        '<p class="mo-pop__eyebrow">Text club</p>' +
        '<h2 id="omSmsTitle" class="mo-pop__title" tabindex="-1">You&#39;re on the list.</h2>' +
        '<p class="mo-pop__text" role="status">Texts start soon from our new number.</p>' +
        '<div class="mo-pop__actions"><button class="btn btn--primary mo-sms__done" type="button">Close</button></div>';
      main.querySelector(".mo-sms__done").addEventListener("click", close);
      main.querySelector("h2").focus({ preventScroll: true });
    }

    dialog.showModal();
    track("sms_popup_shown");
    // On a phone, focusing a field would open the keyboard over the form; start at the title there.
    var coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    (coarse ? dialog.querySelector("#omSmsTitle") : dialog.querySelector("#omSmsName")).focus({ preventScroll: true });
  }

  /* -------------------------------------------------------- start */
  function open() {
    if (!eligible()) return;
    var v = variant();
    if (v === "sms") { if (!smsSeen()) openSms(); }
    else if (!rollSeen()) openRoll();
  }

  function arm() { window.setTimeout(open, DELAY_MS); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arm);
  else arm();
})();
