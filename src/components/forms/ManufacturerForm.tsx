"use client";

import { t } from "@/messages";
import { LeadForm } from "./LeadForm";
import { Row, TextArea, TextField } from "./fields";

export function ManufacturerForm() {
  const m = t.manufacturer;
  return (
    <LeadForm
      form="fabrikant"
      label={m.title}
      submitLabel={m.submit}
      event={{ name: "manufacturer_signup" }}
      className="rounded-[30px] border-2 border-ink bg-paper p-6 sm:p-8"
      buttonClassName="bg-ink text-white"
    >
      <Row>
        <TextField label={t.forms.name} name="name" autoComplete="name" />
        <TextField label={m.company} name="company" autoComplete="organization" />
      </Row>
      <Row>
        <TextField label={m.robotName} name="robotName" />
        <TextField label={m.website} name="url" type="url" optional placeholder="https://" />
      </Row>
      <TextArea label={m.task} name="task" optional />
      <TextArea label={m.proof} name="proof" optional />
      <Row>
        <TextField label={t.forms.email} name="email" type="email" autoComplete="email" />
        <TextField label={t.forms.phone} name="phone" type="tel" autoComplete="tel" optional />
      </Row>
    </LeadForm>
  );
}
