/* =============================================================================
   SANITY CONNECTION SETTINGS
   -----------------------------------------------------------------------------
   This tells the website where to read the owner-editable content from.

   ★ Put your Sanity project ID on the projectId line below. It must match the
     one in studio/sanity.config.js.

   If projectId is left as "REPLACE_WITH_PROJECT_ID" (or emptied out), the site
   quietly ignores Sanity and runs entirely on assets/js/data.js, exactly as it
   did before Sanity was added. Nothing breaks.

   There is no password or secret here. The dataset is public and read-only from
   the website's side, so this file is safe to commit and safe to view.
   ============================================================================= */

window.OM_SANITY = {
  projectId: "1gjbq9h5",
  dataset: "production",

  // Sanity's API version. Pinned to a date so future API changes can't alter
  // how this site behaves. Don't change it without testing.
  apiVersion: "2024-03-11",

  // How long to wait for Sanity before giving up and using data.js (in ms).
  timeoutMs: 4000
};
