/* =============================================================================
   MONTHLY CALENDAR
   -----------------------------------------------------------------------------
   A singleton holding the one image shown on calendar.html. Replacing the image
   here is the whole monthly job — no filename convention, no image dimensions to
   update. Sanity serves the new file from its CDN and the site picks it up.
   ============================================================================= */

export default {
  name: "calendar",
  title: "Monthly Calendar",
  type: "document",

  fields: [
    {
      name: "image",
      title: "Calendar image",
      description:
        "Drop this month's calendar here. Replacing it is all you need to do — " +
        "the website updates on its own.",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required()
    },
    {
      name: "alt",
      title: "Image description",
      description:
        "A plain sentence describing the image, for screen readers and Google. " +
        'For example: "August 2026 events and specials calendar for One More Bar and Grill."',
      type: "string",
      validation: (Rule) => Rule.required().max(160)
    },
    {
      name: "note",
      title: "Line underneath the image",
      description: "Small text shown below the calendar. Leave as-is if unsure.",
      type: "string",
      initialValue:
        "Updated monthly — check back or follow us on Facebook & Instagram for the latest."
    }
  ],

  preview: {
    select: { media: "image", subtitle: "alt" },
    prepare: ({ media, subtitle }) => ({
      title: "Monthly Calendar",
      subtitle,
      media
    })
  }
};
