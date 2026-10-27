import Link from "next/link";
import type { ReactNode } from "react";
import { getRobot, type RobotKind, type Sector } from "@/lib/robots";
import { t } from "@/messages";
import { PageShell } from "./PageShell";
import { RobotCard } from "./RobotCard";
import { RobotMedia } from "./RobotMedia";
import { TrackView } from "./TrackView";

interface Props {
  sector: Sector;
  robots: RobotKind[];
  /** Personages in de hero, met hun grootte. */
  hero: [RobotKind, number][];
  copy: { kicker: string; title: string; intro: string; robotsTitle: string; togetherTitle: string; together: readonly string[]; flex: string; cta: string };
  /** Extra secties na de robots. */
  children?: ReactNode;
  /** Extra secties na "Mens en robot samen", zoals een FAQ. */
  after?: ReactNode;
  heroCaption?: string;
}

const TILE: Record<Sector, string> = { hotel: "bg-hotel", zorg: "bg-zorg", beveiliging: "bg-security" };

/** Landingspagina voor één sector, voor campagnes. */
export function SectorPage({ sector, robots, hero, copy, children, after, heroCaption }: Props) {
  const inhuren = `/inhuren?sector=${sector}`;
  return (
    <PageShell
      hero={
        <div className="wrap flex flex-wrap items-end gap-10 pb-14 pt-8 sm:pt-12 md:pb-20">
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-6">
            <span className="kicker">{copy.kicker}</span>
            <h1 className="m-0 text-[clamp(44px,6.5vw,104px)] font-black leading-[0.9]">{copy.title}</h1>
            <p className="m-0 max-w-[640px] text-xl font-medium leading-[1.4] sm:text-[22px]">{copy.intro}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={inhuren} className="btn bg-ink text-white hover:text-white">{copy.cta}</Link>
              <a href="#robots" className="btn bg-paper text-ink hover:text-ink">{t.sectorPages.seeRobots}</a>
            </div>
          </div>
          <figure className={`m-0 flex min-w-0 flex-[1_1_380px] flex-col gap-3 rounded-[32px] p-6 ${TILE[sector]}`}>
            <div className="flex min-h-[180px] items-end justify-center gap-4 sm:min-h-[280px]">
              {hero.map(([kind, size]) => (
                <div key={kind} className="flex min-w-0 flex-col items-center gap-2.5" style={{ flex: `${size} 1 0`, maxWidth: size }}>
                  <RobotMedia kind={kind} size={size} fluid />
                  <span className={`rounded-full border-2 px-3.5 py-[5px] font-display text-base font-extrabold ${sector === "beveiliging" ? "border-security-accent bg-security-accent text-ink" : "border-ink bg-paper"}`}>
                    {getRobot(kind)!.name}
                  </span>
                </div>
              ))}
            </div>
            {heroCaption && <figcaption className="text-center text-sm font-semibold text-white">{heroCaption}</figcaption>}
          </figure>
        </div>
      }
    >
      <TrackView event="sector_page_view" props={{ sector }} />

      <section id="robots" className="scroll-mt-4" aria-labelledby="robots-titel">
        <div className="wrap flex flex-col gap-8 py-16 md:py-24">
          <h2 id="robots-titel" className="m-0 text-[clamp(40px,5vw,80px)] font-black leading-[0.92]">{copy.robotsTitle}</h2>
          <ul className="m-0 flex list-none flex-col gap-5 p-0">
            {robots.map((slug) => (
              <li key={slug}><RobotCard robot={getRobot(slug)!} sector={sector} /></li>
            ))}
          </ul>
        </div>
      </section>

      {children}

      <section className="bg-brand" aria-labelledby="samen-titel">
        <div className="wrap flex flex-wrap gap-10 py-16 md:py-24">
          <h2 id="samen-titel" className="m-0 flex-[1_1_320px] text-[clamp(40px,5vw,80px)] font-black leading-[0.92]">{copy.togetherTitle}</h2>
          <ul className="m-0 flex flex-[1_1_480px] list-none flex-col gap-4 p-0">
            {copy.together.map((line) => (
              <li key={line} className="rounded-[26px] bg-paper p-6 text-lg font-medium leading-normal">{line}</li>
            ))}
          </ul>
        </div>
      </section>

      {after}

      <section className="bg-stone" aria-label={t.nav.flexpool}>
        <div className="wrap flex flex-wrap items-center justify-between gap-6 py-12">
          <p className="m-0 max-w-[760px] text-xl font-semibold leading-snug">{copy.flex}</p>
          <Link href="/flexpool" className="btn border-ink bg-paper text-ink">{t.sectorPages.flexCta}</Link>
        </div>
      </section>

      <section className="on-dark bg-ink text-white" aria-labelledby="slot-titel">
        <div className="wrap flex flex-wrap items-end justify-between gap-8 py-16 md:py-24">
          <div className="flex max-w-[760px] flex-col gap-4">
            <span className="kicker text-brand">{t.home.pilotKicker}</span>
            <h2 id="slot-titel" className="m-0 text-[clamp(44px,6vw,96px)] font-black leading-[0.9] text-white">{t.home.pilotTitle}</h2>
            <p className="m-0 text-lg text-[#CFCFCF]">{t.sectorPages.pilotNote}</p>
          </div>
          <Link href={inhuren} className="btn bg-brand text-ink hover:text-ink">{copy.cta}</Link>
        </div>
      </section>
    </PageShell>
  );
}
