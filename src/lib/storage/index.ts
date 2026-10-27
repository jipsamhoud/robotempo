import type { LeadPayload } from "../lead";
import { airtableAdapter } from "./airtable";
import { consoleAdapter } from "./console";

/** Een vervangbare opslag voor aanvragen. Nieuwe opslag? Implementeer deze interface. */
export interface LeadStore {
  name: string;
  save(lead: LeadPayload): Promise<void>;
}

export function getStore(): LeadStore {
  const choice = process.env.STORAGE_ADAPTER ?? (process.env.AIRTABLE_API_KEY ? "airtable" : "console");
  return choice === "airtable" ? airtableAdapter : consoleAdapter;
}
