import { validateLead } from "@/lib/lead";
import { notifyByEmail } from "@/lib/notify";
import { getStore } from "@/lib/storage";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Geen geldige JSON" }, { status: 400 });
  }

  const result = validateLead(body);
  if (!result.ok) {
    // Spam krijgt een gewoon 'ok' terug, zodat bots niet leren wat er misging.
    if (result.spam) return Response.json({ ok: true });
    return Response.json({ ok: false, error: result.error }, { status: 422 });
  }

  try {
    await getStore().save(result.lead);
  } catch (err) {
    console.error("[lead] opslaan mislukt", err);
    return Response.json({ ok: false, error: "Opslaan mislukt" }, { status: 500 });
  }

  try {
    await notifyByEmail(result.lead);
  } catch (err) {
    // De aanvraag staat al opgeslagen; een mislukte mail mag de bezoeker niet blokkeren.
    console.error("[lead] e-mail mislukt", err);
  }

  return Response.json({ ok: true });
}
