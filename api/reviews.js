/*
 * GET /api/reviews
 * Google Places API (New) se cafe ke reviews laata hai, sirf 4★ aur 5★ wale return karta hai.
 *
 * Vercel → Project → Settings → Environment Variables mein set karo:
 *   GOOGLE_PLACES_API_KEY  — Google Cloud Console se (Places API (New) enable karke)
 *   GOOGLE_PLACE_ID        — cafe ka Place ID (ChIJ... se shuru hota hai)
 *
 * Response CDN pe 24 ghante cache hota hai, toh API ka kharcha lagbhag zero rehta hai.
 */
const MIN_STARS = 4;

module.exports = async (req, res) => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!key || !placeId) {
    res.status(503).json({ error: "not_configured" });
    return;
  }

  try {
    const r = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
        },
      }
    );
    if (!r.ok) throw new Error(`Places API ${r.status}`);
    const place = await r.json();

    const reviews = (place.reviews || [])
      .filter((rv) => (rv.rating || 0) >= MIN_STARS)
      .map((rv) => ({
        author: rv.authorAttribution?.displayName || "Google user",
        authorUrl: rv.authorAttribution?.uri || null,
        photo: rv.authorAttribution?.photoUri || null,
        rating: rv.rating,
        text: rv.text?.text || rv.originalText?.text || "",
        time: rv.relativePublishTimeDescription || "",
      }))
      .filter((rv) => rv.text);

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=43200");
    res.status(200).json({
      rating: place.rating ?? null,
      total: place.userRatingCount ?? null,
      mapsUrl: place.googleMapsUri || null,
      writeReviewUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
      reviews,
    });
  } catch (err) {
    res.status(502).json({ error: "upstream_failed" });
  }
};
