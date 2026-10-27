import type { Metadata } from "next";
import { Suspense } from "react";
import { Configurator } from "@/components/Configurator";
import { PageHero, PageShell } from "@/components/PageShell";
import { t } from "@/messages";

export const metadata: Metadata = {
  title: "Stel je ploeg samen",
  description: t.configurator.intro,
  openGraph: { title: "Stel je ploeg samen | Robotempo", description: t.configurator.intro },
};

export default function InhurenPage() {
  return (
    <PageShell hero={<PageHero title={t.configurator.title} intro={t.configurator.intro} />}>
      <div className="wrap pb-20 pt-10 md:pb-[120px]">
        <Suspense>
          <Configurator />
        </Suspense>
      </div>
    </PageShell>
  );
}
