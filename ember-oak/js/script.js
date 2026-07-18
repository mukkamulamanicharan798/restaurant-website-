(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. Lazy-load background images with graceful fallback.
        Elements with class .img-bg + data-src get their
        background-image set only after the image successfully
        loads; otherwise the CSS ember-gradient stays as-is.
  --------------------------------------------------------- */
  var bgEls = document.querySelectorAll(".img-bg[data-src]");
  var io = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            loadBg(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { rootMargin: "200px 0px" })
    : null;

  function loadBg(el) {
    var src = el.getAttribute("data-src");
    if (!src) return;
    var img = new Image();
    img.onload = function () {
      el.style.backgroundImage = "url('" + src + "')";
      el.classList.add("is-loaded");
    };
    img.onerror = function () {
      /* keep the CSS gradient fallback already applied via .img-bg */
      el.classList.add("is-fallback");
    };
    img.src = src;
  }

  bgEls.forEach(function (el) {
    if (io) io.observe(el);
    else loadBg(el);
  });

  /* ---------------------------------------------------------
     2. Sticky nav state + mobile burger menu
  --------------------------------------------------------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("navBurger");

  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------
     3. Scroll-reveal for elements with .reveal
  --------------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { revealIO.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------
     4. Hero ember-spark canvas — a slow drift of warm sparks
        rising through the hero, respecting reduced-motion.
  --------------------------------------------------------- */
  var canvas = document.getElementById("emberCanvas");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var hero = canvas.closest(".hero");
    var particles = [];
    var W, H;

    function resize() {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function makeParticle() {
      return {
        x: Math.random() * W,
        y: H + Math.random() * 60,
        r: 1 + Math.random() * 2.2,
        speed: 0.3 + Math.random() * 0.7,
        drift: (Math.random() - 0.5) * 0.4,
        life: 0,
        maxLife: 300 + Math.random() * 300,
        hue: Math.random() > 0.5 ? "226,98,47" : "201,162,39"
      };
    }
    for (var i = 0; i < 40; i++) particles.push(makeParticle());

    function tick() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function (p) {
        p.y -= p.speed;
        p.x += p.drift;
        p.life++;
        var fade = 1 - p.life / p.maxLife;
        if (fade <= 0 || p.y < -10) {
          Object.assign(p, makeParticle());
          return;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.hue + "," + Math.max(fade, 0) * 0.8 + ")";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(" + p.hue + ",0.8)";
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------
     5. Reviews carousel — dot navigation + scroll sync
  --------------------------------------------------------- */
  var track = document.getElementById("reviewsTrack");
  var dotsWrap = document.getElementById("reviewsDots");

  if (track && dotsWrap) {
    var cards = track.querySelectorAll(".review-card");
    cards.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.setAttribute("aria-label", "Go to review " + (i + 1));
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", function () {
        cards[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      });
      dotsWrap.appendChild(dot);
    });

    var dots = dotsWrap.querySelectorAll("button");
    var syncTimeout;
    track.addEventListener("scroll", function () {
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(function () {
        var trackCenter = track.scrollLeft + track.clientWidth / 2;
        var closest = 0;
        var closestDist = Infinity;
        cards.forEach(function (card, i) {
          var center = card.offsetLeft + card.clientWidth / 2;
          var dist = Math.abs(center - trackCenter);
          if (dist < closestDist) { closestDist = dist; closest = i; }
        });
        dots.forEach(function (d, i) { d.classList.toggle("is-active", i === closest); });
      }, 80);
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     6. Contact form — front-end only demo submit
  --------------------------------------------------------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      status.textContent = name
        ? "Thank you, " + name + " — we'll confirm your table shortly."
        : "Thank you — we'll be in touch shortly.";
      form.reset();
    });
  }
})();
