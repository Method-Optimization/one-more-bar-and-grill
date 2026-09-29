/* =============================================================================
   RENAME MENU IDS — one-time fix, run 2026-09-29
   -----------------------------------------------------------------------------
   The 17 menu sections were created as "menuCategory.<anchor>". Sanity treats
   any document id containing a dot as private: the public API — which is what
   the build reads — never returns it. So every price edited in Menu Sections
   was invisible to the build, and the site kept rendering the saved snapshot.

   This copies each one to "menuCategory-<anchor>" and deletes the original, in
   one transaction per section so there is never a moment with neither or both.
   Drafts are carried across the same way.

       npx sanity exec scripts/rename-menu-ids.mjs --with-user-token
   ============================================================================= */

import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-03-11" });

const docs = await client.fetch(
  '*[_type == "menuCategory" && (_id match "menuCategory.*" || _id match "drafts.menuCategory.*")]'
);

let moved = 0;
for (const doc of docs) {
  const isDraft = doc._id.startsWith("drafts.");
  const bare = isDraft ? doc._id.slice("drafts.".length) : doc._id;
  if (bare.indexOf("menuCategory.") !== 0) continue;
  const newBare = "menuCategory-" + bare.slice("menuCategory.".length);
  const newId = (isDraft ? "drafts." : "") + newBare;

  const copy = Object.assign({}, doc, { _id: newId });
  delete copy._rev;
  delete copy._createdAt;
  delete copy._updatedAt;

  await client.transaction().createOrReplace(copy).delete(doc._id).commit();
  console.log("moved  " + doc._id + "  ->  " + newId);
  moved++;
}
console.log("\n" + moved + " document(s) moved");
