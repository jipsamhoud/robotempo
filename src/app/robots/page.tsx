import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHero, PageShell } from "@/components/PageShell";
import { Price } from "@/components/Price";
import { RobotList } from "@/components/RobotList";
import { robots } from "@/lib/robots";
import { t } from "@/messages";

const p = t.robotsPage;

export const metadata: Metadata = {
  title: "Onze robots",
  description: p.intro,
  openGraph: { title: "Onze robots | Robotempo", description: p.intro },
};

export default function RobotsPage() {
  const rates = Object.fromEntries(
    robots.map((r) => [r.slug, r.status === "wachtlijst" ? "Nog niet" : r.rate == null ? "Op aanvraag" : <Price robot={r} />]),
  );
  return (
    <PageShell hero={<PageHero title={p.title} intro={p.intro} />}>
      <div className="wrap pb-20 pt-10 md:pb-[120px]">
        <Suspense>
          <RobotList rates={rates} />
        </Suspense>
        <div className="on-dark mt-10 flex flex-wrap items-center justify-between gap-5 rounded-[26px] bg-ink p-8 text-white">
          <div className="flex max-w-[640px] flex-col gap-2">
            <h2 className="m-0 text-[clamp(28px,3vw,40px)] font-black leading-none text-white">{p.otherTitle}</h2>
            <p className="m-0 text-base text-[#CFCFCF]">{p.otherText}</p>
          </div>
          <Link href="/#pilot" className="btn bg-brand text-ink hover:text-ink">{p.otherCta}</Link>
        </div>
      </div>
    </PageShell>
  );
}
