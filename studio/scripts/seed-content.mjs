/* =============================================================================
   SEED — push the site's existing content into Sanity
   -----------------------------------------------------------------------------
   Run once, when the Studio is first set up, to fill it with everything the
   site already says. After that the Studio is the source of truth and this
   script has no reason to run again.

       cd studio
       node ../build/make-seed.mjs
       npx sanity exec scripts/seed-content.mjs --with-user-token

   --with-user-token borrows the login the Sanity CLI already has, so no API
   token has to be created, pasted or stored anywhere.

   "Specials & Events" and "Monthly Calendar" are left alone if they already
   exist: the owner has been editing those since before the rest of the site
   moved in, and their versions are newer than the ones in the repo.
   ============================================================================= */

import { readFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-03-11" });

const docs = JSON.parse(readFileSync(new URL("./seed-docs.json", import.meta.url), "utf8"));

const PRESERVE = new Set(["specials", "calendar"]);

let created = 0, replaced = 0, kept = 0;

for (const doc of docs) {
  if (PRESERVE.has(doc._id)) {
    const existing = await client.getDocument(doc._id);
    if (existing) {
      console.log("kept      " + doc._id + "  (already edited in the Studio)");
      kept++;
      continue;
    }
    await client.createIfNotExists(doc);
    console.log("created   " + doc._id);
    created++;
    continue;
  }

  const existing = await client.getDocument(doc._id);
  await client.createOrReplace(doc);
  console.log((existing ? "replaced  " : "created   ") + doc._id);
  if (existing) replaced++; else created++;
}

console.log("\n" + created + " created, " + replaced + " replaced, " + kept + " left alone");
