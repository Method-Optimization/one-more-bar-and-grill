/* =============================================================================
   UPLOAD PHOTOS — put the site's built-in images into the Studio
   -----------------------------------------------------------------------------
       cd studio
       npx sanity exec scripts/upload-photos.mjs --with-user-token

   Every photo field in the Studio has a hidden "built-in filename" the site
   falls back to. Until the real file is uploaded, the owner opens the field and
   sees an empty upload box — with no way to tell what is currently on the page
   or what they are about to replace.

   This walks every photo field, and wherever one has a filename but no uploaded
   image, uploads site/assets/img/<filename> and attaches it. Fields that
   already have an image are left alone, so it is safe to re-run.
   ============================================================================= */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { basename, join } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-03-11" });
const IMG_DIR = fileURLToPath(new URL("../../site/assets/img/", import.meta.url));

/* Where the photo objects live: document id -> the array field holding them,
   and the field name of the photo object inside each row. */
const TARGETS = [
  { id: "homePage", array: "stackCards", photo: "photo" },
  { id: "homePage", array: "signatureItems", photo: "photo" },
  { id: "eventsPage", array: "events", photo: "flyer" }
];

/* One upload per file, however many fields point at it. */
const uploaded = new Map();

async function assetFor(filename) {
  if (uploaded.has(filename)) return uploaded.get(filename);

  const path = join(IMG_DIR, filename);
  if (!existsSync(path)) {
    console.warn("  missing file, skipped: " + filename);
    uploaded.set(filename, null);
    return null;
  }

  const asset = await client.assets.upload("image", readFileSync(path), {
    filename: basename(filename)
  });
  console.log("  uploaded " + filename + "  ->  " + asset._id);
  uploaded.set(filename, asset._id);
  return asset._id;
}

let attached = 0, already = 0;

for (const t of TARGETS) {
  const doc = await client.getDocument(t.id);
  if (!doc) {
    console.log(t.id + ": not in the Studio yet, skipped");
    continue;
  }

  const rows = doc[t.array] || [];
  console.log(t.id + "." + t.array + "  (" + rows.length + " rows)");

  for (const row of rows) {
    const photo = row[t.photo];
    if (!photo || !photo.fallback) continue;
    if (photo.image && photo.image.asset) { already++; continue; }

    const assetId = await assetFor(photo.fallback);
    if (!assetId) continue;

    // Addressed by _key so the patch survives the rows being reordered.
    await client
      .patch(t.id)
      .set({
        [t.array + '[_key=="' + row._key + '"].' + t.photo + ".image"]: {
          _type: "image",
          asset: { _type: "reference", _ref: assetId }
        }
      })
      .commit();
    attached++;
  }
}

console.log("\n" + attached + " photo field(s) filled in, " + already + " already had an image");
