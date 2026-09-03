/* =============================================================================
   SHARED FIELD SHAPES
   -----------------------------------------------------------------------------
   Small building blocks reused across the documents. Keeping them here means a
   label or a help note is written once and reads the same everywhere in the
   Studio.
   ============================================================================= */

export const seoField = {
  name: "seo",
  title: "Search & sharing",
  description:
    "What Google shows in search results and what Facebook shows when someone " +
    "shares a link. Safe to leave alone.",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    {
      name: "title",
      title: "Browser tab / Google headline",
      type: "string",
      validation: (Rule) => Rule.required().max(70)
    },
    {
      name: "description",
      title: "Google description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(300)
    },
    { name: "ogTitle", title: "Title when shared on social", type: "string" },
    { name: "ogDescription", title: "Description when shared on social", type: "text", rows: 2 },
    { name: "ogType", title: "Social card type", type: "string", readOnly: true, hidden: true }
  ]
};

/* The handwritten line plus the heading that opens most sections. Callers
   .concat() whatever extra fields that particular section needs. */
export const sectionHead = () => ({
  fields: [
    {
      name: "script",
      title: "Handwritten line above the heading",
      type: "string",
      description: 'The small script text, e.g. "come hungry".'
    },
    { name: "title", title: "Heading", type: "string" }
  ]
});

/* A photo the owner can replace. Uploading here beats swapping a file in the
   repo: Sanity serves it, sizes it, and hands the build the real dimensions. */
export const photoField = (name, title, description) => ({
  name: name,
  title: title,
  description: description,
  type: "object",
  fields: [
    {
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true }
    },
    {
      name: "alt",
      title: "Photo description",
      description: "One plain sentence describing the photo, for screen readers and Google.",
      type: "string",
      validation: (Rule) => Rule.max(200)
    },
    {
      name: "fallback",
      title: "Built-in photo filename",
      description:
        "Used only if no photo is uploaded above. This is a file that ships with " +
        "the site — leave it alone unless a developer asks you to change it.",
      type: "string",
      readOnly: true
    },
    /* Kept so the page can reserve the right-shaped box before the image loads.
       Sanity supplies these itself for an uploaded photo; for the built-in one
       they have to be carried along. */
    { name: "fallbackWidth", type: "number", hidden: true },
    { name: "fallbackHeight", type: "number", hidden: true }
  ]
});
