/* =============================================================================
   ONE MORE BAR & GRILL — Sanity Studio configuration
   -----------------------------------------------------------------------------
   ★ BEFORE THIS WILL RUN: put your real project ID on the PROJECT_ID line below.
     You get it from sanity.io/manage after creating the project. It looks like
     a short string of letters and numbers, e.g. "7f3k9d2p".

     The same ID also goes in site/assets/js/sanity-config.js so the website
     knows where to read from. Both files must match.
   ============================================================================= */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

const PROJECT_ID = "1gjbq9h5";
const DATASET = "production";

/* The two documents the owner edits. Each exists exactly once ("singletons"),
   so the Studio pins them in the sidebar instead of showing a list with a
   "create new" button — there is nothing to create, only to edit. */
const SINGLETONS = [
  { id: "specials", type: "specials", title: "Specials & Events" },
  { id: "calendar", type: "calendar", title: "Monthly Calendar" }
];

const SINGLETON_TYPES = new Set(SINGLETONS.map((s) => s.type));

export default defineConfig({
  name: "default",
  title: "One More Bar & Grill",

  projectId: PROJECT_ID,
  dataset: DATASET,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Website content")
          .items(
            SINGLETONS.map((single) =>
              S.listItem()
                .title(single.title)
                .id(single.id)
                .child(
                  S.document()
                    .schemaType(single.type)
                    .documentId(single.id)
                    .title(single.title)
                )
            )
          )
    })
  ],

  schema: {
    types: schemaTypes
  },

  document: {
    /* Singletons can be edited but not created or deleted, so the owner can't
       accidentally end up with two calendars or none. */
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({ action }) =>
            ["publish", "discardChanges", "restore"].includes(action)
          )
        : prev
  }
});
