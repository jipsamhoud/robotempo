import type { Metadata } from "next";
import { FlexpoolForm } from "@/components/forms/FlexpoolForm";
import { PageHero, PageShell } from "@/components/PageShell";
import { t } from "@/messages";

const f = t.flexpool;

export const metadata: Metadata = {
  title: "Flexpool",
  description: f.intro,
  openGraph: { title: "Flexpool | Robotempo", description: f.intro },
};

export default function FlexpoolPage() {
  return (
    <PageShell hero={<PageHero title={f.title} intro={f.intro} />}>
      <div className="wrap flex flex-wrap items-start gap-10 py-14 md:py-20">
        <ul className="m-0 flex flex-[1_1_320px] list-none flex-col gap-4 p-0">
          {f.points.map((p) => (
            <li key={p.title} className="flex flex-col gap-2 rounded-[26px] bg-stone p-6">
              <h2 className="m-0 text-2xl font-extrabold">{p.title}</h2>
              <p className="m-0 text-base leading-normal text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-5">
          <h2 className="m-0 text-[clamp(36px,4vw,56px)] font-black leading-[0.95]">{f.formTitle}</h2>
          <FlexpoolForm />
        </div>
      </div>
    </PageShell>
  );
}
