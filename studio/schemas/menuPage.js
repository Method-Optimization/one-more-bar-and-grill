/* =============================================================================
   MENU PAGE
   -----------------------------------------------------------------------------
   The wording at the top of the menu page. The menu itself lives in the
   "Menu Sections" list.
   ============================================================================= */

import { seoField } from "./objects";

export default {
  name: "menuPage",
  title: "Menu Page",
  type: "document",

  fields: [
    seoField,
    {
      name: "hero",
      title: "Top of the page",
      type: "object",
      fields: [
        {
          name: "script",
          title: "Handwritten line",
          type: "string",
          description: 'The small script text above the heading, e.g. "come hungry".'
        },
        { name: "title", title: "Heading", type: "string", validation: (R) => R.required() },
        { name: "sub", title: "Paragraph under the heading", type: "text", rows: 3 },
        {
          name: "ctaLabel",
          title: "Call button text",
          description: 'The phone number is added automatically. e.g. "Call to Order"',
          type: "string"
        },
        {
          name: "note",
          title: "Small print under the button",
          type: "string"
        }
      ]
    }
  ],

  preview: { prepare: () => ({ title: "Menu Page" }) }
};
