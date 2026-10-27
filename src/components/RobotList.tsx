"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { robotsInSector, type Sector } from "@/lib/robots";
import { t } from "@/messages";
import { RobotCard } from "./RobotCard";

type Filter = Sector | "alle";
const FILTERS: Filter[] = ["alle", "hotel", "zorg", "beveiliging"];
const isFilter = (v: string | null): v is Filter => !!v && (FILTERS as string[]).includes(v);

/** De lijst als vacaturebank, met filter op sector. */
export function RobotList() {
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
            className="min-h-12 cursor-pointer rounded-full border-2 border-ink bg-paper px-5 py-3 text-base font-bold text-ink aria-pressed:bg-ink aria-pressed:text-white"
          >
            {p.filters[f]}
          </button>
        ))}
      </div>

      <p className="m-0 mt-10 text-[15px] font-semibold text-muted-2" aria-live="polite">{p.count(list.length)}</p>
      <ul className="m-0 mt-4 flex list-none flex-col gap-5 p-0">
        {list.map((r) => (
          <li key={r.slug}>
            <RobotCard robot={r} sector={filter === "alle" ? undefined : filter} />
          </li>
        ))}
      </ul>
    </>
  );
}
