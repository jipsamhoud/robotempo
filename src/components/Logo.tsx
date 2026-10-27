import Link from "next/link";
import { t } from "@/messages";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" aria-label={t.nav.home} className={`flex items-center gap-3 no-underline ${dark ? "text-white hover:text-white" : "text-ink hover:text-ink"}`}>
      <span className={`flex size-11 items-center justify-center gap-[7px] rounded-[14px] ${dark ? "bg-brand" : "bg-ink"}`} aria-hidden="true">
        <span className={`size-[9px] rounded-full ${dark ? "bg-ink" : "bg-brand"}`} />
        <span className={`size-[9px] rounded-full ${dark ? "bg-ink" : "bg-brand"}`} />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-display text-[28px] font-black leading-[0.9] tracking-[-0.04em]">Robotempo</span>
        <span className="text-xs font-semibold tracking-[0.02em]">{t.meta.tagline}</span>
      </span>
    </Link>
  );
}
