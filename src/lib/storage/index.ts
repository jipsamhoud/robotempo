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

/** Platte rij met alle velden, voor opslag en e-mail. */
export function flattenLead(lead: LeadPayload): Record<string, string | number> {
  const crew = lead.crew
    ? Object.entries(lead.crew.robots)
        .filter(([, n]) => n > 0)
        .map(([slug, n]) => `${n}× ${slug}`)
        .join(", ")
    : "";
  return {
    Formulier: lead.form,
    ...Object.fromEntries(Object.entries(lead.fields).map(([k, v]) => [k, v])),
    Ploeg: crew,
    Dienst: lead.crew?.shift ?? "",
    "Dagen per week": lead.crew?.days ?? "",
    Weekprijs: lead.priceWeek ?? "",
    Prijsvariant: lead.variant.toUpperCase(),
    "UTM bron": lead.utm.source,
    "UTM medium": lead.utm.medium,
    "UTM campagne": lead.utm.campaign,
    Tijdstip: lead.submittedAt,
  };
}
