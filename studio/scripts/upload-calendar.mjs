/* =============================================================================
   One-off: upload the current calendar image and create the calendar document.

   Run from the studio folder:
     npx sanity exec scripts/upload-calendar.mjs --with-user-token

   --with-user-token hands the script an authenticated client using your
   existing CLI login, so no API token needs to be created or pasted anywhere.

   Safe to re-run: it replaces the "calendar" document rather than adding a
   second one. Re-running with a new image is a valid way to change months from
   the command line, though the Studio is the intended route for that.
   ============================================================================= */

import { getCliClient } from "sanity/cli";
import { readFileSync } from "node:fs";
import { basename } from "node:path";

const IMAGE = process.argv[2] || "../site/assets/img/aug-calendar-2026.jpg";
const ALT =
  process.argv[3] ||
  "August 2026 events and specials calendar for One More Bar and Grill.";
const NOTE =
  "Updated monthly — check back or follow us on Facebook & Instagram for the latest.";

const client = getCliClient({ apiVersion: "2024-03-11" });

const file = readFileSync(IMAGE);
console.log(`Uploading ${basename(IMAGE)} (${Math.round(file.length / 1024)} KB)…`);

const asset = await client.assets.upload("image", file, {
  filename: basename(IMAGE)
});

console.log(`  asset:  ${asset._id}`);
console.log(`  size:   ${asset.metadata.dimensions.width}x${asset.metadata.dimensions.height}`);

const doc = await client.createOrReplace({
  _id: "calendar",
  _type: "calendar",
  image: {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id }
  },
  alt: ALT,
  note: NOTE
});

console.log(`\nPublished document "${doc._id}" (rev ${doc._rev}).`);
console.log("The calendar page will pick this up on the next load.");
