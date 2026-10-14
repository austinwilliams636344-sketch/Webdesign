/* ==========================================================================
   R&R Diesel Repair — site script
   Hours config, Central Time open/closed status, mobile menu, animations.
   ========================================================================== */

/* --------------------------------------------------------------------------
   SHOP HOURS — the one place to set hours for the live status + hours table.
   Times are 24-hour "HH:MM" in Central Time. Days: 0 = Sun, 1 = Mon … 6 = Sat.
   Leave OPENING_TIME or DAYS_OPEN as null to show the [PLACEHOLDER] text.
   Example: OPENING_TIME = "08:00"; DAYS_OPEN = [1, 2, 3, 4, 5];
   -------------------------------------------------------------------------- */
var OPENING_TIME = null;     // TODO: fill from Google profile, e.g. "08:00"
var CLOSING_TIME = "17:00";  // 5:00 PM
var DAYS_OPEN = null;        // TODO: fill from Google profile, e.g. [1, 2, 3, 4, 5]

var SHOP_TZ = "America/Chicago";
var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

(function () {
  "use strict";

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hoursKnown = !!(OPENING_TIME && DAYS_OPEN && DAYS_OPEN.length);

  /* ---------- Time helpers (always Central Time, never the visitor's) ---------- */

  function toMinutes(hhmm) {
    var p = hhmm.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function format12(hhmm) {
    var m = toMinutes(hhmm);
    var h = Math.floor(m / 60);
    var min = m % 60;
    var suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + (min < 10 ? "0" : "") + min + " " + suffix;
  }

  function centralNow() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: SHOP_TZ,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date());
    var out = {};
    parts.forEach(function (p) { out[p.type] = p.value; });
    return {
      day: DAY_SHORT.indexOf(out.weekday),
      minutes: (parseInt(out.hour, 10) % 24) * 60 + parseInt(out.minute, 10)
    };
  }

  function isOpenDay(d) { return hoursKnown && DAYS_OPEN.indexOf(d) !== -1; }

  // "Mon–Fri", "Mon–Sat", or "Mon, Wed, Fri"
  function daysLabel() {
    var days = DAYS_OPEN.slice().sort();
    var contiguous = days.every(function (d, i) { return i === 0 || d === days[i - 1] + 1; });
    if (days.length === 7) return "7 days a week";
    if (contiguous && days.length > 2) return DAY_SHORT[days[0]] + "–" + DAY_SHORT[days[days.length - 1]];
    return days.map(function (d) { return DAY_SHORT[d]; }).join(", ");
  }

  function rangeLabel() {
    return (OPENING_TIME ? format12(OPENING_TIME) : "[OPENING TIME]") + " – " + format12(CLOSING_TIME);
  }

  /* ---------- Hours text everywhere (top bar, footer, etc.) ---------- */

  function renderHoursSummary() {
    if (!hoursKnown) return; // keep the static [PLACEHOLDER] text
    var text = daysLabel() + " · " + rangeLabel() + " CT";
    document.querySelectorAll("[data-hours-summary]").forEach(function (el) { el.textContent = text; });
  }

  /* ---------- Location page: hours table + open/closed status ---------- */

  function renderHoursTable(now) {
    var tbody = document.getElementById("hours-body");
    if (!tbody) return;
    var order = [1, 2, 3, 4, 5, 6, 0]; // Mon → Sun
    tbody.innerHTML = order.map(function (d) {
      var val;
      if (!hoursKnown) val = rangeLabel();
      else val = isOpenDay(d) ? rangeLabel() : "Closed";
      return '<tr' + (d === now.day ? ' class="is-today" aria-current="date"' : "") + ">" +
        '<th scope="row">' + DAY_NAMES[d] + "</th><td>" + val + "</td></tr>";
    }).join("");
  }

  function renderStatus(now) {
    var pill = document.getElementById("open-status");
    var note = document.getElementById("open-status-note");
    if (!pill) return;

    if (!hoursKnown) {
      pill.className = "status-pill";
      pill.textContent = "Call to confirm hours";
      if (note) note.textContent = "Closes at " + format12(CLOSING_TIME) + " Central Time.";
      return;
    }

    var open = toMinutes(OPENING_TIME);
    var close = toMinutes(CLOSING_TIME);
    var isOpen = isOpenDay(now.day) && now.minutes >= open && now.minutes < close;
    var msg;

    if (isOpen) {
      msg = "Closes today at " + format12(CLOSING_TIME) + " CT";
    } else if (isOpenDay(now.day) && now.minutes < open) {
      msg = "Opens today at " + format12(OPENING_TIME) + " CT";
    } else {
      for (var i = 1; i <= 7; i++) {
        var d = (now.day + i) % 7;
        if (isOpenDay(d)) {
          msg = "Opens " + (i === 1 ? "tomorrow" : DAY_NAMES[d]) + " at " + format12(OPENING_TIME) + " CT";
          break;
        }
      }
    }

    pill.className = "status-pill " + (isOpen ? "is-open" : "is-closed");
    pill.textContent = isOpen ? "Open now" : "Closed now";
    if (note) note.textContent = msg || "";
  }

  function updateHours() {
    var now = centralNow();
    renderHoursTable(now);
    renderStatus(now);
  }

  renderHoursSummary();
  updateHours();
  setInterval(updateHours, 60 * 1000);

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open && window.gsap && !reduceMotion) {
      gsap.fromTo(menu.querySelectorAll(".mm-link, .btn, .mm-meta"),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power3.out" });
    }
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(!document.body.classList.contains("menu-open"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900) setMenu(false);
    });
  }

  /* ---------- Page transitions (quick fade out on internal links) ---------- */
  var fade = document.querySelector(".page-fade");

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || !fade || reduceMotion) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    var href = a.getAttribute("href") || "";
    // Only plain same-site page links — never tel:, maps, or in-page anchors.
    if (!/^[\w-]+\.html(#.*)?$/.test(href)) return;
    var url = new URL(a.href, location.href);
    if (url.pathname === location.pathname) return; // same page (with or without hash)

    e.preventDefault();
    fade.style.transition = "opacity 0.22s ease";
    fade.style.opacity = "1";
    setTimeout(function () { location.href = a.href; }, 220);
  });

  // Reset the overlay when returning via the back button (bfcache).
  window.addEventListener("pageshow", function (e) {
    if (e.persisted && fade) { fade.style.transition = "none"; fade.style.opacity = "0"; }
  });

  /* ---------- GSAP animations ---------- */
  if (reduceMotion || !window.gsap) {
    doc.classList.add("anim-done");
    return;
  }

  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out" });

  // Hero text staggers in on load
  var heroBits = gsap.utils.toArray("[data-hero]");
  if (heroBits.length) {
    gsap.from(heroBits, { y: 34, opacity: 0, duration: 0.9, stagger: 0.09, delay: 0.1 });
  }

  // Service tiles slide up one by one (they sit at the fold, so run on load)
  var tiles = gsap.utils.toArray(".tile");
  if (tiles.length) {
    gsap.from(tiles, { y: 60, opacity: 0, duration: 0.8, stagger: 0.08, delay: 0.45 });
  }

  // CSS was hiding [data-hero] and .tile until GSAP took over — release it.
  doc.classList.add("anim-done");

  if (!window.ScrollTrigger) return;

  // Sections fade up on scroll
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });

  // Grids reveal their children in a quick stagger
  gsap.utils.toArray("[data-reveal-group]").forEach(function (group) {
    gsap.from(group.children, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: "top 88%", once: true }
    });
  });
})();
