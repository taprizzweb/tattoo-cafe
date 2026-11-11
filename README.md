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

## WhatsApp Assistant (bot)

| File | Kya hai |
|---|---|
| `bot/flow.js` | Bot ke saare jawab, buttons aur FAQ. **Jawab yahin badlo**, demo aur asli bot dono mein apne aap badal jaayenge. |
| `bot-demo.html` | Pitch ke liye demo, phone pe chalta hai: `/bot-demo.html`. Isme Meta ki zaroorat nahi. |
| `api/whatsapp.js` | Asli bot: Meta WhatsApp Cloud API ka webhook |

**Kaise kaam karta hai:** customer "Hi" bhejta hai, bot 3 button dikhata hai (Cafe visit / Tattoo / Table-Menu). Tattoo ya table chunne pe bot sawaal poochhta hai aur jawab milne pe **owner ko WhatsApp alert** jaata hai. Jo sawaal kisi rule mein nahi aata, uska jawab Claude (AI) deta hai. AI key na ho toh chat team ko de di jaati hai.

### Meta se jodna (test number, free)
1. https://developers.facebook.com → **Create app** → *Business* → **WhatsApp** product add karo.
2. **WhatsApp → API Setup**: Meta ek free **test number** deta hai. Wahan apna phone number "To" mein add karke verify karo (test mode mein max 5 numbers).
3. Vercel → Project → Settings → **Environment Variables** mein ye daalo:
   - `WA_TOKEN`: API Setup ka access token (24 ghante wala chalega; lambe samay ke liye System User token)
   - `WA_PHONE_NUMBER_ID`: usi page se
   - `WA_VERIFY_TOKEN`: koi bhi secret shabd jo tum khud chuno
   - `WA_APP_SECRET`: App settings → Basic → App secret
   - `OWNER_WHATSAPP`: jis number pe lead alert chahiye, jaise `919828065533`
   - `ANTHROPIC_API_KEY`: AI jawab ke liye (optional)
4. Redeploy karo.
5. **WhatsApp → Configuration → Webhook**: Callback URL `https://thetattoocafe-jaipur.vercel.app/api/whatsapp`, Verify token wahi `WA_VERIFY_TOKEN`. Phir **messages** field subscribe karo.
6. Apne phone se test number pe "Hi" bhejo.

**Dhyan rakhna:**
- Customer ke message ke 24 ghante ke andar diye jawab free hain. **Owner ko alert** tabhi free hai jab owner ne pichhle 24 ghante mein bot number pe koi message kiya ho. Nahi toh Meta ka approved template chahiye (~₹0.15 per message).
- Bot ko yaad rehta hai ki customer kaun se sawaal pe hai, lekin ye yaad server ki memory mein hai. Server kabhi restart hua toh chal rahi baat-cheet wapas main menu pe aa jaati hai. Production ke liye Upstash Redis jaisa chhota store lagana.
- AI ke jawab `claude-opus-5-5` (effort `low`) se aate hain. Sasta chahiye toh `api/whatsapp.js` mein model badal sakte ho.

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

## Photo credits
- `assets/hero-hawa-mahal.jpg` / `-m.jpg`: Hawa Mahal photo from Unsplash (photo-1603262110263), free to use under the Unsplash License. Baaki saari photos cafe ki apni hain.
