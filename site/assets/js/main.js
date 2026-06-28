/* =============================================================================
   ONE MORE BAR & GRILL — interactions
   - Lenis smooth/inertia scroll (with graceful fallback)
   - Scroll-scrubbed: hero parallax, cycling headline, video-reveal
   - One-shot reveals: polaroids, per-word headlines (IntersectionObserver)
   - Live open/closed + "kitchen closes at" badge
   - Content rendered from assets/js/data.js (the file the owner edits)
   - Honors prefers-reduced-motion: skips scrub/parallax, keeps content visible
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.OM_DATA || {};
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var IS_TOUCH = window.matchMedia("(max-width: 768px)").matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------------------------------------------------------------------------
     RENDER CONTENT FROM data.js
     --------------------------------------------------------------------------- */
  function wrapWords(text, accentWords) {
    accentWords = accentWords || [];
    return text.split(" ").map(function (word) {
      var bare = word.replace(/[^a-zA-Z']/g, "").toLowerCase();
      var cls = accentWords.indexOf(bare) > -1 ? "w accent" : "w";
      return '<span class="' + cls + '">' + word + "</span>";
    }).join(" ");
  }

  function renderHeroLines() {
    var ul = $("#cyclerList");
    if (!ul || !DATA.heroLines) return;
    // words that should glow red for character
    var accents = ["beer", "wings", "jersey", "devil"];
    ul.innerHTML = DATA.heroLines.map(function (line) {
      return '<li class="cycler__line">' + wrapWords(line, accents) + "</li>";
    }).join("");
  }

  function renderPolaroids() {
    var wrap = $("#polaroids");
    if (!wrap || !DATA.signatureItems) return;
    var rot = [-7, 3, -4, 6]; // final scattered tilt
    wrap.innerHTML = DATA.signatureItems.map(function (it, i) {
      return '<figure class="polaroid" style="--rot:' + (rot[i % rot.length]) + 'deg">' +
        '<img src="assets/img/' + it.img + '" alt="' + it.alt + '" loading="lazy" decoding="async" />' +
        '<figcaption><span class="pol-cap">' + it.caption + '</span>' +
        '<span class="pol-note">' + it.note + '</span></figcaption></figure>';
    }).join("");
  }

  function renderSpecials() {
    var today = new Date().getDay();
    var daily = $("#dailyList");
    if (daily && DATA.dailySpecials) {
      daily.innerHTML = DATA.dailySpecials.map(function (s, i) {
        var isToday = i === today;
        return '<li class="' + (isToday ? "today" : "") + '">' +
          '<span class="d-day">' + s.day + (isToday ? '<span class="badge">TODAY</span>' : "") + "</span>" +
          '<span class="d-deal">' + s.deal + "</span></li>";
      }).join("");
    }
    var events = $("#eventsList");
    if (events && DATA.weeklyEvents) {
      events.innerHTML = DATA.weeklyEvents.map(function (e) {
        return '<li><span class="e-name">' + e.name + '</span><br><span class="e-when">' + e.when + "</span></li>";
      }).join("");
    }
    var rot = $("#rotatingList");
    if (rot && DATA.rotating) {
      rot.innerHTML = DATA.rotating.map(function (r) {
        return '<li><span class="r-label">' + r.label + '</span><br><span class="r-value">' + r.value + "</span></li>";
      }).join("");
    }
  }

  function renderSauces() {
    var track = $("#saucesTrack");
    if (!track || !DATA.sauces) return;
    var one = DATA.sauces.map(function (s) { return '<span class="sauce-chip">' + s + "</span>"; }).join("");
    track.innerHTML = one + one; // duplicated for a seamless loop
  }

  function renderRatings() {
    var box = $("#ratings");
    if (!box || !DATA.ratings) return;
    box.innerHTML = DATA.ratings.map(function (r) {
      var full = Math.round(parseFloat(r.score));
      var stars = "";
      for (var i = 0; i < 5; i++) stars += i < full ? "★" : "☆";
      return '<div class="rating"><span class="r-score">' + r.score + "</span>" +
        '<span class="r-stars" aria-hidden="true">' + stars + "</span>" +
        '<span class="r-src">' + r.source + '</span><span class="r-count">' + r.count + "</span></div>";
    }).join("");
  }

  function renderFooterHours() {
    var table = $("#footerHours");
    if (!table || !DATA.hours || !DATA.hours.summary) return;
    var rows = DATA.hours.summary.map(function (r) {
      return "<tr><th>" + r.label + "</th><td>Bar " + r.bar + "<br>Kitchen " + r.kitchen + "</td></tr>";
    }).join("");
    table.innerHTML = "<tbody>" + rows + "</tbody>";
  }

  /* ---------------------------------------------------------------------------
     LIVE OPEN / CLOSED STATUS
     --------------------------------------------------------------------------- */
  function toMinutes(hhmm) { var p = hhmm.split(":"); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }

  function fmt(hhmm) {
    var m = toMinutes(hhmm) % (24 * 60);
    var h = Math.floor(m / 60), mm = m % 60;
    var ap = h >= 12 ? "pm" : "am";
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + (mm ? ":" + (mm < 10 ? "0" + mm : mm) : "") + ap;
  }

  // Is `now` (minutes since midnight today) within a day's window, accounting
  // for windows that run past midnight (close > 24:00) and yesterday's spillover.
  function openState(map) {
    var now = new Date();
    var day = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var prev = (day + 6) % 7;
    // yesterday's late window spilling into today
    if (map[prev] && toMinutes(map[prev].close) > 24 * 60) {
      var spill = toMinutes(map[prev].close) - 24 * 60;
      if (mins < spill) return { open: true, closeMin: spill, closeStr: map[prev].close };
    }
    if (map[day]) {
      var o = toMinutes(map[day].open), c = toMinutes(map[day].close);
      if (mins >= o && mins < Math.min(c, 24 * 60)) return { open: true, closeMin: c, closeStr: map[day].close };
    }
    return { open: false };
  }

  function nextOpen(map) {
    var now = new Date();
    for (var i = 0; i < 7; i++) {
      var d = (now.getDay() + i) % 7;
      if (!map[d]) continue;
      if (i === 0 && (now.getHours() * 60 + now.getMinutes()) < toMinutes(map[d].open)) {
        return "Opens today at " + fmt(map[d].open);
      }
      if (i > 0) {
        var names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var when = i === 1 ? "tomorrow" : names[d];
        return "Opens " + when + " at " + fmt(map[d].open);
      }
    }
    return "";
  }

  function updateStatus() {
    var el = $("#status"); if (!el || !DATA.hours) return;
    var txt = $(".status__text", el);
    var bar = openState(DATA.hours.bar);
    if (bar.open) {
      el.classList.add("is-open"); el.classList.remove("is-closed");
      var kitchen = openState(DATA.hours.kitchen);
      if (kitchen.open) {
        txt.innerHTML = "<strong>Open now</strong> · Kitchen 'til " + fmt(kitchen.closeStr);
      } else {
        txt.innerHTML = "<strong>Bar's open</strong> · Late-night menu on";
      }
    } else {
      el.classList.add("is-closed"); el.classList.remove("is-open");
      var n = nextOpen(DATA.hours.bar);
      txt.innerHTML = "<strong>Closed</strong>" + (n ? " · " + n : "");
    }
  }

  /* ---------------------------------------------------------------------------
     NAV — logo wordmark <-> tagline swap, hide-on-scroll-down, mobile drawer
     --------------------------------------------------------------------------- */
  function initNav() {
    var brand = $(".nav__brand");
    var nav = $("#nav");
    var toggle = $("#navToggle");
    var drawer = $("#mobileNav");

    // 30s loop swap (unless reduced motion)
    if (brand && !REDUCED) {
      var showing = false;
      setInterval(function () {
        showing = !showing;
        brand.setAttribute("data-show", showing ? "tag" : "word");
      }, 6000);
      brand.addEventListener("mouseenter", function () { brand.setAttribute("data-show", "tag"); });
      brand.addEventListener("mouseleave", function () { brand.setAttribute("data-show", "word"); });
    }

    // mobile drawer
    if (toggle && drawer) {
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        if (!open) {
          drawer.hidden = false;
          requestAnimationFrame(function () { drawer.classList.add("open"); });
          toggle.setAttribute("aria-label", "Close menu");
        } else {
          drawer.classList.remove("open");
          toggle.setAttribute("aria-label", "Open menu");
          setTimeout(function () { drawer.hidden = true; }, 300);
        }
      });
      $$("a", drawer).forEach(function (a) {
        a.addEventListener("click", function () {
          drawer.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open menu");
          setTimeout(function () { drawer.hidden = true; }, 300);
        });
      });
    }

    // hide nav on scroll down, show on scroll up
    var lastY = 0;
    function onScrollNav(y) {
      if (!nav) return;
      if (y > lastY && y > 400) nav.style.transform = "translateY(-130%)";
      else nav.style.transform = "translateY(0)";
      lastY = y;
    }
    return onScrollNav;
  }

  /* ---------------------------------------------------------------------------
     TESTIMONIAL ROTATOR
     --------------------------------------------------------------------------- */
  function initTestimonials() {
    var box = $("#testimonial"); var dots = $("#proofDots");
    var list = DATA.testimonials || [];
    if (!box || !list.length) return;
    var textEl = $(".proof__text", box), citeEl = $(".proof__cite", box);
    var idx = 0, timer;

    if (dots) {
      dots.innerHTML = list.map(function (_, i) {
        return '<button type="button" aria-label="Review ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : "") + "></button>";
      }).join("");
    }
    function show(i) {
      idx = (i + list.length) % list.length;
      box.style.opacity = "0";
      setTimeout(function () {
        textEl.textContent = list[idx].quote;
        citeEl.textContent = list[idx].who + (list[idx].where ? " · " + list[idx].where : "");
        box.style.opacity = "1";
        if (dots) $$("button", dots).forEach(function (b, bi) { b.setAttribute("aria-current", String(bi === idx)); });
      }, 250);
    }
    function start() { timer = setInterval(function () { show(idx + 1); }, 6500); }
    function reset() { clearInterval(timer); start(); }
    if (dots) $$("button", dots).forEach(function (b, bi) { b.addEventListener("click", function () { show(bi); reset(); }); });
    show(0); if (!REDUCED) start();
  }

  /* ---------------------------------------------------------------------------
     ONE-SHOT REVEALS (IntersectionObserver) — words + polaroids
     --------------------------------------------------------------------------- */
  // Wrap each word in a text node with <span class="w">, leaving child
  // elements (<em>/<strong>) intact — those animate as a single unit.
  function splitWords(el) {
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) { // text node
        if (!node.textContent.trim()) return;
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (part === "") return;
          if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
          var span = document.createElement("span");
          span.className = "w";
          span.textContent = part;
          frag.appendChild(span);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1) { // element (em/strong) -> one word unit
        node.classList.add("w");
      }
    });
  }

  function initReveals() {
    $$(".reveal-words").forEach(function (el) {
      if (el.querySelector(".w")) return;
      splitWords(el);
      $$(".w", el).forEach(function (w, i) { w.style.transitionDelay = (i * 40) + "ms"; });
    });

    if (REDUCED || !("IntersectionObserver" in window)) {
      $$(".reveal-words").forEach(function (e) { e.classList.add("in"); });
      $$(".polaroid").forEach(function (e) { e.classList.add("in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.25, rootMargin: "0px 0px -8% 0px" });

    $$(".reveal-words").forEach(function (e) { io.observe(e); });

    // polaroids: fly in from below with their final scattered rotation
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var el = e.target;
        var r = el.style.getPropertyValue("--rot") || "0deg";
        var i = $$(".polaroid").indexOf(el);
        if (e.isIntersecting) {
          el.style.transition = "transform .8s cubic-bezier(.16,1,.3,1) " + (i * 90) + "ms, opacity .6s ease " + (i * 90) + "ms";
          el.style.transform = "translateY(0) rotate(" + r + ")";
          el.classList.add("in");
        } else {
          el.style.transition = "transform .35s cubic-bezier(.16,1,.3,1), opacity .3s ease";
          el.style.transform = "translateY(80px) rotate(8deg)";
          el.classList.remove("in");
        }
      });
    }, { threshold: 0.4, rootMargin: "0px 0px -12% 0px" });
    $$(".polaroid").forEach(function (e) {
      e.style.transform = "translateY(80px) rotate(8deg)";
      pio.observe(e);
    });
  }

  /* ---------------------------------------------------------------------------
     SCROLL-SCRUBBED EFFECTS (driven each frame from scroll position)
     --------------------------------------------------------------------------- */
  function initScrub() {
    if (REDUCED) return { update: function () {}, measure: function () {} };

    var heroBg = $("[data-parallax]");
    var heroContent = $(".hero__content");
    var hero = $("#hero");
    var cycler = $("#cycler");
    var cyclerList = $("#cyclerList");
    var reveal = $("#reveal");
    var overlay = $("[data-reveal-overlay]");
    var scrim = $("[data-reveal-scrim]");
    var ghost = $("[data-reveal-ghost]");

    var vh = window.innerHeight;
    var m = {}; // cached metrics: absolute top + scrollable distance per section

    function absTop(el) {
      var t = 0; var n = el;
      while (n) { t += n.offsetTop; n = n.offsetParent; }
      return t;
    }
    function measure() {
      vh = window.innerHeight;
      [["hero", hero], ["cycler", cycler], ["reveal", reveal]].forEach(function (pair) {
        var el = pair[1]; if (!el) return;
        m[pair[0]] = { top: absTop(el), dist: Math.max(el.offsetHeight - vh, 1) };
      });
      m.lineH = (cyclerList && cyclerList.children[0]) ? cyclerList.children[0].offsetHeight : 1;
    }
    function pinned(key, y) { var s = m[key]; if (!s) return 0; return clamp((y - s.top) / s.dist, 0, 1); }

    function update(y) {
      // --- HERO parallax + content drift/fade ---
      if (heroBg && m.hero) {
        var hp = pinned("hero", y);
        heroBg.style.transform = "translateY(" + (hp * 18) + "%)";
        if (heroContent) {
          heroContent.style.transform = "translateY(" + (hp * -60) + "px)";
          heroContent.style.opacity = String(clamp(1 - hp * 1.4, 0, 1));
        }
      }

      // --- CYCLING HEADLINE: scrub list upward + brighten words by zone ---
      if (cyclerList && m.cycler) {
        var cp = pinned("cycler", y);
        var lines = cyclerList.children;
        if (lines.length) {
          var totalScroll = (lines.length - 1) * m.lineH;
          cyclerList.style.transform = "translateY(" + (-cp * totalScroll) + "px)";
          var activeF = cp * (lines.length - 1);
          for (var li = 0; li < lines.length; li++) {
            var words = lines[li].querySelectorAll(".w");
            var dist = li - activeF; // 0 = active line
            for (var wi = 0; wi < words.length; wi++) {
              var lead = wi / Math.max(words.length, 1);
              var op;
              if (dist > 0.6) op = 0.12;            // below the active zone = dim
              else if (dist < -0.6) op = 1;         // above = fully bright
              else {
                var local = clamp((0.6 - dist) / 1.2, 0, 1);
                op = clamp(0.12 + (local - lead * 0.25) * 1.4, 0.12, 1);
              }
              words[wi].style.opacity = op.toFixed(2);
            }
          }
        }
      }

      // --- VIDEO REVEAL: overlay + scrim lift away, ghost trails behind ---
      if (m.reveal) {
        var rp = pinned("reveal", y);
        if (overlay) overlay.style.transform = "translateY(" + (-rp * 100) + "vh)";
        if (scrim) scrim.style.transform = "translateY(" + (-rp * 100) + "vh)";
        if (ghost) ghost.style.transform = "translateY(" + (-rp * 78) + "vh)";
      }
    }

    measure();
    return { update: update, measure: measure };
  }

  /* ---------------------------------------------------------------------------
     BOOT
     --------------------------------------------------------------------------- */
  function boot() {
    // year
    var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

    renderHeroLines();
    renderPolaroids();
    renderSpecials();
    renderSauces();
    renderRatings();
    renderFooterHours();
    updateStatus();
    setInterval(updateStatus, 60 * 1000); // keep the badge fresh

    var onScrollNav = initNav();
    initTestimonials();
    initReveals();
    var scrub = initScrub();

    // --- Lenis smooth scroll (graceful fallback to native) ---
    var lenis = null;
    if (window.Lenis && !REDUCED) {
      try {
        lenis = new Lenis({
          lerp: IS_TOUCH ? 0.14 : 0.12,   // a touch punchier than LPQ's 0.1
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.6
        });
        document.documentElement.classList.add("lenis");
        window.lenis = lenis; // exposed for debugging / programmatic scroll
      } catch (e) { lenis = null; }
    }

    // Re-measure cached metrics after fonts settle and on resize (debounced).
    var rzTimer;
    function remeasure() { scrub.measure(); var y = lenis ? lenis.scroll : (window.scrollY || window.pageYOffset); scrub.update(y); }
    window.addEventListener("load", remeasure);
    window.addEventListener("resize", function () { clearTimeout(rzTimer); rzTimer = setTimeout(remeasure, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);

    // Only do scrub/nav work when the scroll position actually changes, so the
    // page goes fully idle (no repaint) when the user stops scrolling.
    var lastScroll = -1;
    function raf(time) {
      if (lenis) lenis.raf(time);
      var y = lenis ? lenis.scroll : (window.scrollY || window.pageYOffset);
      if (Math.abs(y - lastScroll) > 0.4) {
        scrub.update(y);
        if (onScrollNav) onScrollNav(y);
        lastScroll = y;
      }
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // smooth anchor scrolling through Lenis (or native)
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (ev) {
        var id = a.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        ev.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -70 });
        else target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
