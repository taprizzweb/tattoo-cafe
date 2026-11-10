/*
 * WhatsApp bot ka "dimaag" — ek hi file jo website demo (browser) aur asli bot (server) dono use karte hain.
 * Jawab, buttons aur FAQ yahan badlo; dono jagah apne aap update ho jaayega.
 */
(function (root) {
  "use strict";

  var INFO = {
    name: "The Tattoo Cafe & Lounge",
    hours: "Open every day, 8:30 AM – 11:00 PM",
    address: "3rd Floor, 30, Opposite Hawa Mahal, Hawa Mahal Road, Jaipur 302002",
    maps: "https://www.google.com/maps/search/?api=1&query=The+Tattoo+Cafe+%26+Lounge+Hawa+Mahal+Road+Jaipur",
    site: "https://thetattoocafe-jaipur.vercel.app",
  };

  // Buttons: WhatsApp allows max 3 reply buttons, 20 characters each.
  var MAIN_BUTTONS = [
    { id: "visit", title: "🏛️ Cafe visit" },
    { id: "tattoo", title: "✒️ Tattoo" },
    { id: "table", title: "🍽️ Table / Menu" },
  ];

  var FLOW = {
    info: INFO,

    greeting: {
      text:
        "Namaste! 🙏 Welcome to *The Tattoo Cafe & Lounge*, right opposite Hawa Mahal, Jaipur.\n\n" +
        "What would you like to know about?",
      buttons: MAIN_BUTTONS,
    },

    visit: {
      text:
        "🏛️ *Visiting us*\n\n" +
        "🕗 " + INFO.hours + "\n" +
        "📍 " + INFO.address + "\n" +
        "🌅 Best time: sunset, around 5–7 PM, when Hawa Mahal glows from our rooftop.\n" +
        "🎟️ A cover charge applies for entry. Our team can share today's amount.\n\n" +
        "Directions: " + INFO.maps,
      buttons: [
        { id: "table", title: "🍽️ Book a table" },
        { id: "tattoo", title: "✒️ Tattoo" },
        { id: "human", title: "💬 Talk to team" },
      ],
    },

    menu: {
      text: "🍽️ Here's our menu: tandoori starters, North Indian curries, vegan pizzas, smoothie bowls and 20+ shakes.",
      images: [
        "assets/menu/menu-1.jpg",
        "assets/menu/menu-3.jpg",
        "assets/menu/menu-2.jpg",
        "assets/menu/menu-4.jpg",
        "assets/menu/menu-5.jpg",
      ],
    },

    // Multi-step questions. Each step saves the answer under `key`.
    tattooSteps: [
      { key: "idea", ask: "✒️ Lovely! Tell us your tattoo idea. You can also send a reference photo." },
      { key: "placement", ask: "Where on the body, and roughly how big? (e.g. inner wrist, 2 inch)" },
      { key: "date", ask: "When would you like to come in? (date, or \"flexible\")" },
    ],
    tattooDone:
      "✅ Thank you! Our artist has your idea and will reply here with a design and a time slot.\n\n" +
      "Walk-ins are welcome too. " + INFO.hours + ".",

    tableSteps: [
      { key: "date", ask: "🍽️ Which date would you like a table for?", chips: ["Today", "Tomorrow", "This weekend"] },
      { key: "time", ask: "What time?", chips: ["Breakfast", "Lunch", "Sunset 5–7 PM", "Dinner"] },
      { key: "guests", ask: "How many guests?", chips: ["2", "3–4", "5+"] },
    ],
    tableDone: function (a) {
      return (
        "✅ Request received!\n\n📅 " + a.date + "\n🕗 " + a.time + "\n👥 " + a.guests + " guests\n\n" +
        "Our team will confirm your table here shortly. A cover charge applies for entry."
      );
    },

    human:
      "💬 No problem, I've passed this chat to our team. Someone will reply here soon.",

    unknown:
      "I'm not sure about that one, so I've asked our team. They'll reply here soon. 🙏\n\nMeanwhile, you can pick an option:",

    // Simple answers used when the AI is not connected (and in the website demo).
    faq: [
      { k: ["time", "timing", "open", "close", "hours", "kab", "khula", "band"], a: "🕗 " + INFO.hours + "." },
      { k: ["where", "location", "address", "kahan", "kaha", "direction", "map"], a: "📍 " + INFO.address + "\n\nDirections: " + INFO.maps },
      { k: ["cover", "entry", "charge", "fee", "ticket"], a: "🎟️ A cover charge applies for entry to the café and rooftop. Our team will share today's amount here." },
      { k: ["vegan", "veg", "jain", "non veg", "nonveg", "chicken"], a: "🌱 We're a vegetarian café with lots of vegan options: vegan pizzas, burgers, thalis and smoothie bowls. Our tofu comes from Auroville, and we use no MSG or artificial colours." },
      { k: ["pain", "hurt", "dard"], a: "Most guests describe it as a scratching feeling. Small pieces take only a few minutes, and you can take breaks any time." },
      { k: ["safe", "hygiene", "needle", "clean"], a: "🧼 Every session uses sterile, single-use needles opened in front of you, fresh gloves and a sanitised station." },
      { k: ["aftercare", "heal", "care"], a: "Keep it clean, apply a thin layer of balm, and avoid swimming, direct sun and scratching for two weeks. You'll get a printed guide after your session." },
      { k: ["walk in", "walkin", "walk-in", "same day", "today"], a: "Walk-ins are welcome when an artist is free. Message your idea here first to be sure of a slot." },
      { k: ["pay", "upi", "card", "cash"], a: "💳 We accept cash, UPI and cards, including international cards." },
      { k: ["age", "18", "minor"], a: "You need to be 18 or older with a valid photo ID for a tattoo." },
      { k: ["price", "cost", "rate", "kitna", "how much"], a: "Tattoo prices depend on size and detail. Share your idea and our artist will give you a free quote. 😊" },
      { k: ["drone", "video", "photo"], a: "📸 Our rooftop is the best photo spot for Hawa Mahal. Ask our team about drone videos when you visit." },
    ],

    // Words that mean "start over / show the menu".
    greetWords: ["hi", "hii", "hello", "hey", "namaste", "hlo", "information", "info", "start"],
    menuWords: ["menu", "food", "khana", "drinks", "drink", "shake", "shakes"],
    humanWords: ["human", "person", "staff", "call me", "talk to", "agent", "owner", "manager", "real person"],
  };

  // Very small matcher: returns the first FAQ answer whose keyword appears in the text.
  FLOW.matchFaq = function (text) {
    var t = " " + String(text || "").toLowerCase().replace(/[^a-z0-9ऀ-ॿ\s-]/g, " ") + " ";
    for (var i = 0; i < FLOW.faq.length; i++) {
      for (var j = 0; j < FLOW.faq[i].k.length; j++) {
        if (t.indexOf(" " + FLOW.faq[i].k[j]) !== -1) return FLOW.faq[i].a;
      }
    }
    return null;
  };
  // Whole-word / whole-phrase match, so "hi" does not fire on "which".
  FLOW.isAny = function (text, words) {
    var t = " " + String(text || "").toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g, " ") + " ";
    return words.some(function (w) { return t.indexOf(" " + w + " ") !== -1; });
  };
  FLOW.ownerAlert = function (kind, from, a) {
    if (kind === "human") return "🙋 *Customer wants to talk to the team*\n👤 " + from.name + " · " + from.phone;
    if (kind === "tattoo") {
      return "🔔 *New tattoo lead*\n👤 " + from.name + " · " + from.phone + "\n💡 " + a.idea + "\n📍 " + a.placement + "\n📅 " + a.date;
    }
    return "🔔 *New table request*\n👤 " + from.name + " · " + from.phone + "\n📅 " + a.date + " · " + a.time + "\n👥 " + a.guests + " guests";
  };

  /*
   * Conversation engine. Pure function, no I/O:
   *   FLOW.step(state, input) -> { state, replies, alert, needAI }
   * input  = { type: "text" | "button" | "image", value }
   * replies = [{ text, buttons?, chips?, images? }]
   * alert   = { kind: "tattoo"|"table"|"human", answers } for the owner, or null
   * needAI  = true when no rule matched; the caller may ask the AI, else send FLOW.unknown
   */
  FLOW.step = function (state, input) {
    state = state || {};
    var out = { state: state, replies: [], alert: null, needAI: false };
    var val = String(input.value || "").trim();
    var say = function (r) { out.replies.push(typeof r === "string" ? { text: r } : r); };
    var mainMenu = function (text) { say({ text: text, buttons: MAIN_BUTTONS }); };

    var startFlow = function (name) {
      state.flow = name; state.i = 0; state.answers = {};
      var first = (name === "tattoo" ? FLOW.tattooSteps : FLOW.tableSteps)[0];
      say({ text: first.ask, chips: first.chips });
    };

    var choose = function (id) {
      state.flow = null;
      if (id === "visit") return say(FLOW.visit);
      if (id === "tattoo") return startFlow("tattoo");
      if (id === "table") {
        say({ text: FLOW.menu.text, images: FLOW.menu.images });
        return startFlow("table");
      }
      if (id === "menu") return say({ text: FLOW.menu.text, images: FLOW.menu.images, buttons: [{ id: "table", title: "🍽️ Book a table" }] });
      if (id === "human") { out.alert = { kind: "human", answers: {} }; return say(FLOW.human); }
      return mainMenu(FLOW.greeting.text);
    };

    if (input.type === "button") { choose(val); return out; }

    // Inside a multi-step question: save the answer and ask the next one.
    if (state.flow) {
      if (FLOW.isAny(val, FLOW.humanWords)) { choose("human"); return out; }
      var steps = state.flow === "tattoo" ? FLOW.tattooSteps : FLOW.tableSteps;
      state.answers[steps[state.i].key] = input.type === "image" ? "(reference photo sent)" + (val ? " " + val : "") : val;
      state.i += 1;
      if (state.i < steps.length) {
        say({ text: steps[state.i].ask, chips: steps[state.i].chips });
      } else {
        var kind = state.flow, a = state.answers;
        state.flow = null;
        say(kind === "tattoo" ? FLOW.tattooDone : FLOW.tableDone(a));
        out.alert = { kind: kind, answers: a };
      }
      return out;
    }

    if (input.type === "image") { startFlow("tattoo"); state.answers.idea = "(reference photo sent)"; state.i = 1; out.replies = []; say("✒️ Nice reference! " + FLOW.tattooSteps[1].ask); return out; }
    if (!state.greeted || FLOW.isAny(val, FLOW.greetWords) && val.length < 60) { state.greeted = true; mainMenu(FLOW.greeting.text); return out; }
    if (FLOW.isAny(val, FLOW.humanWords)) { choose("human"); return out; }
    if (FLOW.isAny(val, FLOW.menuWords)) { choose("menu"); return out; }
    if (/\b(tattoos?|tatoo|tattu|ink)\b/i.test(val)) { startFlow("tattoo"); return out; }
    if (/\b(table|book|booking|reserve|reservation|seat)\b/i.test(val)) { choose("table"); return out; }
    var hit = FLOW.matchFaq(val);
    if (hit) { say({ text: hit, buttons: MAIN_BUTTONS }); return out; }
    out.needAI = true;
    return out;
  };

  if (typeof module !== "undefined" && module.exports) module.exports = FLOW;
  else root.BOT_FLOW = FLOW;
})(this);
