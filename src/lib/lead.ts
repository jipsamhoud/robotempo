// Gedeeld tussen formulieren en de API-route: de vorm en de validatie van een aanvraag.

export type FormType = "pilot" | "aanvraag" | "wachtlijst" | "flexpool" | "fabrikant";
export const FORM_TYPES: FormType[] = ["pilot", "aanvraag", "wachtlijst", "flexpool", "fabrikant"];

export type CrewPayload = Record<string, { count: number; nights?: number; hours?: number }>;

export interface LeadPayload {
  form: FormType;
  fields: Record<string, string>;
  sector?: string;
  crew?: CrewPayload | null;
  priceMonth?: number | null;
  landingPage?: string;
  variant: "a" | "b";
  utm: { source: string; medium: string; campaign: string };
  submittedAt: string;
  /** Honeypot. Mensen zien dit veld niet. */
  website?: string;
}

const REQUIRED: Record<FormType, string[]> = {
  pilot: ["name", "organisation", "email"],
  aanvraag: ["name", "organisation", "email"],
  wachtlijst: ["name", "organisation", "email", "robot"],
  flexpool: ["name", "organisation", "email", "sector", "period"],
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
  if (p.form === "aanvraag" && (!p.crew || !Object.values(p.crew).some((c) => c?.count > 0))) {
    return { ok: false, error: "Geen robots gekozen" };
  }

  return {
    ok: true,
    lead: {
      form: p.form,
      fields,
      sector: String(p.sector ?? fields.sector ?? "").slice(0, 40),
      crew: p.crew ?? null,
      priceMonth: typeof p.priceMonth === "number" ? Math.round(p.priceMonth) : null,
      landingPage: String(p.landingPage ?? "").slice(0, 300),
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
    ? Object.entries(lead.crew)
        .filter(([, c]) => c.count > 0)
        .map(([slug, c]) => {
          const extra = [c.hours && `${c.hours} uur`, c.nights && `${c.nights} nachten per week`].filter(Boolean).join(", ");
          return `${c.count}× ${slug}${extra ? ` (${extra})` : ""}`;
        })
        .join("; ")
    : "";
  return {
    Formulier: lead.form,
    Sector: lead.sector ?? "",
    ...Object.fromEntries(Object.entries(lead.fields).map(([k, v]) => [k, v])),
    Ploeg: crew,
    Maandbedrag: lead.priceMonth ?? "",
    Prijsvariant: lead.variant.toUpperCase(),
    "UTM bron": lead.utm.source,
    "UTM medium": lead.utm.medium,
    "UTM campagne": lead.utm.campaign,
    Landingspagina: lead.landingPage ?? "",
    Tijdstip: lead.submittedAt,
  };
}
