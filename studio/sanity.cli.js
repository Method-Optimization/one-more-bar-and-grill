/* Used by the `sanity` command line tool (dev / build / deploy).
   Keep PROJECT_ID identical to the one in sanity.config.js. */

import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "1gjbq9h5",
    dataset: "production"
  },

  // The hosted Studio's address: https://onemorebng.sanity.studio
  // Pinned here so `sanity deploy` never prompts and can't land somewhere else.
  studioHost: "onemorebng",

  deployment: {
    appId: "jijj0di8rosp6gui5e9tih2n"
  }
});
