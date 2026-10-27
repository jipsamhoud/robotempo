"use client";

import { t } from "@/messages";
import { LeadForm } from "./LeadForm";
import { Row, TextArea, TextField } from "./fields";

export function FlexpoolForm() {
  const f = t.flexpool;
  return (
    <LeadForm
      form="flexpool"
      label={f.formTitle}
      submitLabel={f.submit}
      event={{ name: "flexpool_request", props: (fields) => ({ sector: fields.sector ?? "" }) }}
      className="rounded-[30px] border-2 border-ink bg-paper p-6 sm:p-8"
      buttonClassName="bg-ink text-white"
    >
      <Row>
        <label className="flex flex-col gap-1.5 text-sm font-bold">
          {f.sector}
          <select name="sector" className="input" required>
            {f.sectorOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <TextField label={f.period} name="period" placeholder={f.periodHint} />
      </Row>
      <Row>
        <TextField label={f.amount} name="amount" type="number" min={1} max={50} inputMode="numeric" optional />
        <TextField label={t.forms.orgAndPlace} name="organisation" autoComplete="organization" />
      </Row>
      <TextArea label={f.work} name="work" placeholder={f.workHint} optional />
      <Row>
        <TextField label={t.forms.name} name="name" autoComplete="name" />
        <TextField label={t.forms.email} name="email" type="email" autoComplete="email" />
      </Row>
      <TextField label={t.forms.phone} name="phone" type="tel" autoComplete="tel" optional />
    </LeadForm>
  );
}
