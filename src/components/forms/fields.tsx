import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { t } from "@/messages";

const labelCls = "flex flex-col gap-1.5 text-sm font-bold";

export function TextField({ label, optional, className = "", ...props }: { label: string; optional?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`${labelCls} ${className}`}>
      <span>
        {label}
        {optional && <span className="font-normal text-muted-2"> {t.forms.optional}</span>}
      </span>
      <input className="input" required={!optional} {...props} />
    </label>
  );
}

export function TextArea({ label, optional, ...props }: { label: string; optional?: boolean } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={labelCls}>
      <span>
        {label}
        {optional && <span className="font-normal text-muted-2"> {t.forms.optional}</span>}
      </span>
      <textarea className="input" rows={3} required={!optional} {...props} />
    </label>
  );
}

export function LocationSelect({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={`${labelCls} ${className}`}>
      {t.forms.locationType}
      <select name="locationType" className="input" required {...props}>
        {t.forms.locationTypes.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

/** Onzichtbaar voor mensen, wel ingevuld door de meeste spambots. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        {t.forms.honeypot}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="grid gap-3.5 sm:grid-cols-2">{children}</div>;
}
