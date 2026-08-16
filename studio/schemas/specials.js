/* =============================================================================
   SPECIALS & EVENTS
   -----------------------------------------------------------------------------
   A singleton — there is only ever ONE of these documents. It holds the three
   lists the owner changes most often. Field names here must match the keys the
   site reads in site/assets/js/main.js (loadRemoteContent).
   ============================================================================= */

export default {
  name: "specials",
  title: "Specials & Events",
  type: "document",

  fields: [
    {
      name: "dailySpecials",
      title: "Daily specials",
      description:
        "One row per day, Sunday first. The site automatically tags whichever " +
        "one is today with a red TODAY badge.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "day",
              title: "Day",
              type: "string",
              options: {
                list: [
                  "Sunday", "Monday", "Tuesday", "Wednesday",
                  "Thursday", "Friday", "Saturday"
                ]
              },
              validation: (Rule) => Rule.required()
            },
            {
              name: "deal",
              title: "The deal",
              type: "string",
              description: 'For example: "75¢ wings · $2 Coors Light draft (eat-in)"',
              validation: (Rule) => Rule.required()
            }
          ],
          preview: {
            select: { title: "day", subtitle: "deal" }
          }
        }
      ]
    },

    {
      name: "weeklyEvents",
      title: "Weekly entertainment",
      description: "Music Bingo, Karaoke, anything else that runs every week.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Event name",
              type: "string",
              validation: (Rule) => Rule.required()
            },
            {
              name: "when",
              title: "When",
              type: "string",
              description: 'For example: "Every Tuesday · 7–9pm"',
              validation: (Rule) => Rule.required()
            }
          ],
          preview: {
            select: { title: "name", subtitle: "when" }
          }
        }
      ]
    },

    {
      name: "rotating",
      title: "Rotating features",
      description:
        "Soup of the Week, Cake of the Week, Roll of the Month — the things " +
        "that keep regulars checking back. Update these often.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              description: 'For example: "Soup of the Week"',
              validation: (Rule) => Rule.required()
            },
            {
              name: "value",
              title: "What it is this week",
              type: "string",
              validation: (Rule) => Rule.required()
            }
          ],
          preview: {
            select: { title: "label", subtitle: "value" }
          }
        }
      ]
    }
  ],

  preview: {
    prepare: () => ({ title: "Specials & Events" })
  }
};
