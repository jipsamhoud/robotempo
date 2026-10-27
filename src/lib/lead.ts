// Gedeeld tussen formulieren en de API-route: de vorm en de validatie van een aanvraag.

export type FormType = "pilot" | "aanvraag" | "wachtlijst" | "fabrikant";
export const FORM_TYPES: FormType[] = ["pilot", "aanvraag", "wachtlijst", "fabrikant"];

export interface LeadPayload {
  form: FormType;
  fields: Record<string, string>;
  crew?: { robots: Record<string, number>; shift: string; days: number } | null;
  priceWeek?: number | null;
  variant: "a" | "b";
  utm: { source: string; medium: string; campaign: string };
  submittedAt: string;
  /** Honeypot. Mensen zien dit veld niet. */
  website?: string;
}

const REQUIRED: Record<FormType, string[]> = {
  pilot: ["name", "organisation", "locationType", "email"],
  aanvraag: ["name", "organisation", "locationType", "email"],
  wachtlijst: ["name", "organisation", "email", "robot"],
  fabrikant: ["name", "company", "robotName", "email"],
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ValidationResult = { ok: true; lead: LeadPayload } | { ok: false; error: string; spam?: boolean };

export function validateLead(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") return { ok: false, error: "Ongeldige aanvraag" };
  const p = input as Partial<LeadPayload>;
  if (p.website) return { ok: false, error: "spam", spam: true };
  if (!p.form || !FORM_TYPES.includes(p.form)) return { ok: false, error: "Onbekend formulier" };
  if (!p.fields || typeof p.fields !== "object") return { ok: false, error: "Geen velden" };

  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries(p.fields)) {
    if (typeof v !== "string") continue;
    fields[k] = v.trim().slice(0, 2000);
  }
  for (const key of REQUIRED[p.form]) {
    if (!fields[key]) return { ok: false, error: `Veld ontbreekt: ${key}` };
  }
  if (!EMAIL.test(fields.email)) return { ok: false, error: "Ongeldig e-mailadres" };
  if (p.form === "aanvraag" && (!p.crew || !Object.values(p.crew.robots ?? {}).some((n) => n > 0))) {
    return { ok: false, error: "Geen robots gekozen" };
  }

  return {
    ok: true,
    lead: {
      form: p.form,
      fields,
      crew: p.crew ?? null,
      priceWeek: typeof p.priceWeek === "number" ? Math.round(p.priceWeek * 100) / 100 : null,
      variant: p.variant === "b" ? "b" : "a",
      utm: {
        source: String(p.utm?.source ?? "").slice(0, 200),
        medium: String(p.utm?.medium ?? "").slice(0, 200),
        campaign: String(p.utm?.campaign ?? "").slice(0, 200),
      },
      submittedAt: new Date().toISOString(),
    },
  };
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
