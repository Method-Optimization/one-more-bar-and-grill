/* =============================================================================
   ONE MORE BAR & GRILL — EDITABLE CONTENT
   -----------------------------------------------------------------------------
   THIS IS THE ONE FILE YOU EDIT to keep the site fresh. No coding needed —
   just change the text between the quotes. Keep the quotes, commas, and
   brackets exactly where they are.

   Rotating items (Soup of the Week, Cake of the Week, Roll of the Month) are
   the things to update most often. Search for "ROTATING" below.

   After editing: save the file and refresh the website.
   ============================================================================= */

window.OM_DATA = {

  /* ---------------------------------------------------------------------------
     BUSINESS INFO  (rarely changes)
     --------------------------------------------------------------------------- */
  business: {
    name: "One More Bar & Grill",
    tagline: "Just your local bar trying to get through the day like you.",
    addressStreet: "1375 US Route 206",
    addressLocality: "Tabernacle",
    addressRegion: "NJ",
    addressZip: "08088",
    phoneDisplay: "(609) 388-5386",
    phoneDial: "+16093885386",          // used by the "tap to call" buttons
    email: "wendyonemore@gmail.com",
    facebook: "https://www.facebook.com/onemorebarandgrillNJ",
    instagram: "https://www.instagram.com/onemore_tabernacle_nj",
    // Directions link opens Google Maps to the address:
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=1375+US+Route+206+Tabernacle+NJ+08088",
    establishedYear: 2012
  },

  /* ---------------------------------------------------------------------------
     HOURS  (drives the live "Open now / Kitchen closes at" badge)
     Times are 24-hour. Bar close after midnight is written as next-day hours.
     Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
     --------------------------------------------------------------------------- */
  hours: {
    // Bar open hours per day. "close" past 24:00 means it closes after midnight.
    bar: {
      0: { open: "11:00", close: "24:00" }, // Sun
      1: { open: "11:00", close: "24:00" }, // Mon
      2: { open: "11:00", close: "24:00" }, // Tue
      3: { open: "11:00", close: "24:00" }, // Wed
      4: { open: "11:00", close: "24:00" }, // Thu
      5: { open: "11:00", close: "26:00" }, // Fri  (26:00 = 2:00 AM)
      6: { open: "11:00", close: "26:00" }  // Sat  (26:00 = 2:00 AM)
    },
    // Full kitchen hours (the badge shows "Kitchen closes at ___").
    kitchen: {
      0: { open: "11:00", close: "21:00" }, // Sun
      1: { open: "11:00", close: "21:00" },
      2: { open: "11:00", close: "21:00" },
      3: { open: "11:00", close: "21:00" },
      4: { open: "11:00", close: "21:00" },
      5: { open: "11:00", close: "23:00" }, // Fri
      6: { open: "11:00", close: "23:00" }  // Sat
    },
    // Plain-English summary shown in the footer hours table.
    summary: [
      { label: "Sun – Thu", bar: "11am – 12am", kitchen: "11am – 9pm", late: "9pm – 11pm" },
      { label: "Fri – Sat", bar: "11am – 2am",  kitchen: "11am – 11pm", late: "11pm – 1am" }
    ]
  },

  /* ---------------------------------------------------------------------------
     CYCLING HERO LINES  (the big phrases that light up word-by-word on scroll)
     Keep them SHORT and punchy. 3–5 lines works best.
     --------------------------------------------------------------------------- */
  heroLines: [
    "Cold beer.",
    "Wings.",
    "Your local bar.",
    "Where the Jersey Devil drinks."
  ],

  /* ---------------------------------------------------------------------------
     DAILY SPECIALS  (shown in the Specials section)
     Sun=0 ... Sat=6
     --------------------------------------------------------------------------- */
  dailySpecials: [
    { day: "Sunday",    deal: "75¢ wings · $2 Coors Light draft" },
    { day: "Monday",    deal: "$10 your-choice burger & fries" },
    { day: "Tuesday",   deal: "$8 mini cheesesteak & fries (eat-in)" },
    { day: "Wednesday", deal: "4 free wings with purchase (eat-in)" },
    { day: "Thursday",  deal: "Tails — 3 for $5 (eat-in)" },
    { day: "Friday",    deal: "Personal pizza $6" },
    { day: "Saturday",  deal: "Karaoke night — come hungry" }
  ],

  /* ---------------------------------------------------------------------------
     WEEKLY ENTERTAINMENT
     --------------------------------------------------------------------------- */
  weeklyEvents: [
    { name: "Music Bingo", when: "Every Tuesday · 7–9pm" },
    { name: "Karaoke",     when: "Every Saturday · 9pm–1am" }
  ],

  /* ---------------------------------------------------------------------------
     ROTATING FEATURES  ★ UPDATE THESE OFTEN ★
     This is the stuff that keeps regulars checking back.
     --------------------------------------------------------------------------- */
  rotating: [
    { label: "Soup of the Week",        value: "Mary Ann's homemade — ask your server" },
    { label: "Cake of the Week",        value: "Aimee's homemade cake" },
    { label: "Roll of the Month",       value: "Cuban Roll" },
    { label: "Dessert Roll of the Month", value: "Strawberry Cheesecake Roll" }
  ],

  /* ---------------------------------------------------------------------------
     SIGNATURE ITEMS  (the scattered polaroid food cards)
     "img" must match a file in assets/img/
     --------------------------------------------------------------------------- */
  signatureItems: [
    { img: "tails-signature.jpg",            alt: "Three boneless chicken 'Tails' coated in glossy wing sauce on a white plate.", caption: "The Tails", note: "Boneless. The reason regulars keep coming back." },
    { img: "wings-buffalo-plate.jpg",        alt: "A heaping plate of glossy wings tossed in red-orange sauce, garnished with kale.", caption: "Wings", note: "Sauced to order." },
    { img: "gator-bites.jpg",                alt: "Golden fried Gator Bites with a creamy dipping sauce and kale garnish.", caption: "Gator Bites", note: "Order one more." },
    { img: "brownie-sundae-dessert.jpg",     alt: "A warm brownie topped with ice cream, whipped cream and chocolate drizzle.", caption: "Save Room", note: "Or don't — get it anyway." }
  ],

  /* ---------------------------------------------------------------------------
     SAUCES  (shown as a marquee strip)
     --------------------------------------------------------------------------- */
  sauces: [
    "Devil's Breath", "Hot", "Spicy", "Mild", "Garlic Parm",
    "Johnny Yaki", "Russell's Pick", "Bourbon", "Sesame Ginger", "Sweet BBQ"
  ],

  /* ---------------------------------------------------------------------------
     RATINGS  (social proof bar)
     --------------------------------------------------------------------------- */
  ratings: [
    { source: "Google",   score: "4.5", count: "812 reviews" },
    { source: "Facebook", score: "4.8", count: "96% recommend" }
  ],

  /* ---------------------------------------------------------------------------
     TESTIMONIALS  (rotate automatically)
     --------------------------------------------------------------------------- */
  testimonials: [
    { quote: "This is what a country bar should be. Cheap beer, great service, live music and pretty damn good food. The Garlic Parm Mild Wings are ridiculous.", who: "Ryan B.", where: "Medford, NJ" },
    { quote: "The coolest laid-back cozy place… They make proper drinks (not weak). The meatball roll RULED. I'll always stop here from now on.", who: "Liz F.", where: "Yelp Elite" },
    { quote: "A local Piney bar; the highest compliment! Prices, service and atmosphere are a total package.", who: "Marybeth P.", where: "Yelp" },
    { quote: "The tails and wings here are so damn good… There's no food here I can say I don't like.", who: "Blaze C.", where: "Yelp" }
  ]
};
