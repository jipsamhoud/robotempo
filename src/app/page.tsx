import Link from "next/link";
import { Footer } from "@/components/Footer";
import { PilotForm } from "@/components/forms/PilotForm";
import { Header } from "@/components/Header";
import { HeroLineup } from "@/components/HeroLineup";
import { RobotAvatar } from "@/components/RobotAvatar";
import { TeamCard } from "@/components/TeamCard";
import { getRobot, robots, type RobotKind } from "@/lib/robots";
import { t } from "@/messages";

const h = t.home;

const SECTOR_TILES: { id: "hotel" | "zorg" | "beveiliging"; bg: string; dark?: boolean; crew: [RobotKind, number][] }[] = [
  { id: "hotel", bg: "bg-hotel", crew: [["bram", 170], ["mila", 220]] },
  { id: "zorg", bg: "bg-zorg", crew: [["joop", 220], ["bram", 170]] },
  { id: "beveiliging", bg: "bg-security", dark: true, crew: [["wout", 230]] },
];

export default function Home() {
  return (
    <>
      <div className="bg-brand">
        <Header />
        <main id="inhoud">
          <section aria-labelledby="hero-title">
            <div className="wrap flex flex-col gap-7 pt-10 sm:pt-14">
              <h1 id="hero-title" className="m-0 max-w-[1200px] text-[clamp(40px,11.5vw,168px)] font-black leading-[0.86]">
                {h.h1}
              </h1>
              <div className="flex flex-wrap items-end justify-between gap-7">
                <p className="m-0 max-w-[620px] text-xl font-medium leading-[1.4] sm:text-2xl">{h.intro}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/robots" className="btn bg-ink text-white hover:text-white">{h.ctaRobots}</Link>
                  <Link href="/inhuren" className="btn bg-paper text-ink hover:text-ink">{h.ctaCrew}</Link>
                </div>
              </div>
            </div>
            <HeroLineup />
          </section>
        </main>
      </div>

      <section className="bg-ink text-white" aria-label="Diensten">
        <ul className="wrap m-0 flex list-none flex-wrap items-center gap-x-[30px] gap-y-3.5 pb-[26px] pt-[22px] font-display text-[clamp(22px,3vw,30px)] font-extrabold tracking-[-0.02em]">
          {h.services.map((s, i) => (
            <li key={s} className="flex items-center gap-x-[30px]">
              {s}
              {i < h.services.length - 1 && <span className="text-brand" aria-hidden="true">●</span>}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ploeg">
        <div className="wrap flex flex-wrap items-end justify-between gap-10 pb-10 pt-20 md:pt-[120px]">
          <h2 id="ploeg" className="m-0 max-w-[900px] text-[clamp(44px,6vw,96px)] font-black leading-[0.9]">{h.teamTitle}</h2>
          <p className="m-0 max-w-[380px] text-[19px] leading-normal text-muted">{h.teamIntro}</p>
        </div>
        <div className="wrap grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-5 pb-20 md:pb-[120px]">
          {robots.map((r) => <TeamCard key={r.slug} robot={r} />)}
        </div>
      </section>

      <section id="sectoren" className="scroll-mt-4 bg-stone" aria-labelledby="sectoren-titel">
        <div className="wrap flex flex-col gap-12 py-20 md:py-[120px]">
          <h2 id="sectoren-titel" className="m-0 max-w-[1000px] text-[clamp(44px,6vw,96px)] font-black leading-[0.9]">{h.sectorsTitle}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-5">
            {SECTOR_TILES.map((tile) => {
              const copy = h.sectorTiles[tile.id];
              return (
                <Link
                  key={tile.id}
                  href={`/inhuren?sector=${tile.id}`}
                  className={`group flex min-h-[520px] flex-col gap-[18px] rounded-[32px] p-7 no-underline sm:p-9 ${tile.bg} ${tile.dark ? "on-dark text-white hover:text-white" : "text-ink hover:text-ink"}`}
                >
                  <span className={`kicker ${tile.dark ? "text-security-accent" : ""}`}>{t.sectors[tile.id]}</span>
                  <h3 className="m-0 text-[clamp(34px,3.2vw,44px)] font-black leading-[0.95]">{copy.title}</h3>
                  <div className="flex min-h-[260px] flex-1 items-end justify-center gap-6">
                    {tile.crew.map(([kind, size]) => (
                      <div key={kind} className="flex min-w-0 flex-col items-center gap-2.5" style={{ flex: `${size} 1 0`, maxWidth: size }}>
                        <RobotAvatar kind={kind} size={size} fluid />
                        <span
                          className={`rounded-full border-2 px-3.5 py-[5px] font-display text-base font-extrabold ${tile.dark ? "border-security-accent bg-security-accent text-ink" : "border-ink bg-paper"}`}
                        >
                          {getRobot(kind)!.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="text-[17px] font-bold underline decoration-2 underline-offset-4 group-hover:decoration-4">{copy.cta}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="werkwijze" className="scroll-mt-4" aria-labelledby="werkwijze-titel">
        <div className="wrap flex flex-col gap-14 py-20 md:py-[120px]">
          <h2 id="werkwijze-titel" className="m-0 max-w-[1100px] text-[clamp(40px,6vw,96px)] font-black leading-[0.9]">{h.howTitle}</h2>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] border-t-2 border-ink p-0">
            {h.steps.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-3.5 pr-8 pt-8">
                <span className="font-display text-[clamp(72px,7vw,96px)] font-black leading-[0.9] text-brand" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="m-0 text-[32px] font-extrabold">{s.title}</h3>
                <p className="m-0 text-lg leading-[1.55] text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="belofte" className="scroll-mt-4 bg-brand" aria-labelledby="belofte-titel">
        <div className="wrap flex flex-col gap-14 py-20 md:py-[120px]">
          <h2 id="belofte-titel" className="m-0 max-w-[1150px] text-[clamp(40px,5.6vw,88px)] font-black leading-[0.95]">{h.promise}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-5">
            {h.guarantees.map((g) => (
              <div key={g.title} className="flex flex-col gap-2.5 rounded-[26px] bg-paper p-[30px]">
                <h3 className="m-0 text-[26px] font-extrabold">{g.title}</h3>
                <p className="m-0 text-[17px] leading-normal text-muted">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="eerlijk">
        <div className="wrap flex flex-wrap gap-12 py-20 md:py-[120px]">
          <div className="flex flex-[1_1_420px] flex-col gap-[18px]">
            <h2 id="eerlijk" className="m-0 text-[clamp(40px,5vw,80px)] font-black leading-[0.92]">{h.honestTitle}</h2>
            <p className="m-0 max-w-[460px] text-[19px] leading-normal text-muted">{h.honestIntro}</p>
          </div>
          <div className="grid flex-[1_1_560px] grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-5">
            <div className="rounded-[26px] border-2 border-ink p-7">
              <h3 className="mb-3.5 mt-0 text-2xl font-extrabold">{h.canTitle}</h3>
              <ul className="m-0 pl-5 text-[17px] leading-[1.85] text-muted">{h.can.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
            <div className="rounded-[26px] border-2 border-ink bg-stone p-7">
              <h3 className="mb-3.5 mt-0 text-2xl font-extrabold">{h.cannotTitle}</h3>
              <ul className="m-0 pl-5 text-[17px] leading-[1.85] text-muted">{h.cannot.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section id="pilot" className="on-dark scroll-mt-4 bg-ink text-white" aria-labelledby="pilot-titel">
        <div className="wrap flex flex-wrap items-start gap-14 py-20 md:py-[120px]">
          <div className="flex flex-[1_1_480px] flex-col gap-[22px]">
            <span className="kicker text-brand">{h.pilotKicker}</span>
            <h2 id="pilot-titel" className="m-0 text-[clamp(52px,7vw,120px)] font-black leading-[0.88] text-white">{h.pilotTitle}</h2>
            <p className="m-0 max-w-[520px] text-xl leading-normal text-[#CFCFCF]">{h.pilotText}</p>
          </div>
          <div className="min-w-0 flex-[1_1_440px]">
            <PilotForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
