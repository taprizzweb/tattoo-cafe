# The Tattoo Cafe & Lounge — Website

Hawa Mahal ke saamne wale tattoo studio + rooftop lounge ki website (Jaipur).
Main goal: **Hawa Mahal + tattoos highlight karna** aur **saari enquiries WhatsApp pe laana**.

## Files

| File | Kya hai |
|---|---|
| `index.html` | Poori website (ek page) |
| `css/style.css` | Design |
| `js/config.js` | **Business details yahan badlo**: WhatsApp number, Instagram, timings, WhatsApp messages |
| `js/main.js` | WhatsApp links, Google reviews, menu |
| `api/reviews.js` | Google se reviews laane wala server function (Vercel) |
| `assets/` | Hero video + photos |

## Local pe dekhna

```bash
python3 -m http.server 8000
```
Phir browser mein `http://localhost:8000` kholo. Local pe sample reviews dikhenge.

## Live karna (Vercel, free)

1. Vercel pe yeh GitHub repo import karo, koi build setting nahi chahiye.
2. Domain jodo (e.g. `thetattoocafejaipur.com`).

## Google reviews auto-show

1. Google Cloud Console → naya project → billing on → **Places API (New)** enable karo → API key banao.
2. Cafe ka **Place ID** nikalo: https://developers.google.com/maps/documentation/places/web-service/place-id
3. Vercel → Settings → Environment Variables:
   - `GOOGLE_PLACES_API_KEY` = API key
   - `GOOGLE_PLACE_ID` = Place ID
4. `js/config.js` mein `googlePlaceId` bhi daalo, taaki "Write a review" button seedha review box khole.

Website sirf **4★ aur 5★** reviews dikhati hai aur 24 ghante mein ek baar Google se refresh karti hai.

## WhatsApp enquiries + auto-reply

Har button `wa.me` link se WhatsApp kholta hai, message pehle se likha hota hai (`js/config.js` → `waMessages`).
Auto-reply cafe ke **WhatsApp Business** se hoga:

- **Free tarika (WhatsApp Business app):** Business tools → Greeting message, Away message, Quick replies (`/price`, `/aftercare`, `/location`), Catalog (tattoo styles + rates).
- **Advanced (Meta WhatsApp Cloud API + chatbot):** Interakt / AiSensy / WATI jaise tools se button wala menu bot: "Tattoo price", "Book slot", "Location" → booking WhatsApp pe hi close. ~₹1,000–2,500/mahina + Meta ka per-conversation charge.

## Abhi baaki (TODO)

- [x] WhatsApp number
- [ ] Instagram handle → `js/config.js`
- [x] Menu photos (5 pages)
- [ ] Cover charge amount (abhi "ask on WhatsApp" likha hai)
- [ ] Asli tattoo photos → `#work` gallery
- [ ] Artists ke naam/photos
- [ ] Tattoo starting prices confirm
- [x] Timings (8:30 AM – 11 PM)
- [ ] Google API key + Place ID
