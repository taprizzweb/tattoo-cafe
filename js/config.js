/*
 * SITE CONFIG — saari business details yahan badlo.
 * Jo bhi value "TODO" ke saath hai, woh cafe walon se confirm karni hai.
 */
window.SITE = {
  name: "The Tattoo Cafe & Lounge",
  shortName: "The Tattoo Cafe",

  // WhatsApp number — country code ke saath, bina + aur spaces ke
  whatsapp: "919828065533",
  phoneDisplay: "+91 98280 65533",
  phoneLink: "+919828065533",
  // TODO: Instagram handle
  instagram: "https://www.instagram.com/",

  address: "3rd Floor, 30, Opposite Hawa Mahal, Hawa Mahal Road, Jaipur, Rajasthan 302002",
  hours: "Open daily · 8:30 AM – 11:00 PM",

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

  // MENU — har page ki photo assets/menu/ mein daalo aur yahan path likho.
  menuPages: [],

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
    { name: "", note: "", photo: "assets/celebs/celeb-16.jpg", pos: "75% center" },
    { name: "", note: "", photo: "assets/celebs/celeb-17.jpg" },
    { name: "", note: "", photo: "assets/celebs/celeb-18.jpg" },
  ],

  // Jab tak live Google reviews (API) connect nahi hote, yeh numbers + neeche ke reviews dikhte hain
  fallbackRating: 4.2, // TODO: Google pe asli rating confirm karo
  fallbackReviewCount: 6606,

  // Asli Google reviews (cafe ke Google profile se, 5★). Jo text Google pe "More" pe katta hai, wahan "…" hai.
  featuredReviews: [
    { author: "Akileswaran Radhakrishnan", rating: 5, time: "Local Guide", text: "Fantastic venue opposite to Hawa Mahal. The food and the service was good too. The staff member Gajender Singh was too kind and went over and above to support myself and my son. Highly recommend if you are looking to get some cool shots with Hawa Mahal in the background and some good food." },
    { author: "Seema Wadhwa", rating: 5, time: "Google review", text: "The best place in Jaipur for sunset view + Hawa Mahal view. If there's one thing you should do in Jaipur it should be visiting this cafe. I cannot thank Mr. Gajendra Singh from the staff enough for his excellent hospitality, kindness and …" },
    { author: "akash dubey", rating: 5, time: "Local Guide", text: "If you're looking for a place that combines delicious food with an unforgettable view of Hawa Mahal, The Tattoo Cafe & Lounge is a must-visit! The rooftop seating offers one of the best panoramic views of the iconic Hawa …" },
    { author: "Rahul Desai", rating: 5, time: "Local Guide", text: "Excellent location with great rooftop views opposite Hawa Mahal. They also offer a drone videography service which captures you and Hawa Mahal. Most important, great food… everything we ordered was amazing. Great staff and friendly owner." },
    { author: "Hill Shah", rating: 5, time: "Local Guide", text: "It was an awesome experience of night view of Hawa Mahal with eating dinner with friends. Suman has provided good service and nice behaviour. Thanks for the awesome service and experience. Also drone video recording is available and must go places to eat and taking photos of night life." },
    { author: "Vinay Kapadia", rating: 5, time: "Local Guide", text: "One of the best cafe in this area. The main highlight is that the cafe is just opposite the Hawa Mahal so that you can enjoy the view. Specially in the night you can enjoy the food and view of …" },
    { author: "Chew KianPeng", rating: 5, time: "Local Guide", text: "Nice place for having dinner at Jaipur, rooftop view just in front of Hawa Mahal. Great place to take photos. Bro Gajendra is very helpful with the ordering. Food is fantastic!" },
    { author: "Beini Tan", rating: 5, time: "Google review", text: "I had a really lovely experience here! The view is beautiful and the atmosphere is perfect for relaxing and taking photos." },
  ],
};
