import type { LeadStore } from "./index";

export const consoleAdapter: LeadStore = {
  name: "console",
  async save(lead) {
    console.log("[lead]", JSON.stringify(lead, null, 2));
  },
};
