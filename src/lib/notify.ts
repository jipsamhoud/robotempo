import type { LeadPayload } from "./lead";
import { flattenLead } from "./storage";

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** E-mailmelding via Resend. Zonder sleutel slaat hij dit stil over. */
export async function notifyByEmail(lead: LeadPayload): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  if (!key || !to) return;

  const rows = Object.entries(flattenLead(lead))
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#575757">${escape(k)}</td><td>${escape(String(v))}</td></tr>`)
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.NOTIFY_EMAIL_FROM ?? "Robotempo <onboarding@resend.dev>",
      to: [to],
      reply_to: lead.fields.email,
      subject: `Nieuwe ${lead.form}: ${lead.fields.organisation ?? lead.fields.company ?? lead.fields.name}`,
      html: `<table style="font-family:sans-serif;font-size:14px">${rows}</table>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend: ${res.status} ${await res.text()}`);
}
