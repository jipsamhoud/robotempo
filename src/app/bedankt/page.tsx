import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { Thanks } from "@/components/Thanks";

export const metadata: Metadata = { title: "Bedankt", robots: { index: false } };

export default function BedanktPage() {
  return (
    <PageShell
      hero={
        <div className="wrap pb-20 pt-10 md:pb-28">
          <Suspense>
            <Thanks />
          </Suspense>
        </div>
      }
    >
      {null}
    </PageShell>
  );
}
