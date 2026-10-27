import { flattenLead, type LeadStore } from "./index";

export const airtableAdapter: LeadStore = {
  name: "airtable",
  async save(lead) {
    const key = process.env.AIRTABLE_API_KEY;
    const base = process.env.AIRTABLE_BASE_ID;
    const table = process.env.AIRTABLE_TABLE ?? "Aanvragen";
    if (!key || !base) throw new Error("AIRTABLE_API_KEY en AIRTABLE_BASE_ID zijn nodig");

    const res = await fetch(`https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      // typecast laat Airtable onbekende keuzes en tekstvelden zelf omzetten.
      body: JSON.stringify({ records: [{ fields: { ...flattenLead(lead), JSON: JSON.stringify(lead) } }], typecast: true }),
    });
    if (!res.ok) throw new Error(`Airtable: ${res.status} ${await res.text()}`);
  },
};
