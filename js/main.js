(function () {
  "use strict";
  var S = window.SITE || {};

  /* ---------- Fill business details from config ---------- */
  function waUrl(key) {
    var text = (S.waMessages && S.waMessages[key]) || S.waMessages.general || "";
    return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text);
  }
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.href = waUrl(el.getAttribute("data-wa"));
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-instagram]").forEach(function (el) { el.href = S.instagram; });
  document.querySelectorAll("[data-maps]").forEach(function (el) { el.href = S.mapsUrl; });
  document.querySelectorAll("[data-hours]").forEach(function (el) { el.textContent = S.hours; });
  document.querySelectorAll("[data-address]").forEach(function (el) { el.textContent = S.address; });
  document.querySelectorAll("[data-map-embed]").forEach(function (el) { el.src = S.mapsEmbed; });
  document.querySelectorAll("[data-phone]").forEach(function (el) { el.textContent = S.phoneDisplay; el.href = "tel:" + S.phoneLink; });
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Celebrity film roll ---------- */
  var track = document.getElementById("filmTrack");
  if (track && S.celebrities && S.celebrities.length) {
    var esc0 = function (t) { return String(t || "").replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
    // Repeat the list so one set is wider than any screen, otherwise the loop shows a gap.
    var list = S.celebrities.slice();
    while (list.length < 10) list = list.concat(S.celebrities);
    var frames = list.map(function (c) {
      var alt = c.name ? c.name + " at The Tattoo Cafe" : "Celebrity guest at The Tattoo Cafe";
      var pic = c.photo
        ? "<img src='" + esc0(c.photo) + "' alt='" + esc0(alt) + "' loading='lazy'" + (c.pos ? " style='object-position:" + esc0(c.pos) + "'" : "") + ">"
        : "<div class='frame__ph'><span>Celebrity photo</span></div>";
      var cap = c.name ? "<figcaption><strong>" + esc0(c.name) + "</strong><span>" + esc0(c.note) + "</span></figcaption>" : "";
      return "<figure class='frame'>" + pic + cap + "</figure>";
    }).join("");
    // Two copies make a seamless loop; the second copy is hidden from screen readers.
    track.style.animationDuration = Math.round(list.length * 5.5) + "s"; // same speed whatever the count
    track.innerHTML = "<div class='film__set'>" + frames + "</div><div class='film__set' aria-hidden='true'>" + frames + "</div>";
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
      if (date) { var d = new Date(date + "T00:00"); date = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }
      var lines = [
        "Hi! I'd like to make a booking at The Tattoo Cafe & Lounge.",
        "",
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
    var rDate = document.getElementById("rDate");
    if (rDate) rDate.min = new Date().toISOString().slice(0, 10);
  }

  /* ---------- Shared lightbox ---------- */
  var box = document.getElementById("lightbox");
  var boxImg = box.querySelector("img");
  var lbList = [], lbCur = 0, lbLabel = "";
  function lbShow(i) {
    lbCur = (i + lbList.length) % lbList.length;
    boxImg.src = lbList[lbCur].src;
    boxImg.alt = lbList[lbCur].alt || (lbLabel + " " + (lbCur + 1) + " of " + lbList.length);
  }
  function openLightbox(list, i, label) {
    lbList = list; lbLabel = label;
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

  /* ---------- Tattoo marquee (two rows, always moving) ---------- */
  var tats = S.tattoos || [];
  var rowA = document.getElementById("tattooRowA"), rowB = document.getElementById("tattooRowB");
  if (rowA && rowB && tats.length) {
    var escT = function (t) { return String(t || "").replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
    var lbTats = tats.map(function (t) { return { src: t.src, alt: t.caption }; });
    var half = Math.ceil(tats.length / 2);
    var build = function (row, list, offset) {
      var cards = list.map(function (t, i) {
        return "<button type='button' class='tcard' data-i='" + (i + offset) + "' aria-label='View " + escT(t.caption) + " tattoo'>" +
          "<img src='" + escT(t.src) + "' alt='" + escT(t.caption) + " tattoo made at The Tattoo Cafe' loading='lazy'>" +
          "<span class='tcard__cap'><strong>" + escT(t.caption) + "</strong><small>" + escT(t.note) + "</small></span></button>";
      }).join("");
      // Two copies make a seamless loop; the copy is hidden from screen readers and keyboard.
      row.innerHTML = "<div class='tmarquee__set'>" + cards + "</div><div class='tmarquee__set' aria-hidden='true' inert>" + cards + "</div>";
      row.style.setProperty("--dur", Math.round(list.length * 6) + "s");
    };
    build(rowA, tats.slice(0, half), 0);
    build(rowB, tats.slice(half), half);
    [rowA, rowB].forEach(function (row) {
      row.addEventListener("click", function (e) {
        var c = e.target.closest(".tcard"); if (!c) return;
        openLightbox(lbTats, Number(c.getAttribute("data-i")), "Tattoo photo");
      });
    });
  }

  /* ---------- Menu pages + lightbox ---------- */
  var menuWrap = document.getElementById("menuPages");
  var pages = S.menuPages || [];
  if (menuWrap) {
    if (!pages.length) {
      menuWrap.innerHTML = "<p class='menu-pages__empty'>Menu photos coming soon. Ask us on WhatsApp for today's menu.</p>";
    } else {
      menuWrap.innerHTML = pages.map(function (src, i) {
        return "<button type='button' class='menu-page' data-i='" + i + "' aria-label='Open menu page " + (i + 1) + "'>" +
          "<img src='" + src + "' alt='Menu page " + (i + 1) + "' loading='lazy' onload=\"if(this.naturalWidth>this.naturalHeight)this.classList.add('is-wide')\"></button>";
      }).join("");
      menuWrap.addEventListener("click", function (e) {
        var b = e.target.closest(".menu-page"); if (!b) return;
        openLightbox(pages.map(function (src, i) { return { src: src, alt: "Menu page " + (i + 1) + " of " + pages.length }; }), Number(b.getAttribute("data-i")), "Menu page");
      });
    }
  }

  /* ---------- Header: solid on scroll + mobile menu ---------- */
  var header = document.getElementById("header");
  function onScroll() { header.classList.toggle("is-solid", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  function closeMenu() {
    document.body.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  }
  menuBtn.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".section__head, .moment, .stars-reel__head, .enquiry, .hm__grid, .cafe, .reserve__grid, .steps li");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealEls.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Google reviews ---------- */
  var SAMPLE = S.featuredReviews || [];

  function fmtCount(n) { return Number(n).toLocaleString("en-IN") + "+"; }
  function setSummary(rating, total) {
    if (rating) document.querySelectorAll("[data-rating]").forEach(function (el) { el.textContent = Number(rating).toFixed(1); });
    if (total) document.querySelectorAll("[data-review-count]").forEach(function (el) { el.textContent = fmtCount(total); });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function renderReviews(list) {
    var wrap = document.getElementById("reviewList");
    wrap.innerHTML = list.map(function (r) {
      var stars = "★★★★★".slice(0, r.rating) + "<span class='stars__off'>" + "★★★★★".slice(r.rating) + "</span>";
      var initial = esc((r.author || "G").trim().charAt(0).toUpperCase());
      var avatar = r.photo
        ? "<img class='review__avatar' src='" + esc(r.photo) + "' alt='' loading='lazy' referrerpolicy='no-referrer'>"
        : "<span class='review__avatar review__avatar--ph'>" + initial + "</span>";
      var name = r.authorUrl
        ? "<a href='" + esc(r.authorUrl) + "' target='_blank' rel='noopener'>" + esc(r.author) + "</a>"
        : esc(r.author);
      return "<article class='review'>" +
        "<p class='stars' aria-label='" + r.rating + " out of 5 stars'>" + stars + "</p>" +
        "<blockquote class='review__text'>" + esc(r.text) + "</blockquote>" +
        "<footer class='review__by'>" + avatar + "<span><strong>" + name + "</strong><small>" + esc(r.time || "") + "</small></span>" +
        "<span class='review__src'>Google</span></footer>" +
        "</article>";
    }).join("");
  }

  var revList = document.getElementById("reviewList");
  function scrollReviews(dir) {
    var card = revList.querySelector(".review");
    var step = card ? card.getBoundingClientRect().width + 18 : 320;
    revList.scrollBy({ left: dir * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  document.getElementById("revPrev").addEventListener("click", function () { scrollReviews(-1); });
  document.getElementById("revNext").addEventListener("click", function () { scrollReviews(1); });

  var writeUrl = S.googlePlaceId
    ? "https://search.google.com/local/writereview?placeid=" + encodeURIComponent(S.googlePlaceId)
    : S.mapsUrl;
  document.getElementById("writeReview").href = writeUrl;
  document.getElementById("allReviews").href = S.mapsUrl;
  setSummary(S.fallbackRating, S.fallbackReviewCount);

  function useSample() {
    renderReviews(SAMPLE);
  }

  if (location.protocol === "file:") {
    useSample();
  } else {
    fetch("/api/reviews")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        setSummary(d.rating, d.total);
        if (d.mapsUrl) document.getElementById("allReviews").href = d.mapsUrl;
        if (d.writeReviewUrl) document.getElementById("writeReview").href = d.writeReviewUrl;
        if (d.reviews && d.reviews.length) renderReviews(d.reviews); else useSample();
      })
      .catch(useSample);
  }
})();
