/* ==============================================================
   POLISH.JS
   Purely decorative extras layered on top of main.js:
   1) A two-part cursor (dot + trailing ring) for fine-pointer
      devices only (real mice/trackpads — never touch).
   2) A gentle 3D tilt on cards when the mouse moves over them.
   3) An auto-scrolling, seamless brand strip.
   4) A scroll-position progress bar.
   None of this touches page content, language, theme, filters,
   forms or popups — main.js still owns all of that.
   ============================================================== */

(function () {
  "use strict";

  var canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------- 1. Custom cursor ---------- */
  function setupCursor() {
    if (!canHover || reduceMotion) return;

    var dot = document.getElementById("cursorDot");
    var ring = document.getElementById("cursorRing");
    var label = document.getElementById("cursorLabel");
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-fine-cursor");

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var ringX = mouseX;
    var ringY = mouseY;

    window.addEventListener("mousemove", function (event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform =
        "translate(" + mouseX + "px, " + mouseY + "px) translate(-50%, -50%)";
    });

    function tick() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform =
        "translate(" + ringX + "px, " + ringY + "px) translate(-50%, -50%)";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    var labels = [
      { selector: ".project-card", text: { ar: "عرض", en: "VIEW" } },
      { selector: ".brand-card", text: { ar: "فتح", en: "OPEN" } },
      { selector: ".gallery-img, figure", text: { ar: "", en: "" } },
      { selector: "a, button", text: { ar: "", en: "" } },
    ];

    document.addEventListener("mouseover", function (event) {
      var match = null;
      for (var i = 0; i < labels.length; i++) {
        if (event.target.closest(labels[i].selector)) {
          match = labels[i];
          break;
        }
      }
      if (!match) {
        ring.classList.remove("is-active");
        return;
      }
      var language =
        document.documentElement.getAttribute("lang") === "ar" ? "ar" : "en";
      var text = match.text[language] || "";
      if (label) label.textContent = text;
      ring.classList.toggle("is-active", Boolean(text));
    });

    document.addEventListener("mouseout", function (event) {
      var stillOver = false;
      for (var i = 0; i < labels.length; i++) {
        if (
          event.relatedTarget &&
          event.relatedTarget.closest &&
          event.relatedTarget.closest(labels[i].selector)
        ) {
          stillOver = true;
          break;
        }
      }
      if (!stillOver) ring.classList.remove("is-active");
    });
  }

  /* ---------- 2. Card tilt ---------- */
  function setupTilt() {
    if (!canHover || reduceMotion) return;

    var selector =
      ".project-card, .factory-card, .mini-card, .service-card, .cap-card, .brand-card, .qc-card";
    var cards = document.querySelectorAll(selector);

    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        if (card.dataset.tiltReady === "1") return;
        card.dataset.tiltReady = "1";

        card.addEventListener("mousemove", function (event) {
          var box = card.getBoundingClientRect();
          var px = (event.clientX - box.left) / box.width - 0.5;
          var py = (event.clientY - box.top) / box.height - 0.5;
          var rotateX = (-py * 6).toFixed(2);
          var rotateY = (px * 6).toFixed(2);
          card.style.transform =
            "perspective(900px) translateY(-6px) rotateX(" +
            rotateX +
            "deg) rotateY(" +
            rotateY +
            "deg)";
        });

        card.addEventListener("mouseleave", function () {
          card.style.transform = "";
        });
      })(cards[i]);
    }
  }

  /* ---------- 3. Auto-scrolling brand strip ---------- */
  function setupMarquee() {
    var strips = document.querySelectorAll(".brand-strip");
    for (var s = 0; s < strips.length; s++) {
      var strip = strips[s];
      if (strip.classList.contains("is-looping")) continue;

      var items = Array.prototype.slice.call(strip.children);
      if (items.length < 2) continue;

      var track = document.createElement("div");
      track.className = "marquee-track";

      for (var i = 0; i < items.length; i++)
        track.appendChild(items[i].cloneNode(true));
      for (var j = 0; j < items.length; j++)
        track.appendChild(items[j].cloneNode(true));

      strip.innerHTML = "";
      strip.appendChild(track);
      strip.classList.add("is-looping");
    }
  }

  /* ---------- 4. Scroll progress bar ---------- */
  function setupScrollProgress() {
    var bar = document.getElementById("scrollProgress");
    if (!bar) return;

    window.addEventListener("scroll", function () {
      var scrollTop = window.scrollY;
      var docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = percent + "%";
    });
  }

  /* ---------- 5. Smooth page transition ---------- */
  /* main.js's showPage() swaps which .page has the "active" class
     synchronously. We wrap it here so every page change gets a
     short fade, without editing main.js itself. */
  function wrapPageTransitions() {
    if (typeof window.showPage !== "function") return;

    var originalShowPage = window.showPage;
    var app = document.getElementById("app");
    if (!app) {
      window.showPage = originalShowPage;
      return;
    }

    window.showPage = function (pageName) {
      if (!app.childNodes.length) {
        originalShowPage(pageName);
        runAll();
        return;
      }
      app.classList.add("is-switching");
      window.setTimeout(function () {
        originalShowPage(pageName);
        app.classList.remove("is-switching");
        runAll();
      }, 160);
    };
  }

  /* ---------- 6. Run on first load and every page swap ---------- */
  function runAll() {
    setupTilt();
    setupMarquee();
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupCursor();
    setupScrollProgress();
    wrapPageTransitions();
    runAll();

    // Hide the loader once the window has actually finished loading,
    // with a short minimum display time so it never just flashes.
    var loader = document.querySelector(".page-loader");
    if (loader) {
      var shownAt = performance.now();
      var minVisible = 450;

      var hideLoader = function () {
        var elapsed = performance.now() - shownAt;
        var wait = Math.max(0, minVisible - elapsed);
        window.setTimeout(function () {
          loader.classList.add("hide");
        }, wait);
      };

      if (document.readyState === "complete") {
        hideLoader();
      } else {
        window.addEventListener("load", hideLoader, { once: true });
        window.setTimeout(hideLoader, 2500);
      }
    }
  });
})();
