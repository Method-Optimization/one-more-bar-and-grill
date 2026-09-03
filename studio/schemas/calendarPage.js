/* =============================================================================
   CALENDAR PAGE
   -----------------------------------------------------------------------------
   The wording at the top of the calendar page. The image itself is under
   "Monthly Calendar".
   ============================================================================= */

import { seoField } from "./objects";

export default {
  name: "calendarPage",
  title: "Calendar Page",
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
          description: 'The small script text above the heading.'
        },
        { name: "title", title: "Heading", type: "string", validation: (R) => R.required() },
        { name: "sub", title: "Paragraph under the heading", type: "text", rows: 2 }
      ]
    }
  ],

  preview: { prepare: () => ({ title: "Calendar Page" }) }
};
