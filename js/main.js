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
    track.innerHTML = "<div class='film__set'>" + frames + "</div><div class='film__set' aria-hidden='true'>" + frames + "</div>";
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
  var revealEls = document.querySelectorAll(".section__head, .service, .moment, .tile, .stars-reel__head, .artist, .enquiry, .hm__grid, .cafe, .visit, .steps li");
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
  var SAMPLE = [
    { author: "Sample guest", rating: 5, time: "Sample review", text: "Got a small Hawa Mahal tattoo while looking at the real palace across the road. The artist was patient, everything was clean and sealed, and the view from the rooftop afterwards was unreal." },
    { author: "Sample guest", rating: 5, time: "Sample review", text: "Best view of Hawa Mahal in Jaipur, hands down. We came for sunset chai and my friend ended up getting inked. Lovely people." },
    { author: "Sample guest", rating: 5, time: "Sample review", text: "Messaged them on WhatsApp the night before, they had a design ready by morning. Perfect souvenir from Jaipur." },
    { author: "Sample guest", rating: 4, time: "Sample review", text: "Great fine-line work and very hygienic. The rooftop is the perfect spot for photos of the palace. Gets busy at sunset!" },
  ];

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

  var writeUrl = S.googlePlaceId
    ? "https://search.google.com/local/writereview?placeid=" + encodeURIComponent(S.googlePlaceId)
    : S.mapsUrl;
  document.getElementById("writeReview").href = writeUrl;
  document.getElementById("allReviews").href = S.mapsUrl;
  setSummary(S.fallbackRating, S.fallbackReviewCount);

  function useSample() {
    renderReviews(SAMPLE);
    document.getElementById("reviewsDemo").hidden = false;
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
