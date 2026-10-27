"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { formatEuro, formatRate, MAX_PER_ROBOT, quoteCrew, rateFor, SECTOR_PRESETS, type Crew } from "@/lib/pricing";
import { configuratorRobots, dayOptions, getRobot, shifts, type ShiftId } from "@/lib/robots";
import { useVariant } from "@/lib/useVariant";
import { t } from "@/messages";
import { LocationSelect, Row, TextArea, TextField } from "./forms/fields";
import { LeadForm } from "./forms/LeadForm";
import { RobotAvatar } from "./RobotAvatar";

const c = t.configurator;
const DEFAULT = SECTOR_PRESETS.hotel;
const LOCATION_FOR: Record<string, string> = { hotel: "Hotel", zorg: "Zorglocatie", beveiliging: "Bedrijventerrein of beveiliging" };

function startFromQuery(params: URLSearchParams) {
  const sector = params.get("sector");
  if (sector && SECTOR_PRESETS[sector]) return { ...SECTOR_PRESETS[sector], sector };
  const robot = getRobot(params.get("robot") ?? "");
  if (robot?.configurator) {
    return { crew: { [robot.slug]: 1 } as Crew, shift: (robot.slug === "joop" ? "dag" : "nacht") as ShiftId, days: 7, sector: robot.sectors[0] };
  }
  return { ...DEFAULT, sector: "" };
}

