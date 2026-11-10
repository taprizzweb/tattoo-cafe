/*
 * SITE CONFIG — saari business details yahan badlo.
 * Jo bhi value "TODO" ke saath hai, woh cafe walon se confirm karni hai.
 */
window.SITE = {
  name: "The Tattoo Cafe & Lounge",
  shortName: "The Tattoo Cafe",

  // TODO: cafe ka WhatsApp number — country code ke saath, bina + aur spaces ke (e.g. 919876543210)
  whatsapp: "910000000000",
  // TODO: calling number (display ke liye)
  phoneDisplay: "+91 00000 00000",
  phoneLink: "+910000000000",
  // TODO: Instagram handle
  instagram: "https://www.instagram.com/",

  address: "3rd Floor, 30, Opposite Hawa Mahal, Hawa Mahal Road, Jaipur, Rajasthan 302002",
  hours: "Open daily · 7:00 AM – 11:00 PM", // TODO: confirm

  mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Tattoo+Cafe+%26+Lounge+Hawa+Mahal+Road+Jaipur",
  mapsEmbed: "https://maps.google.com/maps?q=The%20Tattoo%20Cafe%20%26%20Lounge%2C%20Hawa%20Mahal%20Road%2C%20Jaipur&z=17&output=embed",

  // Google Place ID milte hi yahan daalo — "Write a review" button seedha review box kholega
  googlePlaceId: "",

  // WhatsApp pe jaane wale pehle se likhe messages (button ke hisaab se).
  // Har message ki shuruaat alag hai, taaki WhatsApp Business ke auto-reply / chatbot
  // keyword se pehchaan sake ki enquiry kis cheez ki hai.
  waMessages: {
    tattoo: "Hi! I'm interested in getting a tattoo at The Tattoo Cafe.\n\nMy idea: \nSize / placement: \nPreferred date: ",
    hawamahal: "Hi! I'd like a Hawa Mahal tattoo at The Tattoo Cafe.\n\nSize / placement: \nPreferred date: ",
    table: "Hi! I'd like to reserve a rooftop table facing Hawa Mahal.\n\nDate: \nTime: \nNumber of guests: ",
    general: "Hi! I have a question about The Tattoo Cafe & Lounge.",
  },

  // CELEBRITY FILM ROLL — har celebrity ki photo assets/celebs/ mein daalo aur yahan naam + path likho.
  // photo khaali ho toh placeholder frame dikhega.
  // TODO: har photo ke saath celebrity ka naam likho (name) aur chaho toh note (e.g. "Actor").
  // name khaali ho toh frame pe caption nahi dikhega. pos = photo ka kaunsa hissa frame mein dikhe (optional).
  celebrities: [
    { name: "", note: "", photo: "assets/celebs/celeb-2.jpg" },
    { name: "", note: "", photo: "assets/celebs/celeb-6.jpg", pos: "center 90%" },
    { name: "", note: "", photo: "assets/celebs/celeb-3.jpg" },
    { name: "", note: "", photo: "assets/celebs/celeb-9.jpg", pos: "center 60%" },
    { name: "", note: "", photo: "assets/celebs/celeb-1.jpg" },
    { name: "", note: "", photo: "assets/celebs/celeb-10.jpg" },
    { name: "", note: "", photo: "assets/celebs/celeb-4.jpg" },
    { name: "", note: "", photo: "assets/celebs/celeb-8.jpg" },
    { name: "", note: "", photo: "assets/celebs/celeb-7.jpg" },
    { name: "", note: "", photo: "assets/celebs/celeb-5.jpg" },
    { name: "", note: "", photo: "assets/celebs/celeb-12.jpg" },
    { name: "", note: "", photo: "assets/celebs/celeb-14.jpg" },
    { name: "", note: "", photo: "assets/celebs/celeb-11.jpg", pos: "78% center" },
    { name: "", note: "", photo: "assets/celebs/celeb-15.jpg" },
    { name: "", note: "", photo: "assets/celebs/celeb-13.jpg" },
  ],

  // Jab tak live Google reviews connect nahi hote, yeh numbers dikhte hain (TODO: verify)
  fallbackRating: 4.2,
  fallbackReviewCount: 5990,
};
