"use client";

import { t } from "@/messages";
import { LeadForm } from "./LeadForm";
import { LocationSelect, Row, TextField } from "./fields";

export function PilotForm() {
  return (
    <LeadForm
      form="pilot"
      label="Aanmelden voor een pilot"
      submitLabel={t.forms.pilotSubmit}
      event={{ name: "pilot_signup" }}
      className="rounded-[30px] bg-paper p-6 text-ink sm:p-8"
      note={<p className="m-0 text-sm text-muted-2">{t.forms.pilotNote}</p>}
    >
      <TextField label={t.forms.name} name="name" autoComplete="name" />
      <TextField label={t.forms.organisation} name="organisation" autoComplete="organization" />
      <Row>
        <LocationSelect />
        <TextField label={t.forms.email} name="email" type="email" autoComplete="email" />
      </Row>
    </LeadForm>
  );
}
