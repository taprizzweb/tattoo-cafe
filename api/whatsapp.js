/*
 * WhatsApp Assistant — Meta WhatsApp Cloud API webhook (Vercel serverless function).
 *
 *   GET  /api/whatsapp   Meta's one-time webhook verification
 *   POST /api/whatsapp   incoming customer messages
 *
 * Same conversation flow as the website demo (bot/flow.js). Questions that no rule
 * answers go to Claude; without an Anthropic key the bot hands them to the team instead.
 *
 * Vercel → Settings → Environment Variables:
 *   WA_TOKEN            Meta access token (WhatsApp → API Setup)            required
 *   WA_PHONE_NUMBER_ID  "Phone number ID" from the same page                 required
 *   WA_VERIFY_TOKEN     any secret word you also type into Meta's webhook form required
 *   WA_APP_SECRET       App secret (App settings → Basic), checks Meta's signature  recommended
 *   OWNER_WHATSAPP      owner's number for lead alerts, e.g. 919828065533    recommended
 *   ANTHROPIC_API_KEY   enables AI answers for free-form questions          optional
 *   SITE_URL            defaults to https://thetattoocafe-jaipur.vercel.app (for menu images)
 *   WA_GRAPH_VERSION    defaults to v21.0
 *
 * Note: chat progress (which question we're on) is kept in memory, so a cold start
 * mid-conversation restarts that customer at the main menu. Fine for a demo; for
 * production, swap `sessions` for a small store such as Upstash Redis.
 */
const crypto = require("crypto");
const FLOW = require("../bot/flow.js");

const SITE = (process.env.SITE_URL || "https://thetattoocafe-jaipur.vercel.app").replace(/\/$/, "");
const GRAPH = "https://graph.facebook.com/" + (process.env.WA_GRAPH_VERSION || "v21.0");

const sessions = new Map(); // phone -> { state, history, at }
const seen = new Set();     // message ids already handled (Meta retries deliveries)
const SESSION_TTL = 6 * 60 * 60 * 1000;

/* ---------------- Claude (only for questions no rule answers) ---------------- */
let anthropic = null;
if (process.env.ANTHROPIC_API_KEY) {
  const Anthropic = require("@anthropic-ai/sdk").default;
  anthropic = new Anthropic();
}

const SYSTEM_PROMPT = [
  "You are the WhatsApp assistant of The Tattoo Cafe & Lounge, a tattoo studio and rooftop café directly opposite Hawa Mahal in Jaipur.",
  "Reply like a friendly host on WhatsApp: short (1-4 sentences), warm, at most one emoji. Reply in the customer's language (English, Hindi or Hinglish).",
  "",
  "Facts you may use:",
  "- " + FLOW.info.hours + ".",
  "- Address: " + FLOW.info.address + ". Directions: " + FLOW.info.maps,
  "- A cover charge applies for entry; the team shares today's amount.",
  "- Vegetarian café with many vegan options; tofu from Auroville; no MSG, no artificial colours; pita bread baked in-house.",
  "- Tattoos: every style is designed and made in-house (Hawa Mahal and Jaipur motifs, fine-line, names and scripts, Sanskrit and spiritual, realism, colour, couple tattoos, cover-ups). Sterile single-use needles. 18+ with photo ID. Walk-ins welcome when an artist is free.",
  "- Tattoo prices depend on size and detail; the artist gives a free quote after seeing the idea.",
  "- Payment: cash, UPI and cards.",
  "",
  "Rules:",
  "- Never invent prices, the cover charge amount, offers, availability or anything not listed above.",
  "- If you don't know, say the team will reply here soon, and end your reply with the exact tag [HANDOFF].",
  "- If the customer wants a tattoo or a table, tell them to tap the matching button below, and end with [MENU].",
].join("\n");

async function askClaude(history, question) {
  const messages = history.concat([{ role: "user", content: question }]);
  try {
    const res = await anthropic.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" },
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      messages,
    });
    if (res.stop_reason === "refusal") return null;
    const text = res.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    return text || null;
  } catch (err) {
    if (err instanceof require("@anthropic-ai/sdk").APIError) {
      console.error("Claude API error", err.status, err.message);
    } else {
      console.error("Claude request failed", err && err.message);
    }
    return null;
  }
}

