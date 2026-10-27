"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import { robotsInSector, type Robot, type Sector } from "@/lib/robots";
import { t } from "@/messages";
import { RobotAvatar } from "./RobotAvatar";

type Filter = Sector | "alle";
const FILTERS: Filter[] = ["alle", "hotel", "zorg", "beveiliging"];
const isFilter = (v: string | null): v is Filter => !!v && (FILTERS as string[]).includes(v);

const STATUS_BG: Record<Robot["status"], string> = { beschikbaar: "#BFEBD8", pilot: "#FFE08A", wachtlijst: "#E6E4E0" };

/** De lijst als vacaturebank, met filter op sector. De tarieven komen als server-render binnen. */
export function RobotList({ rates }: { rates: Record<string, ReactNode> }) {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("sector");
  const [filter, setFilter] = useState<Filter>(isFilter(initial) ? initial : "alle");

  useEffect(() => {
    const s = params.get("sector");
    if (isFilter(s)) setFilter(s);
  }, [params]);

  function pick(f: Filter) {
    setFilter(f);
    track("filter_used", { sector: f });
    router.replace(f === "alle" ? "/robots" : `/robots?sector=${f}`, { scroll: false });
  }

  const list = robotsInSector(filter);
  const p = t.robotsPage;

  return (
    <>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label={p.filterLabel}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => pick(f)}
            className="min-h-12 cursor-pointer rounded-full border-2 border-ink px-5 py-3 text-base font-bold aria-pressed:bg-ink aria-pressed:text-white bg-paper text-ink"
          >
            {p.filters[f]}
          </button>
        ))}
      </div>

      <p className="m-0 mt-10 text-[15px] font-semibold text-muted-2" aria-live="polite">{p.count(list.length)}</p>
      <ul className="m-0 mt-4 flex list-none flex-col gap-5 p-0">
        {list.map((r) => {
          const hire = r.status === "beschikbaar";
          return (
            <li key={r.slug}>
              <article className="flex flex-wrap items-center gap-7 rounded-[26px] border-2 border-ink p-4 sm:p-5">
                <div className="flex h-[200px] w-full items-end justify-center overflow-hidden rounded-[22px] pt-4 sm:w-[200px] sm:flex-none" style={{ background: r.tint }}>
                  <RobotAvatar kind={r.slug} size={176} />
                </div>
                <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-2.5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <h2 className="m-0 text-[clamp(34px,3.5vw,44px)] font-black leading-none">
                      <Link href={`/robots/${r.slug}`} className="no-underline">{r.name}</Link>
                    </h2>
                    <span className="text-lg font-semibold">{r.role}</span>
                    <span className="kicker rounded-full px-2.5 py-1 text-xs" style={{ background: STATUS_BG[r.status] }}>{t.status[r.status]}</span>
                  </div>
                  <p className="m-0 text-base leading-[1.55] text-muted">{r.pitch}</p>
                  <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Taken">
                    {r.tags.map((tag) => (
                      <li key={tag} className="rounded-full bg-stone px-3 py-1.5 text-[13px] font-medium">{tag}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex w-full flex-col gap-2.5 lg:w-[260px]">
                  <dl className="m-0 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-[14px] bg-stone p-2.5"><dt className="text-muted-2">{p.shift}</dt><dd className="m-0 font-bold">{r.shift}</dd></div>
                    <div className="rounded-[14px] bg-stone p-2.5"><dt className="text-muted-2">{p.perHour}</dt><dd className="m-0 font-bold">{rates[r.slug]}</dd></div>
                  </dl>
                  <Link href={`/robots/${r.slug}`} className="btn border-ink bg-paper px-4 py-3 text-base text-ink">
                    {p.viewProfile}<span className="sr-only">: {r.name}</span>
                  </Link>
                  <Link
                    href={hire ? `/inhuren?robot=${r.slug}` : `/robots/${r.slug}#aanmelden`}
                    className="btn bg-ink px-4 py-3 text-base text-white hover:text-white"
                  >
                    {hire ? p.hire(r.name) : r.status === "pilot" ? p.joinPilot : p.joinWaitlist}
                    {!hire && <span className="sr-only">: {r.name}</span>}
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}
