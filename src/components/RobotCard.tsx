import Link from "next/link";
import type { Robot } from "@/lib/robots";
import { t } from "@/messages";
import { Price } from "./Price";
import { RobotMedia } from "./RobotMedia";

export const STATUS_BG: Record<Robot["status"], string> = { beschikbaar: "#BFEBD8", pilot: "#FFE08A", wachtlijst: "#E6E4E0" };

export function StatusPill({ robot, long = false }: { robot: Robot; long?: boolean }) {
  return (
    <span className="kicker inline-block rounded-full px-2.5 py-1 text-xs" style={{ background: STATUS_BG[robot.status] }}>
      {long ? t.statusLong[robot.status] : t.status[robot.status]}
    </span>
  );
}

/** Waar de hoofdknop van een robot heen gaat: inhuren, pilot of wachtlijst. */
export function robotCta(robot: Robot, sector?: string) {
  const p = t.robotsPage;
  if (robot.status === "beschikbaar") {
    const q = sector ? `sector=${sector}&robot=${robot.slug}` : `robot=${robot.slug}`;
    return { href: `/inhuren?${q}`, label: p.hire(robot.name) };
  }
  return { href: `/robots/${robot.slug}#aanmelden`, label: robot.status === "pilot" ? p.joinPilot : p.joinWaitlist };
}

/** Een robot als vacature: personage, functie, status, pitch, taken, dienst, prijs en knoppen. */
export function RobotCard({ robot: r, sector }: { robot: Robot; sector?: string }) {
  const p = t.robotsPage;
  const cta = robotCta(r, sector);
  return (
    <article className="flex flex-wrap items-center gap-7 rounded-[26px] border-2 border-ink bg-paper p-4 sm:p-5">
      <div className="flex h-[200px] w-full items-end justify-center overflow-hidden rounded-[22px] pt-4 sm:w-[200px] sm:flex-none" style={{ background: r.tint }}>
        <RobotMedia kind={r.slug} size={176} />
      </div>
      <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h2 className="m-0 text-[clamp(34px,3.5vw,44px)] font-black leading-none">
            <Link href={`/robots/${r.slug}`} className="no-underline">{r.name}</Link>
          </h2>
          <span className="text-lg font-semibold">{r.role}</span>
          <StatusPill robot={r} />
        </div>
        <p className="m-0 text-base leading-[1.55] text-muted">{r.pitch}</p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Taken">
          {r.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-stone px-3 py-1.5 text-[13px] font-medium">{tag}</li>
          ))}
        </ul>
      </div>
      <div className="flex w-full flex-col gap-2.5 lg:w-[270px]">
        <dl className="m-0 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-[14px] bg-stone p-2.5"><dt className="text-muted-2">{p.shift}</dt><dd className="m-0 font-bold">{r.shift.split(",")[0]}</dd></div>
          <div className="rounded-[14px] bg-stone p-2.5"><dt className="text-muted-2">{p.price}</dt><dd className="m-0 font-bold leading-snug"><Price robot={r} /></dd></div>
        </dl>
        <Link href={`/robots/${r.slug}`} className="btn border-ink bg-paper px-4 py-3 text-base text-ink">
          {p.viewProfile}<span className="sr-only">: {r.name}</span>
        </Link>
        <Link href={cta.href} className="btn bg-ink px-4 py-3 text-base text-white hover:text-white">
          {cta.label}
          {r.status !== "beschikbaar" && <span className="sr-only">: {r.name}</span>}
        </Link>
      </div>
    </article>
  );
}
