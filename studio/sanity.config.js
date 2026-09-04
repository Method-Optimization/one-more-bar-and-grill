/* =============================================================================
   ONE MORE BAR & GRILL — Sanity Studio configuration
   -----------------------------------------------------------------------------
   The sidebar is arranged the way the owner thinks about the site: the things
   that change weekly at the top, the things that almost never change at the
   bottom.

   Publishing here does not change the live site on its own. A publish fires a
   webhook that rebuilds and redeploys it — see build/README.md.
   ============================================================================= */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

const PROJECT_ID = "1gjbq9h5";
const DATASET = "production";

/* Documents that exist exactly once. The Studio pins them in the sidebar
   instead of showing a list with a "create new" button — there is nothing to
   create, only to edit. */
const SINGLETONS = [
  { id: "specials", type: "specials", title: "Specials & Events" },
  { id: "calendar", type: "calendar", title: "Monthly Calendar" },
  { id: "homePage", type: "homePage", title: "Home Page" },
  { id: "menuPage", type: "menuPage", title: "Menu Page" },
  { id: "eventsPage", type: "eventsPage", title: "Special Events" },
  { id: "calendarPage", type: "calendarPage", title: "Calendar Page" },
  { id: "siteSettings", type: "siteSettings", title: "Business Info & Hours" }
];

const SINGLETON_TYPES = new Set(SINGLETONS.map((s) => s.type));

const single = (S, id) => {
  const def = SINGLETONS.filter((s) => s.id === id)[0];
  return S.listItem()
    .title(def.title)
    .id(def.id)
    .child(S.document().schemaType(def.type).documentId(def.id).title(def.title));
};

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
          .items([
            single(S, "specials"),
            single(S, "calendar"),
            S.divider(),
            single(S, "homePage"),
            single(S, "menuPage"),
            S.listItem()
              .title("Menu Sections")
              .id("menuSections")
              .child(
                S.documentTypeList("menuCategory")
                  .title("Menu Sections")
                  .defaultOrdering([{ field: "order", direction: "asc" }])
              ),
            S.divider(),
            single(S, "eventsPage"),
            single(S, "calendarPage"),
            S.divider(),
            single(S, "siteSettings")
          ])
    })
  ],

  schema: {
    types: schemaTypes
  },

  document: {
    /* Singletons can be edited but not created or deleted, so the owner can't
       accidentally end up with two home pages or none. */
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({ action }) =>
            ["publish", "discardChanges", "restore"].includes(action)
          )
        : prev
  }
});
