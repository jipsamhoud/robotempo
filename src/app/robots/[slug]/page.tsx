import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import { PageShell } from "@/components/PageShell";
import { Price } from "@/components/Price";
import { RobotAvatar } from "@/components/RobotAvatar";
import { TrackView } from "@/components/TrackView";
import { formatEuro, formatRate } from "@/lib/pricing";
import { getRobot, robots, type Robot } from "@/lib/robots";
import { t } from "@/messages";

const p = t.profile;

/** Voorbeeldweek: uren per dienst volgen de diensttijden in robots.json. */
const EXAMPLE: Partial<Record<Robot["slug"], { unit: string; hours: number }>> = {
  bram: { unit: "nacht", hours: 8 }, // 22.00 tot 06.00
  mila: { unit: "dag", hours: 12 }, // dagdienst 07.00 tot 19.00
  joop: { unit: "dag", hours: 12 }, // 07.00 tot 19.00
  wout: { unit: "nacht", hours: 12 }, // 19.00 tot 07.00
};

const STATUS_BG: Record<Robot["status"], string> = { beschikbaar: "#BFEBD8", pilot: "#FFE08A", wachtlijst: "#E6E4E0" };

export function generateStaticParams() {
  return robots.map((r) => ({ slug: r.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = getRobot((await params).slug);
  if (!r) return {};
  const title = `${r.name}, ${r.role.toLowerCase()}`;
  return { title, description: r.pitch, openGraph: { title: `${title} | Robotempo`, description: r.pitch } };
}

function worksIn(r: Robot) {
  const names = r.sectors.map((s) => t.sectorsLong[s]);
  const text = names.length > 1 ? `${names.slice(0, -1).join(", ")} en ${names.at(-1)}` : names[0];
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const r = getRobot((await params).slug);
  if (!r) notFound();

  const hireable = r.status === "beschikbaar";
  const example = EXAMPLE[r.slug];
  const rows = example
    ? [
        { label: p.every(example.unit, example.hours), hours: example.hours * 7 },
        { label: p.weekdays(example.hours), hours: example.hours * 5 },
      ]
    : [];

  const facts: [string, React.ReactNode][] = [
    [p.role, r.role],
    [p.shift, r.shift],
    [p.worksIn, worksIn(r)],
    [
      p.rate,
      r.rate != null ? (
        <>
          <Price robot={r} />, {t.price.allIn}
          {r.slug === "wout" && <>, {t.price.withControl}</>}
        </>
      ) : r.status === "pilot" ? t.price.onRequest : t.price.notYet,
    ],
    [p.available, hireable ? p.availableFrom : r.status === "pilot" ? p.pilotFrom : p.notYet],
  ];

  return (
    <PageShell
      hero={
        <div className="wrap pb-2 pt-2">
          <Link href="/robots" className="inline-flex min-h-12 items-center gap-2 font-bold">
            <span aria-hidden="true">←</span> {p.back}
          </Link>
        </div>
      }
    >
      <TrackView event="robot_profile_view" props={{ slug: r.slug }} />
      <div className="bg-brand">
        <div className="wrap flex flex-wrap items-start gap-10 pb-16 pt-6">
          <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-4 max-lg:order-2 lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-[26px] border-2 border-ink bg-paper">
              <div className="kicker flex items-center justify-between gap-3 whitespace-nowrap px-[18px] py-3 text-xs" style={{ background: r.band, color: r.bandText }}>
                <span>{t.home.employee} {r.no}</span>
                <span>{t.status[r.status]}</span>
              </div>
              <div className="flex h-[340px] items-end justify-center overflow-hidden pt-8" style={{ background: r.tint }}>
                <RobotAvatar kind={r.slug} size={300} />
              </div>
              <dl className="m-0 flex flex-col gap-3 p-6 text-[15px]">
                {facts.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b-2 border-dashed border-line pb-3 last:border-0 last:pb-0">
                    <dt className="text-muted-2">{k}</dt>
                    <dd className="m-0 text-right font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="px-6 pb-6">
                {hireable ? (
                  <Link href={`/inhuren?robot=${r.slug}`} className="btn w-full bg-ink text-white hover:text-white">{t.robotsPage.hire(r.name)}</Link>
                ) : (
                  <a href="#aanmelden" className="btn w-full bg-ink text-white hover:text-white">
                    {r.status === "pilot" ? t.robotsPage.joinPilot : t.robotsPage.joinWaitlist}
                  </a>
                )}
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
            <span className="kicker self-start rounded-full px-3 py-1.5 text-xs" style={{ background: STATUS_BG[r.status] }}>{t.status[r.status]}</span>
            <h1 className="m-0 text-[clamp(56px,8vw,128px)] font-black leading-[0.88]">{p.hello(r.name)}</h1>
            <p className="m-0 max-w-[720px] text-xl font-medium leading-[1.45] sm:text-[22px]">{r.intro}</p>
          </div>
        </div>
      </div>

      <div className="wrap flex max-w-[1320px] flex-col gap-16 py-16 md:py-24">
        {r.can.length > 0 && (
          <section aria-labelledby="kan" className="flex flex-col gap-6">
            <h2 id="kan" className="m-0 text-[clamp(36px,4.5vw,64px)] font-black leading-[0.95]">{p.canTitle}</h2>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-4 p-0">
              {r.can.map((s) => (
                <li key={s.name} className="flex flex-col gap-2 rounded-[26px] border-2 border-ink p-6">
                  <span className="flex items-center gap-2.5 text-lg font-bold">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0C7A57" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                    {s.name}
                  </span>
                  <span className="text-[15px] leading-normal text-muted">{s.note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="niet" className="flex flex-wrap gap-10 rounded-[32px] bg-stone p-7 sm:p-10">
          <h2 id="niet" className="m-0 flex-[1_1_300px] text-[clamp(36px,4.5vw,64px)] font-black leading-[0.95]">{p.cannotTitle}</h2>
          <div className="flex flex-[1_1_420px] flex-col gap-4">
            <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-lg leading-snug text-muted marker:text-ink">
              {r.cannot.map((c) => <li key={c}>{c}</li>)}
            </ul>
            {r.pairing && <p className="m-0 text-base font-semibold">{r.pairing}</p>}
          </div>
        </section>

        {rows.length > 0 && (
          <section aria-labelledby="week" className="flex flex-col gap-6">
            <h2 id="week" className="m-0 text-[clamp(36px,4.5vw,64px)] font-black leading-[0.95]">{p.weekTitle(r.name)}</h2>
            <div className="overflow-hidden rounded-[26px] border-2 border-ink">
              <table className="w-full border-collapse text-[15px] sm:text-base">
                <caption className="sr-only">{p.weekTitle(r.name)}, tarief <Price robot={r} /> per uur</caption>
                <thead>
                  <tr className="bg-ink text-left text-white">
                    <th scope="col" className="px-3 py-4 sm:px-5">{p.weekExample}</th>
                    <th scope="col" className="px-3 py-4 sm:px-5">{p.weekHours}</th>
                    <th scope="col" className="px-3 py-4 sm:px-5">{p.weekCost}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-t-2 border-ink">
                      <th scope="row" className="px-3 py-4 sm:px-5 text-left font-semibold">{row.label}</th>
                      <td className="px-3 py-4 sm:px-5">{row.hours}</td>
                      <td className="px-3 py-4 sm:px-5 font-display text-xl font-black sm:text-2xl">
                        <Price robot={r} format={(rate) => formatEuro(row.hours * rate)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="m-0 text-sm text-muted-2">
              {r.rate != null && <>Uurtarief <Price robot={r} format={formatRate} />, alles inbegrepen. </>}
              Je betaalt alleen de uren die {r.name} werkt.
            </p>
          </section>
        )}

        {!hireable && (
          <section id="aanmelden" aria-labelledby="aanmelden-titel" className="flex scroll-mt-6 flex-wrap gap-10">
            <div className="flex flex-[1_1_320px] flex-col gap-4">
              <h2 id="aanmelden-titel" className="m-0 text-[clamp(36px,4.5vw,64px)] font-black leading-[0.95]">
                {r.status === "pilot" ? p.pilotFormTitle(r.name) : p.waitFormTitle(r.name)}
              </h2>
              <p className="m-0 text-lg leading-normal text-muted">{r.status === "pilot" ? p.pilotFormText : p.waitFormText}</p>
            </div>
            <div className="min-w-0 flex-[1_1_440px]">
              <WaitlistForm robot={r} />
            </div>
          </section>
        )}

        <section aria-labelledby="refs" className="on-dark flex flex-col gap-3 rounded-[26px] bg-ink p-7 text-white sm:p-9">
          <h2 id="refs" className="m-0 text-[32px] font-black text-white">{p.refsTitle}</h2>
          <p className="m-0 max-w-[760px] text-lg leading-normal text-[#CFCFCF]">
            {r.status === "wachtlijst" ? p.refsTextFuture(r.name) : p.refsText(r.name)}
          </p>
        </section>
      </div>
    </PageShell>
  );
}
