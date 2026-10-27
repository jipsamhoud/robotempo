import type { Metadata } from "next";
import { ManufacturerForm } from "@/components/forms/ManufacturerForm";
import { PageHero, PageShell } from "@/components/PageShell";
import { t } from "@/messages";

const m = t.manufacturer;

export const metadata: Metadata = {
  title: "Robot inschrijven",
  description: m.intro,
  openGraph: { title: "Robot inschrijven | Robotempo", description: m.intro },
};

export default function FabrikantenPage() {
  return (
    <PageShell hero={<PageHero title={m.title} intro={m.intro} />}>
      <div className="wrap max-w-[920px] pb-20 pt-12 md:pb-[120px]">
        <ManufacturerForm />
      </div>
    </PageShell>
  );
}
