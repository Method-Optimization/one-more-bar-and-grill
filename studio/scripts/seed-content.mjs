/* =============================================================================
   SEED — create any documents the Studio is missing
   -----------------------------------------------------------------------------
       cd studio
       node ../build/make-seed.mjs
       npx sanity exec scripts/seed-content.mjs --with-user-token

   --with-user-token borrows the login the Sanity CLI already has, so no API
   token has to be created, pasted or stored anywhere.

   **A document that already exists is left alone.** The Studio is the source of
   truth once content lives there, and this script has no way to tell an owner's
   edit from a stale line in content.json. It is safe to re-run: it only fills
   in what is missing, which is what makes it useful when a new page is added.

   Photos are attached separately — run scripts/upload-photos.mjs afterwards.
   ============================================================================= */

import { readFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-03-11" });

const docs = JSON.parse(readFileSync(new URL("./seed-docs.json", import.meta.url), "utf8"));

let created = 0, kept = 0;

for (const doc of docs) {
  const existing = await client.getDocument(doc._id);
  if (existing) {
    console.log("kept      " + doc._id);
    kept++;
    continue;
  }
  await client.create(doc);
  console.log("created   " + doc._id);
  created++;
}

console.log("\n" + created + " created, " + kept + " already there");
if (created) console.log("Now run: npx sanity exec scripts/upload-photos.mjs --with-user-token");