export function Configurator() {
  const params = useSearchParams();
  const start = useMemo(() => startFromQuery(params), [params]);
  const [crew, setCrew] = useState<Crew>(start.crew);
  const [shift, setShift] = useState<ShiftId>(start.shift);
  const [days, setDays] = useState<number>(start.days);
  const [step, setStep] = useState<"kies" | "gegevens">("kies");
  const variant = useVariant();
  const quote = quoteCrew({ crew, shift, days, variant });
  const formTop = useRef<HTMLHeadingElement>(null);
  const crewBox = useRef<HTMLElement>(null);
  const [crewInView, setCrewInView] = useState(false);
  const changed = useRef(false);

  useEffect(() => {
    setCrew(start.crew);
    setShift(start.shift);
    setDays(start.days);
  }, [start]);

  useEffect(() => {
    track("configurator_start", start.sector ? { sector: start.sector } : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!changed.current) return;
    const id = setTimeout(
      () => track("crew_changed", { robots: crewSummary(crew), shift, days, weekprijs: Math.round(quote.costWeek) }),
      600,
    );
    return () => clearTimeout(id);
  }, [crew, shift, days, quote.costWeek]);

  // De prijsbalk op mobiel verdwijnt zodra het overzicht zelf in beeld is, of erboven ligt.
  useEffect(() => {
    const el = crewBox.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCrewInView(e.isIntersecting || e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [step]);

  function update(fn: () => void) {
    changed.current = true;
    fn();
  }

  function goToForm() {
    if (!quote.hoursWeek) return;
    setStep("gegevens");
    requestAnimationFrame(() => formTop.current?.focus());
  }

  const summary = (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {quote.lines.map((l) => (
        <li key={l.slug} className="flex justify-between gap-3 text-[15px]">
          <span className="opacity-80">{c.line(l.count, l.name, l.hours)}</span>
          <span className="font-bold">{formatEuro(l.cost)}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col gap-8">
      <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0 sm:gap-2" aria-label={c.stepsLabel}>
        {c.steps.map((label, i) => {
          const current = (step === "kies" && i === 0) || (step === "gegevens" && i === 1);
          const done = step === "gegevens" && i === 0;
          return (
            <li
              key={label}
              aria-current={current ? "step" : undefined}
              className={`flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 text-xs font-bold sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${current ? "bg-ink text-white" : done ? "bg-paper" : "bg-transparent opacity-70"}`}
            >
              <span className="font-display">{String(i + 1).padStart(2, "0")}</span> {label}
            </li>
          );
        })}
      </ol>

      {step === "kies" ? (
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
            <section className="flex flex-col gap-3 rounded-[26px] border-2 border-ink bg-paper p-5 sm:p-6" aria-labelledby="c-robots">
              <h2 id="c-robots" className="m-0 text-[28px] font-black">{c.robotsTitle}</h2>
              {configuratorRobots.map((r) => {
                const n = crew[r.slug] ?? 0;
                const set = (v: number) => update(() => setCrew((cur) => ({ ...cur, [r.slug]: Math.max(0, Math.min(MAX_PER_ROBOT, v)) })));
                const rate = rateFor(r, variant)!;
                return (
                  <div key={r.slug} className="flex items-center gap-3 rounded-[20px] bg-stone p-3 sm:gap-4">
                    <div className="hidden size-20 shrink-0 items-end justify-center overflow-hidden rounded-2xl pt-2 sm:flex" style={{ background: r.tint }}>
                      <RobotAvatar kind={r.slug} size={70} label="" />
                    </div>
                    <div className="min-w-0 flex-1 pl-1 sm:pl-0">
                      <div className="font-display text-2xl font-black leading-tight">
                        <Link href={`/robots/${r.slug}`} className="no-underline hover:underline">{r.name}</Link>
                        <span className="block font-sans text-sm font-semibold sm:inline sm:text-base">
                          <span className="hidden sm:inline">, </span>
                          {r.role}
                        </span>
                      </div>
                      <div className="text-sm text-muted-2">
                        {formatRate(rate)} {t.price.perHour}
                        {r.slug === "wout" && `, ${t.price.withControl}`}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2" role="group" aria-label={c.count(r.name)}>
                      <button type="button" onClick={() => set(n - 1)} disabled={n === 0} aria-label={c.less(r.name)} className="size-11 cursor-pointer rounded-full border-2 border-ink bg-paper text-2xl font-bold disabled:cursor-not-allowed disabled:opacity-40 sm:size-12">−</button>
                      <output aria-live="polite" aria-label={c.count(r.name)} className="min-w-7 text-center font-display text-[26px] font-black sm:min-w-8 sm:text-[28px]">{n}</output>
                      <button type="button" onClick={() => set(n + 1)} disabled={n === MAX_PER_ROBOT} aria-label={c.more(r.name)} className="size-11 cursor-pointer rounded-full border-2 border-ink bg-ink text-2xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:size-12">+</button>
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="flex flex-col gap-4 rounded-[26px] border-2 border-ink bg-paper p-5 sm:p-6" aria-labelledby="c-shift">
              <h2 id="c-shift" className="m-0 text-[28px] font-black">{c.shiftTitle}</h2>
              <div className="flex flex-wrap gap-2.5" role="group" aria-labelledby="c-shift">
                {shifts.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={shift === s.id}
                    onClick={() => update(() => setShift(s.id))}
                    className="min-h-12 flex-[1_1_160px] cursor-pointer rounded-[18px] border-2 border-line bg-paper p-4 text-left aria-pressed:border-ink aria-pressed:bg-[#FFE1D3]"
                  >
                    <span className="block text-base font-bold">{s.label}</span>
                    <span className="block text-sm text-muted-2">{s.sub}</span>
                  </button>
                ))}
              </div>
              <h2 id="c-days" className="m-0 mt-2 text-[28px] font-black">{c.daysTitle}</h2>
              <div className="flex flex-wrap gap-2.5" role="group" aria-labelledby="c-days">
                {dayOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={days === d}
                    onClick={() => update(() => setDays(d))}
                    className="min-h-12 cursor-pointer rounded-full border-2 border-ink bg-paper px-6 py-3 font-bold aria-pressed:bg-ink aria-pressed:text-white"
                  >
                    {c.days[d]}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="on-dark flex w-full flex-[1_1_340px] scroll-mt-4 flex-col gap-4 rounded-[26px] bg-ink p-6 text-white sm:p-7 lg:sticky lg:top-6" aria-labelledby="c-crew" id="ploeg" ref={crewBox}>
            <h2 id="c-crew" className="m-0 text-[28px] font-black text-white">{c.crewTitle}</h2>
            {quote.lines.length ? summary : <p className="m-0 text-[15px] text-[#CFCFCF]">{c.empty}</p>}
            <div className="flex flex-col gap-1 border-t border-[#3A3A3A] pt-4" aria-live="polite">
              <span className="text-sm text-[#CFCFCF]">{c.perWeek}</span>
              <span className="font-display text-[clamp(48px,5vw,64px)] font-black leading-none text-brand">{formatEuro(quote.costWeek)}</span>
              <span className="text-sm text-[#CFCFCF]">{c.perMonth(formatEuro(quote.costMonth), quote.hoursWeek)}</span>
            </div>
            <div className="flex flex-col gap-1 rounded-[18px] bg-[#222222] p-4">
              <span className="text-sm text-[#CFCFCF]">{c.avoidedLabel}</span>
              <span className="font-display text-[28px] font-black text-white">{c.avoided(formatEuro(quote.avoidedWeek))}</span>
              <span className="text-xs leading-normal text-[#B5B5B5]">{c.avoidedNote}</span>
            </div>
            <button type="button" onClick={goToForm} disabled={!quote.hoursWeek} className="btn bg-brand text-ink">
              {c.toForm}
            </button>
            <span className="text-center text-[13px] text-[#B5B5B5]">{c.smallPrint}</span>
          </aside>

          {/* Op mobiel staat het overzicht onderaan; deze balk houdt de weekprijs in beeld. */}
          <div className={`on-dark fixed inset-x-0 bottom-0 z-20 border-t border-[#3A3A3A] bg-ink px-4 py-3 text-white transition-transform lg:hidden ${crewInView ? "translate-y-full" : ""}`} aria-hidden="true">
            <div className="mx-auto flex max-w-[640px] items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-[#CFCFCF]">{c.perWeek}</span>
                <span className="font-display text-[28px] font-black leading-none text-brand">{formatEuro(quote.costWeek)}</span>
              </div>
              <a href="#ploeg" tabIndex={-1} className="btn bg-brand px-5 py-3 text-base text-ink hover:text-ink">
                {c.crewTitle}
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-6">
          <div className="min-w-0 flex-[999_1_560px] rounded-[26px] border-2 border-ink bg-paper p-5 sm:p-7">
            <h2 ref={formTop} tabIndex={-1} className="mb-5 mt-0 text-[clamp(30px,3.5vw,44px)] font-black leading-[0.95] outline-none">{c.formTitle}</h2>
            <LeadForm
              form="aanvraag"
              label={c.formTitle}
              submitLabel={c.submit}
              buttonClassName="bg-ink text-white"
              extra={() => ({
                crew: { robots: Object.fromEntries(quote.lines.map((l) => [l.slug, l.count])), shift, days },
                priceWeek: quote.costWeek,
              })}
              event={{
                name: "request_submitted",
                props: (f) => ({ sector: start.sector || f.locationType, robots: crewSummary(crew), weekprijs: Math.round(quote.costWeek) }),
              }}
              before={
                <button type="button" onClick={() => setStep("kies")} className="btn border-ink bg-paper text-ink">
                  {c.back}
                </button>
              }
            >
              <TextField label={t.forms.name} name="name" autoComplete="name" />
              <TextField label={t.forms.orgAndPlace} name="organisation" autoComplete="organization" />
              <Row>
                <LocationSelect defaultValue={LOCATION_FOR[start.sector] ?? "Hotel"} />
                <TextField label={t.forms.size} name="size" inputMode="numeric" optional />
              </Row>
              <TextArea label={t.forms.backlog} name="backlog" optional />
              <Row>
                <TextField label={t.forms.email} name="email" type="email" autoComplete="email" />
                <TextField label={t.forms.phone} name="phone" type="tel" autoComplete="tel" optional />
              </Row>
            </LeadForm>
          </div>
          <aside className="flex w-full flex-[1_1_340px] flex-col gap-3 rounded-[26px] bg-stone p-6 lg:sticky lg:top-6" aria-labelledby="c-request">
            <h2 id="c-request" className="m-0 text-2xl font-black">{c.yourRequest}</h2>
            {summary}
            <p className="m-0 text-sm text-muted-2">
              {shifts.find((s) => s.id === shift)?.label}, {c.days[days].toLowerCase()}
            </p>
            <div className="flex justify-between border-t-2 border-ink pt-3 text-lg font-bold">
              <span>{c.perWeek}</span>
              <span>{formatEuro(quote.costWeek)}</span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function crewSummary(crew: Crew) {
  return Object.entries(crew)
    .filter(([, n]) => (n ?? 0) > 0)
    .map(([slug, n]) => `${slug}:${n}`)
    .join(",");
}
