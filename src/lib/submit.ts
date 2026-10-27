"use client";

import { flattenLead, type FormType, type LeadPayload } from "./lead";
import { getUtm, getVariant } from "./variant";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isDemo = process.env.NEXT_PUBLIC_DEMO === "1";
const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const SUBJECTS: Record<FormType, string> = {
  pilot: "Pilotaanmelding",
  aanvraag: "Aanvraag ploeg",
  wachtlijst: "Wachtlijst of pilot",
  fabrikant: "Fabrikant",
};

export interface SubmitInput {
  form: FormType;
  fields: Record<string, string>;
  crew?: LeadPayload["crew"];
  priceWeek?: number | null;
  website?: string;
}

/**
 * Stuurt een formulier weg. Met een Web3Forms-sleutel (statische site op GitHub Pages) gaat het
 * rechtstreeks als e-mail naar de inbox; anders naar /api/lead. In de demo zonder sleutel blijft het in de browser.
 */
export async function submitLead(input: SubmitInput): Promise<void> {
  const payload: LeadPayload = {
    ...input,
    variant: getVariant(),
    utm: getUtm(),
    submittedAt: new Date().toISOString(),
  };

  if (web3formsKey) {
    const who = input.fields.organisation ?? input.fields.company ?? input.fields.name;
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: web3formsKey,
        subject: `Robotempo: ${SUBJECTS[input.form]}, ${who}`,
        from_name: "Robotempo website",
        replyto: input.fields.email,
        botcheck: input.website ?? "",
        ...flattenLead(payload),
      }),
    });
    const body = (await res.json().catch(() => null)) as { success?: boolean } | null;
    if (!res.ok || !body?.success) throw new Error(`Versturen mislukt (${res.status})`);
    return;
  }

  if (isDemo) {
    console.info("[demo] aanvraag niet verstuurd", payload);
    return;
  }

  const res = await fetch(`${basePath}/api/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Versturen mislukt (${res.status})`);
}
