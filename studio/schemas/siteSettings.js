/* =============================================================================
   SITE SETTINGS
   -----------------------------------------------------------------------------
   The things that appear on every page: address, phone, hours, the menu bar,
   and the footer. Changing the phone number here changes it in the nav button,
   the footer, the tap-to-call links and the Google listing markup all at once.
   ============================================================================= */

const TIME_HELP =
  'Use 24-hour time, e.g. "11:00" for 11am and "21:00" for 9pm. ' +
  'For a closing time after midnight keep counting: "24:00" is midnight and ' +
  '"26:00" is 2am.';

const timeRule = (Rule) =>
  Rule.required().regex(/^\d{1,2}:\d{2}$/, { name: "24-hour time like 11:00" });

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default {
  name: "siteSettings",
  title: "Business Info & Hours",
  type: "document",

  groups: [
    { name: "business", title: "Business", default: true },
    { name: "hours", title: "Hours" },
    { name: "nav", title: "Menu bar" },
    { name: "footer", title: "Footer" }
  ],

  fields: [
    /* ---------------------------------------------------------------- business */
    {
      name: "business",
      title: "Business details",
      type: "object",
      group: "business",
      fields: [
        { name: "name", title: "Business name", type: "string", validation: (R) => R.required() },
        { name: "tagline", title: "Tagline", type: "string" },
        { name: "addressStreet", title: "Street address", type: "string", validation: (R) => R.required() },
        { name: "addressLocality", title: "Town", type: "string", validation: (R) => R.required() },
        { name: "addressRegion", title: "State", type: "string", validation: (R) => R.required() },
        { name: "addressZip", title: "ZIP", type: "string", validation: (R) => R.required() },
        {
          name: "phoneDisplay",
          title: "Phone — as written on the page",
          description: 'For example: "(609) 388-5386"',
          type: "string",
          validation: (R) => R.required()
        },
        {
          name: "phoneDial",
          title: "Phone — as dialled",
          description:
            'What a phone actually calls when someone taps the number. Digits ' +
            'only with the country code, e.g. "+16093885386".',
          type: "string",
          validation: (R) => R.required().regex(/^\+\d{10,15}$/, { name: "e.g. +16093885386" })
        },
        { name: "email", title: "Email", type: "string", validation: (R) => R.required().email() },
        { name: "facebook", title: "Facebook page URL", type: "url" },
        { name: "instagram", title: "Instagram profile URL", type: "url" },
        {
          name: "directionsUrl",
          title: "Google Maps directions link",
          description: 'The link behind "Get directions →".',
          type: "url"
        },
        {
          name: "siteUrl",
          title: "Website address",
          description: "Used in the Google listing markup.",
          type: "url"
        },
        { name: "establishedYear", title: "Year established", type: "number" }
      ]
    },

    /* ------------------------------------------------------------------- hours */
    {
      name: "hours",
      title: "Opening hours",
      description:
        'These drive the live "Open now / Kitchen closes at" badge on the home ' +
        "page and the Google listing. " + TIME_HELP,
      type: "array",
      group: "hours",
      validation: (Rule) => Rule.length(7).error("All seven days are required."),
      of: [
        {
          type: "object",
          name: "dayHours",
          fields: [
            {
              name: "day",
              title: "Day",
              type: "string",
              options: { list: DAYS },
              validation: (R) => R.required()
            },
            { name: "barOpen", title: "Bar opens", type: "string", validation: timeRule },
            { name: "barClose", title: "Bar closes", type: "string", validation: timeRule },
            { name: "kitchenOpen", title: "Kitchen opens", type: "string", validation: timeRule },
            { name: "kitchenClose", title: "Kitchen closes", type: "string", validation: timeRule }
          ],
          preview: {
            select: { title: "day", bo: "barOpen", bc: "barClose", ko: "kitchenOpen", kc: "kitchenClose" },
            prepare: ({ title, bo, bc, ko, kc }) => ({
              title: title,
              subtitle: "Bar " + bo + "–" + bc + "  ·  Kitchen " + ko + "–" + kc
            })
          }
        }
      ]
    },

    {
      name: "hoursSummary",
      title: "Hours as written in the footer",
      description:
        "The plain-English version shown in the footer table. Two or three rows " +
        "is plenty.",
      type: "array",
      group: "hours",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Days", type: "string", description: 'e.g. "Sun – Thu"' },
            { name: "bar", title: "Bar", type: "string", description: 'e.g. "11am – 12am"' },
            { name: "kitchen", title: "Kitchen", type: "string", description: 'e.g. "11am – 9pm"' },
            { name: "late", title: "Late night", type: "string", description: 'e.g. "9pm – 11pm"' }
          ],
          preview: {
            select: { title: "label", subtitle: "bar" }
          }
        }
      ]
    },

    /* --------------------------------------------------------------------- nav */
    {
      name: "chrome",
      title: "Menu bar",
      type: "object",
      group: "nav",
      fields: [
        {
          name: "navLinks",
          title: "Links across the top",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "label", title: "Label", type: "string", validation: (R) => R.required() },
                {
                  name: "href",
                  title: "Goes to",
                  description:
                    'A page ("menu.html", "calendar.html") or a spot on the home ' +
                    'page ("#specials", "#story", "#find-us").',
                  type: "string",
                  validation: (R) => R.required()
                }
              ],
              preview: { select: { title: "label", subtitle: "href" } }
            }
          ]
        },
        {
          name: "callLabel",
          title: "Call button text",
          description: 'The phone number is added automatically. e.g. "Call for Takeout"',
          type: "string"
        }
      ]
    },

    /* ------------------------------------------------------------------ footer */
    {
      name: "footer",
      title: "Footer",
      type: "object",
      group: "footer",
      fields: [
        { name: "smsHeading", title: "Text-club heading", type: "string" },
        {
          name: "smsKeyword",
          title: "Text-club keyword",
          description: 'The word customers text in, e.g. "onemore".',
          type: "string"
        },
        {
          name: "smsDial",
          title: "Text-club number — as dialled",
          type: "string",
          validation: (R) => R.regex(/^\+\d{10,15}$/, { name: "e.g. +18334402766" }).warning()
        },
        { name: "smsDisplay", title: "Text-club number — as written", type: "string" },
        { name: "hoursHeading", title: 'Hours column heading', type: "string" },
        { name: "hoursNote", title: "Line under the hours table", type: "string" },
        { name: "findHeading", title: "Address column heading", type: "string" },
        { name: "directionsLabel", title: "Directions link text", type: "string" },
        {
          name: "devilLine",
          title: "The line in the very bottom bar",
          description: 'Currently "Where the Jersey Devil drinks 🍺".',
          type: "string"
        }
      ]
    }
  ],

  preview: {
    prepare: () => ({ title: "Business Info & Hours" })
  }
};
