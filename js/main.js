(function () {
  "use strict";
  var S = window.SITE || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var ARROW = "<svg width='14' height='14' aria-hidden='true'><use href='#i-arrow'/></svg>";

  /* ---------- Business details from config ---------- */
  function waUrl(key) {
    var text = (S.waMessages && (S.waMessages[key] || S.waMessages.general)) || "";
    return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text);
  }
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.href = waUrl(el.getAttribute("data-wa"));
    el.target = "_blank"; el.rel = "noopener";
  });
  document.querySelectorAll("[data-wa-occasion]").forEach(function (el) {
    var text = "Hi! I'd like to plan " + el.getAttribute("data-wa-occasion") + " at The Tattoo Cafe & Lounge.\n\nDate: \nNumber of guests: \nAnything special: ";
    el.href = "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text);
  });
  document.querySelectorAll("[data-instagram]").forEach(function (el) { el.href = S.instagram; });
  document.querySelectorAll("[data-maps]").forEach(function (el) { el.href = S.mapsUrl; });
  document.querySelectorAll("[data-address]").forEach(function (el) { el.textContent = S.address; });
  document.querySelectorAll("[data-map-embed]").forEach(function (el) { el.src = S.mapsEmbed; });
  document.querySelectorAll("[data-phone]").forEach(function (el) {
    el.firstChild ? (el.firstChild.nodeValue = S.phoneDisplay + " ") : (el.textContent = S.phoneDisplay);
    el.href = "tel:" + S.phoneLink;
  });
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("menuToggle");
  var mnav = document.getElementById("mobileNav");
  function closeMenu() {
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  toggle.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  mnav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- Lightbox (shared) ---------- */
  var box = document.getElementById("lightbox");
  var boxImg = box.querySelector("img");
  var lbList = [], lbCur = 0;
  function lbShow(i) {
    lbCur = (i + lbList.length) % lbList.length;
    boxImg.src = lbList[lbCur].src;
    boxImg.alt = lbList[lbCur].alt;
  }
  function openLightbox(list, i, label) {
    lbList = list;
    box.setAttribute("aria-label", label);
    box.querySelectorAll(".lightbox__nav").forEach(function (n) { n.hidden = list.length < 2; });
    lbShow(i);
    if (box.showModal) box.showModal(); else window.open(list[i].src, "_blank");
  }
  box.querySelector(".lightbox__close").addEventListener("click", function () { box.close(); });
  box.querySelector(".lightbox__nav--prev").addEventListener("click", function () { lbShow(lbCur - 1); });
  box.querySelector(".lightbox__nav--next").addEventListener("click", function () { lbShow(lbCur + 1); });
  box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
  box.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") lbShow(lbCur - 1);
    if (e.key === "ArrowRight") lbShow(lbCur + 1);
  });

  /* ---------- Celebrity film roll ---------- */
  var film = document.getElementById("filmTrack");
  var celebs = S.celebrities || [];
  if (film && celebs.length) {
    var list = celebs.slice();
    while (list.length < 10) list = list.concat(celebs);
    var frames = list.map(function (c) {
      var alt = c.name ? c.name + " at The Tattoo Cafe" : "Celebrity guest at The Tattoo Cafe";
      return "<figure class='frame'><img src='" + esc(c.photo) + "' alt='" + esc(alt) + "' loading='lazy'" +
        (c.pos ? " style='object-position:" + esc(c.pos) + "'" : "") + "></figure>";
    }).join("");
    film.style.setProperty("--dur", Math.round(list.length * 5) + "s");
    film.innerHTML = "<div class='film__set'>" + frames + "</div><div class='film__set' aria-hidden='true'>" + frames + "</div>";
  }

  /* ---------- Tattoo gallery: one-row slider ---------- */
  var gal = document.getElementById("tattooGallery");
  var slider = document.getElementById("tattooSlider");
  var tats = S.tattoos || [];
  if (gal && tats.length) {
    gal.innerHTML = tats.map(function (t, i) {
      return "<article class='slide'>" +
        "<button type='button' class='card__img' data-i='" + i + "' aria-label='View " + esc(t.caption) + " full size'>" +
        "<img src='" + esc(t.src) + "' alt='" + esc(t.caption) + " tattoo made at The Tattoo Cafe' loading='lazy' draggable='false'>" +
        "<span class='card__go' aria-hidden='true'>" + ARROW + "</span></button>" +
        "<p class='kicker'>" + esc(t.note) + "</p><h3>" + esc(t.caption) + "</h3></article>";
    }).join("");
    var slides = gal.querySelectorAll(".slide");
    var count = document.getElementById("galleryCount");
    var bar = document.getElementById("galleryBar");
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var update = function () {
      var max = slider.scrollWidth - slider.clientWidth;
      var k = max > 0 ? slider.scrollLeft / max : 0;
      bar.style.transform = "scaleX(" + Math.max(0.06, k) + ")";
      var w = slides[0].getBoundingClientRect().width + 24;
      var idx = Math.min(slides.length, Math.round(slider.scrollLeft / w) + 1);
      count.textContent = pad(idx) + " / " + pad(slides.length);
      document.getElementById("galleryPrev").disabled = slider.scrollLeft < 4;
      document.getElementById("galleryNext").disabled = slider.scrollLeft > max - 4;
    };
    var step = function (dir) {
      var w = slides[0].getBoundingClientRect().width + 24;
      var n = Math.max(1, Math.floor(slider.clientWidth / w) - 1);
      slider.scrollBy({ left: dir * w * n, behavior: reduce ? "auto" : "smooth" });
    };
    document.getElementById("galleryPrev").addEventListener("click", function () { step(-1); });
    document.getElementById("galleryNext").addEventListener("click", function () { step(1); });
    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    });
    slider.addEventListener("scroll", function () { requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);
    update();

    // Drag to scroll with the mouse (touch already swipes natively).
    var down = false, moved = false, sx = 0, sl = 0;
    slider.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; sx = e.clientX; sl = slider.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 5) { moved = true; slider.classList.add("is-drag"); }
      if (moved) slider.scrollLeft = sl - dx;
    });
    window.addEventListener("pointerup", function () { down = false; setTimeout(function () { slider.classList.remove("is-drag"); moved = false; }, 0); });

    gal.addEventListener("click", function (e) {
      if (slider.classList.contains("is-drag")) { e.preventDefault(); return; }
      var b = e.target.closest(".card__img"); if (!b) return;
      openLightbox(tats.map(function (t) { return { src: t.src, alt: t.caption }; }), Number(b.getAttribute("data-i")), "Tattoo photo");
    });
  }

  /* ---------- Menu pages ---------- */
  var menuWrap = document.getElementById("menuPages");
  var pages = S.menuPages || [];
  var pageNames = ["Starters", "Main course", "Smoothie bowls & vegan", "Shakes & coolers", "Maggie & pakora"];
  if (menuWrap && pages.length) {
    menuWrap.innerHTML = pages.map(function (src, i) {
      return "<article class='card reveal'><button type='button' class='menu-page' data-i='" + i + "' aria-label='Open menu page " + (i + 1) + "'>" +
        "<img src='" + esc(src) + "' alt='Menu page " + (i + 1) + "' loading='lazy' onload=\"if(this.naturalWidth>this.naturalHeight)this.classList.add('is-wide')\"></button>" +
        "<p class='kicker'>Page " + (i + 1) + "</p><h3>" + esc(pageNames[i] || "Menu") + "</h3></article>";
    }).join("");
    menuWrap.addEventListener("click", function (e) {
      var b = e.target.closest(".menu-page"); if (!b) return;
      openLightbox(pages.map(function (src, i) { return { src: src, alt: "Menu page " + (i + 1) + " of " + pages.length }; }), Number(b.getAttribute("data-i")), "Menu page");
    });
  }

  /* ---------- Reviews marquee ---------- */
  var track = document.getElementById("reviewTrack");
  function renderReviews(list) {
    if (!track || !list.length) return;
    var cards = list.map(function (r) {
      return "<article class='review'><span class='review__q' aria-hidden='true'>“</span>" +
        "<p class='review__stars' aria-label='" + r.rating + " out of 5 stars'>" + "★★★★★".slice(0, r.rating) + "</p>" +
        "<p class='review__text'>" + esc(r.text) + "</p>" +
        "<p class='review__by'>" + esc(r.author) + "<small>" + esc(r.time || "Google review") + "</small></p></article>";
    }).join("");
    track.style.setProperty("--dur", Math.round(list.length * 9) + "s");
    track.innerHTML = "<div class='track__set'>" + cards + "</div><div class='track__set' aria-hidden='true' inert>" + cards + "</div>";
  }
  var pauseBtn = document.getElementById("reviewPause");
  pauseBtn.addEventListener("click", function () {
    var paused = track.classList.toggle("is-paused");
    pauseBtn.setAttribute("aria-pressed", String(paused));
    pauseBtn.querySelector(".pause__label").textContent = paused ? "Play" : "Pause";
  });

  function fmtCount(n) { return Number(n).toLocaleString("en-IN") + "+"; }
  function setSummary(rating, total) {
    if (rating) document.querySelectorAll("[data-rating]").forEach(function (el) { el.textContent = Number(rating).toFixed(1); });
    if (total) document.querySelectorAll("[data-review-count]").forEach(function (el) { el.textContent = fmtCount(total); });
  }
  document.getElementById("allReviews").href = S.mapsUrl;
  document.getElementById("writeReview").href = S.googlePlaceId
    ? "https://search.google.com/local/writereview?placeid=" + encodeURIComponent(S.googlePlaceId)
    : S.mapsUrl;
  setSummary(S.fallbackRating, S.fallbackReviewCount);
  var fallback = S.featuredReviews || [];
  if (location.protocol === "file:") {
    renderReviews(fallback);
  } else {
    fetch("/api/reviews")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        setSummary(d.rating, d.total);
        if (d.mapsUrl) document.getElementById("allReviews").href = d.mapsUrl;
        if (d.writeReviewUrl) document.getElementById("writeReview").href = d.writeReviewUrl;
        renderReviews(d.reviews && d.reviews.length ? d.reviews : fallback);
      })
      .catch(function () { renderReviews(fallback); });
  }

  /* ---------- Reservation form -> WhatsApp ---------- */
  var rform = document.getElementById("reserveForm");
  if (rform) {
    var checks = {
      rName: function (v) { return v.trim().length > 1; },
      rPhone: function (v) { return v.replace(/\D/g, "").length >= 10; },
      rType: function (v) { return v !== ""; },
    };
    var setErr = function (id, bad) {
      var el = document.getElementById(id);
      el.closest(".field").classList.toggle("has-err", bad);
      el.setAttribute("aria-invalid", bad ? "true" : "false");
      el.setAttribute("aria-describedby", id + "Err");
    };
    Object.keys(checks).forEach(function (id) {
      var el = document.getElementById(id);
      el.addEventListener("blur", function () { if (el.value) setErr(id, !checks[id](el.value)); });
      el.addEventListener("input", function () { if (checks[id](el.value)) setErr(id, false); });
      el.addEventListener("change", function () { if (checks[id](el.value)) setErr(id, false); });
    });
    rform.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(checks).forEach(function (id) {
        var el = document.getElementById(id), bad = !checks[id](el.value);
        setErr(id, bad); if (bad && !firstBad) firstBad = el;
      });
      if (firstBad) { firstBad.focus(); return; }
      var f = rform.elements, date = f.date.value;
      if (date) date = new Date(date + "T00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
      var lines = [
        "Hi! I'd like to make a booking at The Tattoo Cafe & Lounge.", "",
        "Name: " + f.name.value.trim(),
        "Phone: " + f.phone.value.trim(),
        "Looking for: " + f.type.value,
        "Date: " + (date || "Flexible"),
        "Guests: " + f.guests.value,
      ];
      if (f.note.value.trim()) lines.push("Note: " + f.note.value.trim());
      var url = "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));
      var w = window.open(url, "_blank");
      if (w) w.opener = null; else location.href = url;
    });
    // Occasion cards pre-fill the booking type, then jump to the form.
    document.querySelectorAll("[data-occasion]").forEach(function (a) {
      a.addEventListener("click", function () {
        var sel = document.getElementById("rType");
        sel.value = a.getAttribute("data-occasion");
        sel.dispatchEvent(new Event("change"));
        sel.closest(".field").classList.add("is-picked");
        setTimeout(function () { sel.closest(".field").classList.remove("is-picked"); document.getElementById("rName").focus({ preventScroll: true }); }, 900);
      });
    });
    var rDate = document.getElementById("rDate");
    if (rDate) rDate.min = new Date().toISOString().slice(0, 10);
  }

  /* ---------- Sticky header, progress bar, parallax ---------- */
  var header = document.getElementById("header");
  var progress = document.getElementById("progress");
  var parallax = reduce ? [] : [].slice.call(document.querySelectorAll("[data-parallax]"));
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("is-solid", y > 60);
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    parallax.forEach(function (el) {
      var box = el.parentElement.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;
      var shift = (box.top + box.height / 2 - window.innerHeight / 2) * Number(el.getAttribute("data-parallax"));
      el.style.transform = "translate3d(0," + shift.toFixed(1) + "px,0) scale(1.12)";
    });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Number counters ---------- */
  function runCounter(el) {
    var end = Number(el.getAttribute("data-count")), start = end > 100 ? Math.round(end * 0.9) : 0;
    var t0 = null, dur = 1600;
    function frame(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(start + (end - start) * e);
      if (k < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Scroll reveal ---------- */
  var io = null;
  function observe(el) {
    if (io) io.observe(el); else el.classList.add("in");
  }
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
  }
  document.querySelectorAll(".reveal").forEach(observe);
})();
