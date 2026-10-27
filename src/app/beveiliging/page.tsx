import type { Metadata } from "next";
import { SectorPage } from "@/components/SectorPage";
import { t } from "@/messages";

const copy = t.sectorPages.beveiliging;

export const metadata: Metadata = {
  title: "Robots voor terreinen en beveiliging",
  description: copy.intro,
  openGraph: { title: "Robots voor terreinen en beveiliging | Robotempo", description: copy.intro },
};

export default function BeveiligingPage() {
  return (
    <SectorPage sector="beveiliging" robots={["wout", "rex"]} hero={[["wout", 230], ["rex", 300]]} copy={copy} heroCaption={copy.mediaCaption}
      after={
        <section className="border-t-2 border-ink" aria-labelledby="faq">
        <div className="wrap flex flex-wrap gap-10 py-16 md:py-24">
          <h2 id="faq" className="m-0 flex-[1_1_300px] text-[clamp(40px,5vw,80px)] font-black leading-[0.92]">{copy.faqTitle}</h2>
          <div className="flex flex-[1_1_560px] flex-col">
            {copy.faq.map((f) => (
              <details key={f.q} className="group border-b-2 border-ink py-5 first:border-t-2">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xl font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="font-display text-3xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="m-0 mt-3 max-w-[680px] text-lg leading-normal text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      }
    >
      <section className="on-dark bg-security text-white" aria-labelledby="keten">
        <div className="wrap flex flex-col gap-10 py-16 md:py-24">
          <h2 id="keten" className="m-0 text-[clamp(40px,5vw,80px)] font-black leading-[0.92] text-white">{copy.chainTitle}</h2>
          <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-5">
            {copy.chain.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-3 rounded-[26px] bg-[#22324F] p-6">
                <span className="font-display text-[56px] font-black leading-none text-security-accent" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="m-0 text-2xl font-extrabold text-white">{s.title}</h3>
                <p className="m-0 text-base leading-normal text-[#D5DBE5]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="voor-wie">
        <div className="wrap grid gap-5 py-16 md:py-24 lg:grid-cols-2">
          <div className="flex flex-col gap-5 rounded-[32px] border-2 border-ink p-7 sm:p-10">
            <h2 id="voor-wie" className="m-0 text-[clamp(32px,3.5vw,52px)] font-black leading-[0.95]">{copy.forWhoTitle}</h2>
            <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-lg leading-snug marker:text-brand">
              {copy.forWho.map((w) => <li key={w}>{w}</li>)}
            </ul>
            <p className="m-0 text-base text-muted">{copy.forWhoNote}</p>
          </div>
          <div className="flex flex-col gap-5 rounded-[32px] bg-stone p-7 sm:p-10">
            <h2 className="m-0 text-[clamp(32px,3.5vw,52px)] font-black leading-[0.95]">{copy.sharedTitle}</h2>
            <p className="m-0 text-lg leading-normal text-muted">{copy.sharedText}</p>
          </div>
          <div className="flex flex-col gap-4 rounded-[32px] bg-security p-7 text-white sm:p-10 lg:col-span-2">
            <span className="kicker text-security-accent">Vergunning</span>
            <h2 className="m-0 text-[clamp(32px,3.5vw,52px)] font-black leading-[0.95] text-white">{copy.partnerTitle}</h2>
            <p className="m-0 max-w-[820px] text-lg leading-normal text-[#D5DBE5]">{copy.partnerText}</p>
          </div>
        </div>
      </section>

    </SectorPage>
  );
}
