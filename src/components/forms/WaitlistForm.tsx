"use client";

import type { Robot } from "@/lib/robots";
import { t } from "@/messages";
import { LeadForm } from "./LeadForm";
import { LocationSelect, Row, TextField } from "./fields";

/** Wachtlijst (Rik) of pilot (Fenna). */
export function WaitlistForm({ robot }: { robot: Robot }) {
  const pilot = robot.status === "pilot";
  return (
    <LeadForm
      form="wachtlijst"
      label={pilot ? t.profile.pilotFormTitle(robot.name) : t.profile.waitFormTitle(robot.name)}
      submitLabel={pilot ? t.forms.pilotSubmit : t.forms.waitlistSubmit}
      event={{ name: "waitlist_signup", props: { slug: robot.slug } }}
      thanksQuery={{ robot: robot.slug }}
      className="rounded-[26px] border-2 border-ink bg-paper p-6"
      buttonClassName="bg-ink text-white"
    >
      <input type="hidden" name="robot" value={robot.slug} />
      <input type="hidden" name="list" value={pilot ? "pilot" : "wachtlijst"} />
      <Row>
        <TextField label={t.forms.name} name="name" autoComplete="name" />
        <TextField label={t.forms.organisation} name="organisation" autoComplete="organization" />
      </Row>
      <Row>
        <LocationSelect />
        <TextField label={t.forms.email} name="email" type="email" autoComplete="email" />
      </Row>
    </LeadForm>
  );
}
