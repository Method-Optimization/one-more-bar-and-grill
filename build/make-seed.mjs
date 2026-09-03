/* =============================================================================
   MAKE-SEED — content.json  ->  studio/scripts/seed-docs.json
   -----------------------------------------------------------------------------
   Written as a separate step so the Studio's seed script only has to read a
   plain JSON file, and never has to import anything from outside its own
   directory (which the Studio's bundler would have to be talked into).
   ============================================================================= */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./lib.mjs";
import { toSanity } from "./sanity.mjs";

const content = JSON.parse(readFileSync(join(ROOT, "content.json"), "utf8"));
const docs = toSanity(content);
const out = join(ROOT, "studio/scripts/seed-docs.json");

writeFileSync(out, JSON.stringify(docs, null, 2) + "\n", "utf8");
console.log(docs.length + " documents written to studio/scripts/seed-docs.json");
docs.forEach((d) => console.log("  " + d._id));
