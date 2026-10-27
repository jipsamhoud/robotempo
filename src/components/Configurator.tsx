"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import { formatEuro, priceFor, priceLabel, quoteCrew, type Crew, type CrewLine, type CrewPick } from "@/lib/pricing";
import { avoidedNote, configurator, getConfiguratorSector, getRobot, type Robot, type RobotKind, type Sector } from "@/lib/robots";
import { useVariant } from "@/lib/useVariant";
import { t } from "@/messages";
import { Row, TextArea, TextField } from "./forms/fields";
import { LeadForm } from "./forms/LeadForm";
import { RobotMedia } from "./RobotMedia";

const c = t.configurator;
const MAX = 5;
const NIGHTS = configurator.nightsPerWeek;
const HOURS = configurator.guardHoursPerNight;

/** De standaardploeg van een sector uit robots.json. */
function defaultCrew(sector: Sector, robot?: RobotKind): Crew {
  const s = getConfiguratorSector(sector)!;
  const crew: Crew = {};
  for (const slug of s.robots) crew[slug] = { count: s.default[slug] ?? 0, nights: NIGHTS[0], hours: HOURS.at(-1) };
  if (robot && crew[robot] && !crew[robot]!.count) crew[robot]!.count = 1;
  return crew;
}

function startFromQuery(params: URLSearchParams): { sector: Sector | null; robot?: RobotKind } {
  const robot = getRobot(params.get("robot") ?? "");
  const fromQuery = getConfiguratorSector(params.get("sector") ?? "")?.id;
  const sector = fromQuery ?? (robot?.configurator ? robot.sectors.find((s) => getConfiguratorSector(s)?.robots.includes(robot.slug)) : undefined);
  return { sector: sector ?? null, robot: robot?.slug };
}

function crewSummary(crew: Crew) {
  return Object.entries(crew)
    .filter(([, p]) => p && p.count > 0)
    .map(([slug, p]) => `${slug}:${p!.count}`)
    .join(",");
}

function lineLabel(l: CrewLine, robot: Robot) {
  if (robot.pricing === "nacht") return c.line.nacht(l.count, l.name, l.nights!);
  if (robot.pricing === "dienstuur") return c.line.dienstuur(l.count, l.name, l.hours!, l.nights!);
  return c.line.maand(l.count, l.name);
}

/** Pil-knoppen voor een keuze uit een paar waarden. */
function Choice<T extends number>({ label, value, options, render, onChange }: { label: string; value: T; options: T[]; render: (v: T) => string; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      <span className="mr-1 text-sm font-semibold text-muted-2">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className="min-h-11 cursor-pointer rounded-full border-2 border-ink bg-paper px-4 text-sm font-bold aria-pressed:bg-ink aria-pressed:text-white"
        >
          {render(o)}
        </button>
      ))}
    </div>
  );
}

