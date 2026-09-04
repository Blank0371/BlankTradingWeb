/* BlankTrading — progressive enhancements */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile navigation toggle
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Current year in footer
  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Scroll-reveal: fade/slide elements in as they enter the viewport
  var revealTargets = document.querySelectorAll(
    ".section-head, .card, .about-inner, .contact-inner, .hero-actions"
  );

  revealTargets.forEach(function (el, i) {
    el.classList.add("reveal");
    // Cards animate in from alternating sides and stagger within their row
    // for a cascading entrance; section heads gently scale up.
    if (el.classList.contains("card")) {
      el.setAttribute("data-reveal", i % 2 ? "right" : "left");
      el.style.transitionDelay = (i % 2) * 0.08 + 0.04 + "s";
    } else if (el.classList.contains("section-head")) {
      el.setAttribute("data-reveal", "scale");
    }
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealTargets.forEach(function (el) { io.observe(el); });
  }

  // Scroll-driven effects: progress bar, condensed header, hero parallax.
  var progress = document.querySelector(".scroll-progress");
  var header = document.querySelector(".site-header");
  var heroBg = reduceMotion ? null : document.querySelector(".hero-bg");
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;

    if (progress) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docH > 0 ? Math.min(y / docH, 1) : 0;
      progress.style.transform = "scaleX(" + pct + ")";
    }

    if (header) {
      header.classList.toggle("scrolled", y > 8);
    }

    // Gentle parallax drift on the hero backdrop (orbs keep their own
    // float animation; only the container translates on scroll).
    if (heroBg && y < window.innerHeight) {
      heroBg.style.transform = "translate3d(0," + (y * 0.25) + "px,0)";
    }

    ticking = false;
  }

  function requestScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }

  window.addEventListener("scroll", requestScroll, { passive: true });
  window.addEventListener("resize", requestScroll, { passive: true });
  onScroll();

  // Cursor-following spotlight on service cards
  if (!reduceMotion) {
    document.querySelectorAll(".card-anim").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }
})();
