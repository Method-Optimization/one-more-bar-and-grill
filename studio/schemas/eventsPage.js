/* =============================================================================
   SPECIAL EVENTS PAGE
   -----------------------------------------------------------------------------
   The flyers for one-off events — tribute nights, smoked meat weekends, and so
   on. Drop the flyer in, type the name and the date, and it's on the website.

   The name, date and blurb are typed separately rather than being read off the
   flyer, because words baked into a picture are invisible to Google and to a
   screen reader. The flyer is the poster; those three fields are what makes the
   event findable.
   ============================================================================= */

import { seoField, photoField } from "./objects";

export default {
  name: "eventsPage",
  title: "Special Events",
  type: "document",

  groups: [
    { name: "events", title: "Events", default: true },
    { name: "page", title: "Page wording" },
    { name: "seo", title: "Search & sharing" }
  ],

  fields: [
    {
      name: "events",
      title: "Events",
      description:
        "Newest or soonest first — they show on the page in this order. Drag to " +
        "reorder. Delete one once it's over.",
      type: "array",
      group: "events",
      of: [
        {
          type: "object",
          name: "eventFlyer",
          fields: [
            {
              name: "title",
              title: "Event name",
              description: 'For example: "4th Annual Smoked Meat Weekend"',
              type: "string",
              validation: (R) => R.required()
            },
            {
              name: "when",
              title: "When",
              description:
                'Written however you\'d say it out loud — "September 26th & 27th", ' +
                '"Every Friday in October".',
              type: "string",
              validation: (R) => R.required()
            },
            {
              name: "blurb",
              title: "What it is",
              description:
                "A sentence or two. This is what Google shows and what someone " +
                "using a screen reader hears, so it's worth writing even though " +
                "the flyer says it too.",
              type: "text",
              rows: 4
            },
            photoField(
              "flyer",
              "The flyer",
              "The poster for the event. Tall works better than wide."
            )
          ],
          preview: {
            select: { title: "title", subtitle: "when", media: "flyer.image" }
          }
        }
      ]
    },

    {
      name: "emptyMessage",
      title: "Shown when there are no events",
      description:
        "What the page says if the list above is empty — so it never looks broken " +
        "between events.",
      type: "string",
      group: "page",
      initialValue: "Nothing on the calendar just this minute. Check back soon."
    },

    {
      name: "hero",
      title: "Top of the page",
      type: "object",
      group: "page",
      fields: [
        {
          name: "script",
          title: "Handwritten line",
          type: "string",
          description: "The small script text above the heading."
        },
        { name: "title", title: "Heading", type: "string", validation: (R) => R.required() },
        { name: "sub", title: "Paragraph under the heading", type: "text", rows: 2 }
      ]
    },

    Object.assign({}, seoField, { group: "seo" })
  ],

  preview: {
    select: { events: "events" },
    prepare: ({ events }) => ({
      title: "Special Events",
      subtitle: (events || []).length + " event" + ((events || []).length === 1 ? "" : "s")
    })
  }
};
