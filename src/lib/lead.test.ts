import { describe, expect, it } from "vitest";
import { validateLead } from "./lead";

const base = {
  form: "pilot",
  fields: { name: "An", organisation: "Hotel X", locationType: "Hotel", email: "an@hotel.nl" },
  variant: "b",
  utm: { source: "linkedin", medium: "cpc", campaign: "pilot" },
  submittedAt: "",
};

describe("validateLead", () => {
  it("accepteert een geldige pilotaanmelding", () => {
    const r = validateLead(base);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.lead.variant).toBe("b");
  });

  it("vangt de honeypot", () => {
    expect(validateLead({ ...base, website: "http://spam" })).toMatchObject({ ok: false, spam: true });
  });

  it("weigert een ontbrekend verplicht veld en een fout e-mailadres", () => {
    expect(validateLead({ ...base, fields: { ...base.fields, name: "" } }).ok).toBe(false);
    expect(validateLead({ ...base, fields: { ...base.fields, email: "geen-mail" } }).ok).toBe(false);
  });

  it("vraagt bij een aanvraag om minstens één robot", () => {
    const aanvraag = { ...base, form: "aanvraag", sector: "hotel", crew: { bram: { count: 0, nights: 7 } } };
    expect(validateLead(aanvraag).ok).toBe(false);
    expect(validateLead({ ...aanvraag, crew: { bram: { count: 2, nights: 7 } } }).ok).toBe(true);
  });
});
