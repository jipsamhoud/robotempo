"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { track, type EventName } from "@/lib/analytics";
import type { FormType } from "@/lib/lead";
import { submitLead, type SubmitInput } from "@/lib/submit";
import { t } from "@/messages";
import { Honeypot } from "./fields";

interface Props {
  form: FormType;
  label: string;
  submitLabel: string;
  children: ReactNode;
  /** Extra gegevens naast de velden, zoals de gekozen ploeg. */
  extra?: () => Omit<SubmitInput, "form" | "fields" | "website">;
  event: { name: EventName; props?: Record<string, string | number> | ((fields: Record<string, string>) => Record<string, string | number>) };
  /** Waar `/bedankt` naar verwijst, bijv. de robot bij een wachtlijst. */
  thanksQuery?: Record<string, string>;
  className?: string;
  buttonClassName?: string;
  before?: ReactNode;
  note?: ReactNode;
}

/** Eén formulier-afhandeling voor alle aanvragen: honeypot, versturen, event, door naar /bedankt. */
export function LeadForm({ form, label, submitLabel, children, extra, event, thanksQuery, className = "", buttonClassName = "bg-brand text-ink", before, note }: Props) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const website = String(data.get("website") ?? "");
    data.delete("website");
    const fields = Object.fromEntries([...data.entries()].map(([k, v]) => [k, String(v)]));

    setState("sending");
    try {
      await submitLead({ form, fields, website, ...extra?.() });
      track(event.name, typeof event.props === "function" ? event.props(fields) : event.props);
      const q = new URLSearchParams({ form, ...thanksQuery });
      router.push(`/bedankt?${q}`);
    } catch (err) {
      console.error(err);
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} aria-label={label} className={`relative flex flex-col gap-3.5 ${className}`}>
      <Honeypot />
      {children}
      {before}
      <button type="submit" disabled={state === "sending"} className={`btn w-full ${buttonClassName}`}>
        {state === "sending" ? t.forms.sending : submitLabel}
      </button>
      {state === "error" && (
        <p role="alert" className="m-0 rounded-xl bg-[#FFE1D3] p-3 text-sm font-semibold">
          {t.forms.error}
        </p>
      )}
      {note}
      <p className="m-0 text-sm text-muted-2">
        {t.forms.privacy}{" "}
        <Link href="/privacy" className="text-muted-2">
          {t.forms.privacyLink}
        </Link>
      </p>
    </form>
  );
}