/* ---------------- WhatsApp Cloud API ---------------- */
async function wa(body) {
  const r = await fetch(GRAPH + "/" + process.env.WA_PHONE_NUMBER_ID + "/messages", {
    method: "POST",
    headers: { Authorization: "Bearer " + process.env.WA_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(Object.assign({ messaging_product: "whatsapp" }, body)),
  });
  if (!r.ok) console.error("WhatsApp send failed", r.status, await r.text());
  return r.ok;
}

const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

// One engine reply -> one or more WhatsApp messages.
async function sendReply(to, reply) {
  const text = clip(reply.text || "", 1024);
  if (reply.buttons) {
    await wa({
      to, type: "interactive",
      interactive: {
        type: "button",
        body: { text },
        action: { buttons: reply.buttons.slice(0, 3).map((b) => ({ type: "reply", reply: { id: b.id, title: clip(b.title, 20) } })) },
      },
    });
  } else if (reply.chips && reply.chips.length <= 3) {
    await wa({
      to, type: "interactive",
      interactive: {
        type: "button",
        body: { text },
        action: { buttons: reply.chips.map((c) => ({ type: "reply", reply: { id: "c:" + c, title: clip(c, 20) } })) },
      },
    });
  } else if (reply.chips) {
    await wa({
      to, type: "interactive",
      interactive: {
        type: "list",
        body: { text },
        action: { button: "Choose", sections: [{ title: "Options", rows: reply.chips.slice(0, 10).map((c) => ({ id: "c:" + c, title: clip(c, 24) })) }] },
      },
    });
  } else if (text) {
    await wa({ to, type: "text", text: { body: text, preview_url: true } });
  }
  for (const img of reply.images || []) {
    await wa({ to, type: "image", image: { link: SITE + "/" + img } });
  }
}

async function alertOwner(alert, from) {
  if (!process.env.OWNER_WHATSAPP || !alert) return;
  // Free only while the owner has messaged this number in the last 24 hours;
  // otherwise Meta needs an approved template (see README).
  await wa({ to: process.env.OWNER_WHATSAPP, type: "text", text: { body: FLOW.ownerAlert(alert.kind, from, alert.answers) } });
}

/* ---------------- One incoming message ---------------- */
function toInput(m) {
  if (m.type === "text") return { type: "text", value: m.text.body };
  if (m.type === "interactive") {
    const r = m.interactive.button_reply || m.interactive.list_reply || {};
    if (String(r.id).startsWith("c:")) return { type: "text", value: String(r.id).slice(2) };
    return { type: "button", value: r.id };
  }
  if (m.type === "image") return { type: "image", value: (m.image && m.image.caption) || "" };
  if (m.type === "button") return { type: "text", value: m.button.text };
  return { type: "text", value: "" };
}

async function handleMessage(m, contactName) {
  const from = m.from;
  const now = Date.now();
  let s = sessions.get(from);
  if (!s || now - s.at > SESSION_TTL) s = { state: {}, history: [] };
  s.at = now;
  sessions.set(from, s);

  const input = toInput(m);
  const res = FLOW.step(s.state, input);
  s.state = res.state;
  let replies = res.replies;
  let alert = res.alert;

  if (res.needAI) {
    const answer = anthropic ? await askClaude(s.history, input.value) : null;
    if (!answer || answer.includes("[HANDOFF]")) {
      replies = [{ text: answer ? answer.replace("[HANDOFF]", "").trim() : FLOW.unknown, buttons: FLOW.greeting.buttons }];
      alert = { kind: "human", answers: {} };
    } else {
      replies = [{ text: answer.replace("[MENU]", "").trim(), buttons: FLOW.greeting.buttons }];
    }
    // Keep a short text-only memory for the AI.
    s.history.push({ role: "user", content: input.value }, { role: "assistant", content: replies[0].text });
    s.history = s.history.slice(-8);
  }

  for (const r of replies) await sendReply(from, r);
  await alertOwner(alert, { name: contactName || "Customer", phone: "+" + from });
}

/* ---------------- HTTP handler ---------------- */
function readRaw(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function validSignature(raw, header) {
  const secret = process.env.WA_APP_SECRET;
  if (!secret) return true; // not configured: accept (set it before going live)
  if (!header || !header.startsWith("sha256=")) return false;
  const expected = Buffer.from("sha256=" + crypto.createHmac("sha256", secret).update(raw).digest("hex"));
  const got = Buffer.from(header);
  return expected.length === got.length && crypto.timingSafeEqual(expected, got);
}

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const q = new URL(req.url, "http://x").searchParams;
    if (q.get("hub.mode") === "subscribe" && process.env.WA_VERIFY_TOKEN && q.get("hub.verify_token") === process.env.WA_VERIFY_TOKEN) {
      res.status(200).send(q.get("hub.challenge"));
    } else {
      res.status(403).send("Forbidden");
    }
    return;
  }
  if (req.method !== "POST") { res.status(405).end(); return; }

  const raw = await readRaw(req);
  if (!validSignature(raw, req.headers["x-hub-signature-256"])) { res.status(401).end(); return; }
  if (!process.env.WA_TOKEN || !process.env.WA_PHONE_NUMBER_ID) { res.status(503).json({ error: "not_configured" }); return; }

  let body;
  try { body = JSON.parse(raw.toString("utf8")); } catch (e) { res.status(400).end(); return; }

  try {
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const v = change.value || {};
        const name = v.contacts && v.contacts[0] && v.contacts[0].profile && v.contacts[0].profile.name;
        for (const m of v.messages || []) {
          if (seen.has(m.id)) continue;
          seen.add(m.id);
          if (seen.size > 5000) seen.clear();
          await handleMessage(m, name);
        }
      }
    }
  } catch (err) {
    console.error("Webhook handling failed", err);
  }
  // Always 200 so Meta doesn't keep retrying a message we've already processed.
  res.status(200).json({ ok: true });
};
