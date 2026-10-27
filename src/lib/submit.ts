"use client";

import type { FormType, LeadPayload } from "./lead";
import { getUtm, getVariant } from "./variant";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isDemo = process.env.NEXT_PUBLIC_DEMO === "1";

export interface SubmitInput {
  form: FormType;
  fields: Record<string, string>;
  crew?: LeadPayload["crew"];
  priceWeek?: number | null;
  website?: string;
}

/** Stuurt een formulier naar /api/lead. In de demo (GitHub Pages) blijft het in de browser. */
export async function submitLead(input: SubmitInput): Promise<void> {
  const payload: LeadPayload = {
    ...input,
    variant: getVariant(),
    utm: getUtm(),
    submittedAt: new Date().toISOString(),
  };

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