export function Configurator() {
  const params = useSearchParams();
  const start = useMemo(() => startFromQuery(params), [params]);
  const [sector, setSector] = useState<Sector | null>(start.sector);
  const [crew, setCrew] = useState<Crew>(() => (start.sector ? defaultCrew(start.sector, start.robot) : {}));
  const [step, setStep] = useState<"kies" | "gegevens">("kies");
  const variant = useVariant();
  const quote = quoteCrew(crew, variant);
  const formTop = useRef<HTMLHeadingElement>(null);
  const crewBox = useRef<HTMLElement>(null);
  const [crewInView, setCrewInView] = useState(false);
  const changed = useRef(false);
  const started = useRef(false);

  useEffect(() => {
    setSector(start.sector);
    if (start.sector) setCrew(defaultCrew(start.sector, start.robot));
  }, [start]);

  useEffect(() => {
    if (started.current || !sector) return;
    started.current = true;
    track("configurator_start", { sector });
  }, [sector]);

  useEffect(() => {
    if (!changed.current) return;
    const id = setTimeout(() => track("crew_changed", { sector: sector ?? "", robots: crewSummary(crew), maandbedrag: Math.round(quote.totalMonth) }), 600);
    return () => clearTimeout(id);
  }, [crew, sector, quote.totalMonth]);

  // De prijsbalk op mobiel verdwijnt zodra het overzicht zelf in beeld is, of erboven ligt.
  useEffect(() => {
    const el = crewBox.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCrewInView(e.isIntersecting || e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [step]);

  function pickSector(s: Sector) {
    if (s === sector) return;
    changed.current = true;
    setSector(s);
    setCrew(defaultCrew(s));
  }

  function setPick(slug: RobotKind, patch: Partial<CrewPick>) {
    changed.current = true;
    setCrew((cur) => ({ ...cur, [slug]: { ...cur[slug]!, ...patch } }));
  }

  function goToForm() {
    if (!quote.totalMonth) return;
    setStep("gegevens");
    requestAnimationFrame(() => formTop.current?.focus());
  }

  const conf = sector ? getConfiguratorSector(sector)! : null;
  const total = formatEuro(quote.totalMonth);

  const lines: ReactNode = (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {quote.lines.map((l) => (
        <li key={l.slug} className="flex justify-between gap-3 text-[15px]">
          <span className="opacity-80">{lineLabel(l, getRobot(l.slug)!)}</span>
          <span className="shrink-0 font-bold">{formatEuro(l.month)}</span>
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
            <section className="flex flex-col gap-4 rounded-[26px] border-2 border-ink bg-paper p-5 sm:p-6" aria-labelledby="c-sector">
              <h2 id="c-sector" className="m-0 text-[clamp(24px,2.4vw,28px)] font-black">{c.sectorTitle}</h2>
              <div className="grid gap-2.5 sm:grid-cols-3" role="group" aria-labelledby="c-sector">
                {configurator.sectors.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={sector === s.id}
                    onClick={() => pickSector(s.id)}
                    className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[18px] border-2 border-line bg-paper p-3 text-left text-base font-bold aria-pressed:border-ink aria-pressed:bg-[#FFE1D3]"
                  >
                    <span className="flex -space-x-3" aria-hidden="true">
                      {s.robots.map((r) => (
                        <RobotMedia key={r} kind={r} size={36} label="" />
                      ))}
                    </span>
                    {s.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-3 rounded-[26px] border-2 border-ink bg-paper p-5 sm:p-6" aria-labelledby="c-robots">
              <h2 id="c-robots" className="m-0 text-[clamp(24px,2.4vw,28px)] font-black">{c.robotsTitle}</h2>
              {!conf && <p className="m-0 text-base text-muted-2">{c.pickSectorFirst}</p>}
              {conf?.robots.map((slug) => {
                const r = getRobot(slug)!;
                const pick = crew[slug] ?? { count: 0 };
                const n = pick.count;
                const price = priceFor(r, variant)!;
                return (
                  <div key={slug} className="flex flex-col gap-3 rounded-[20px] bg-stone p-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="hidden size-20 shrink-0 items-end justify-center overflow-hidden rounded-2xl pt-2 sm:flex" style={{ background: r.tint }}>
                        <RobotMedia kind={slug} size={70} label="" />
                      </div>
                      <div className="min-w-0 flex-1 pl-1 sm:pl-0">
                        <div className="font-display text-2xl font-black leading-tight">
                          <Link href={`/robots/${slug}`} className="no-underline hover:underline">{r.name}</Link>
                          <span className="block font-sans text-sm font-semibold sm:inline sm:text-base">
                            <span className="hidden sm:inline">, </span>
                            {r.role.toLowerCase()}
                          </span>
                        </div>
                        <div className="text-sm text-muted-2">{priceLabel(r, price)}</div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2" role="group" aria-label={c.count(r.name)}>
                        <button type="button" onClick={() => setPick(slug, { count: Math.max(0, n - 1) })} disabled={n === 0} aria-label={c.less(r.name)} className="size-11 cursor-pointer rounded-full border-2 border-ink bg-paper text-2xl font-bold disabled:cursor-not-allowed disabled:opacity-40 sm:size-12">−</button>
                        <output aria-live="polite" aria-label={c.count(r.name)} className="min-w-7 text-center font-display text-[26px] font-black sm:min-w-8 sm:text-[28px]">{n}</output>
                        <button type="button" onClick={() => setPick(slug, { count: Math.min(MAX, n + 1) })} disabled={n === MAX} aria-label={c.more(r.name)} className="size-11 cursor-pointer rounded-full border-2 border-ink bg-ink text-2xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:size-12">+</button>
                      </div>
                    </div>
                    {n > 0 && r.pricing !== "maand" && (
                      <div className="flex flex-col gap-2 border-t-2 border-dashed border-line pt-3 sm:ml-24 sm:flex-row sm:flex-wrap sm:gap-x-6">
                        {r.pricing === "dienstuur" && (
                          <Choice label={c.hours} value={pick.hours ?? HOURS.at(-1)!} options={HOURS} render={c.hoursOpt} onChange={(v) => setPick(slug, { hours: v })} />
                        )}
                        <Choice label={c.nights} value={pick.nights ?? NIGHTS[0]} options={NIGHTS} render={(v) => c.nightsOpt[v]} onChange={(v) => setPick(slug, { nights: v })} />
                      </div>
                    )}
                  </div>
                );
              })}
              {conf && conf.pilotOnly.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                  <h3 className="m-0 font-sans text-sm font-bold tracking-normal">
                    {c.pilotTitle} <span className="font-normal text-muted-2">{c.pilotText}</span>
                  </h3>
                  {conf.pilotOnly.map((slug) => {
                    const r = getRobot(slug)!;
                    return (
                      <div key={slug} className="flex flex-wrap items-center gap-3 rounded-[20px] border-2 border-dashed border-line p-3">
                        <div className="flex size-14 shrink-0 items-end justify-center overflow-hidden rounded-xl pt-1" style={{ background: r.tint }}>
                          <RobotMedia kind={slug} size={50} label="" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-display text-xl font-black leading-tight">{r.name}</div>
                          <div className="text-sm text-muted-2">{r.role}</div>
                        </div>
                        <Link href={`/robots/${slug}#aanmelden`} className="text-sm font-bold max-sm:w-full max-sm:pl-[68px]">{t.robotsPage.joinPilot}<span className="sr-only">: {r.name}</span></Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <aside ref={crewBox} id="ploeg" className="on-dark flex w-full flex-[1_1_340px] scroll-mt-4 flex-col gap-4 rounded-[26px] bg-ink p-6 text-white sm:p-7 lg:sticky lg:top-6" aria-labelledby="c-crew">
            <h2 id="c-crew" className="m-0 text-[28px] font-black text-white">{c.crewTitle}</h2>
            {quote.lines.length ? lines : <p className="m-0 text-[15px] text-[#CFCFCF]">{sector ? c.empty : c.pickSectorFirst}</p>}
            <div className="flex flex-col gap-1 border-t border-[#3A3A3A] pt-4" aria-live="polite">
              <span className="text-sm text-[#CFCFCF]">{c.perMonth}</span>
              <span className="font-display text-[clamp(48px,5vw,64px)] font-black leading-none text-brand">{total}</span>
            </div>
            {sector === "beveiliging" && <p className="m-0 text-sm font-semibold text-white">{c.callout}</p>}
            <div className="flex flex-col gap-1 rounded-[18px] bg-[#222222] p-4">
              <span className="text-sm text-[#CFCFCF]">{c.avoidedLabel}</span>
              <span className="font-display text-[clamp(22px,6vw,28px)] font-black text-white">{c.avoided(formatEuro(quote.avoidedMonth))}</span>
              <span className="text-xs leading-normal text-[#B5B5B5]">{avoidedNote}</span>
            </div>
            <button type="button" onClick={goToForm} disabled={!quote.totalMonth} className="btn bg-brand text-ink">
              {c.toForm}
            </button>
            <span className="text-center text-[13px] text-[#B5B5B5]">{c.smallPrint}</span>
          </aside>

          {/* Op mobiel staat het overzicht onderaan; deze balk houdt het maandbedrag in beeld. */}
          {sector && (
            <div className={`on-dark fixed inset-x-0 bottom-0 z-20 border-t border-[#3A3A3A] bg-ink px-4 py-3 text-white transition-transform lg:hidden ${crewInView ? "translate-y-full" : ""}`} aria-hidden="true">
              <div className="mx-auto flex max-w-[640px] items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-xs text-[#CFCFCF]">{c.perMonth}</span>
                  <span className="font-display text-[28px] font-black leading-none text-brand">{total}</span>
                </div>
                <a href="#ploeg" tabIndex={-1} className="btn bg-brand px-5 py-3 text-base text-ink hover:text-ink">
                  {c.crewTitle}
                </a>
              </div>
            </div>
          )}
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
                sector: sector ?? "",
                crew: Object.fromEntries(quote.lines.map((l) => [l.slug, { count: l.count, nights: l.nights, hours: l.hours }])),
                priceMonth: quote.totalMonth,
              })}
              event={{
                name: "request_submitted",
                props: { sector: sector ?? "", robots: crewSummary(crew), maandbedrag: Math.round(quote.totalMonth) },
              }}
              before={
                <button type="button" onClick={() => setStep("kies")} className="btn border-ink bg-paper text-ink">
                  {c.back}
                </button>
              }
            >
              <TextField label={t.forms.name} name="name" autoComplete="name" />
              <TextField label={t.forms.orgAndPlace} name="organisation" autoComplete="organization" />
              <TextField label={t.forms.size} name="size" inputMode="numeric" optional />
              <TextArea label={t.forms.backlog} name="backlog" optional />
              <Row>
                <TextField label={t.forms.email} name="email" type="email" autoComplete="email" />
                <TextField label={t.forms.phone} name="phone" type="tel" autoComplete="tel" optional />
              </Row>
            </LeadForm>
          </div>
          <aside className="flex w-full flex-[1_1_340px] flex-col gap-3 rounded-[26px] bg-stone p-6 lg:sticky lg:top-6" aria-labelledby="c-request">
            <h2 id="c-request" className="m-0 text-2xl font-black">{c.yourRequest}</h2>
            <p className="m-0 text-sm font-semibold text-muted-2">{conf?.label}</p>
            {lines}
            <div className="flex justify-between border-t-2 border-ink pt-3 text-lg font-bold">
              <span>{c.perMonth}</span>
              <span>{total}</span>
            </div>
            {sector === "beveiliging" && <p className="m-0 text-sm text-muted-2">{c.callout}</p>}
          </aside>
        </div>
      )}
    </div>
  );
}
