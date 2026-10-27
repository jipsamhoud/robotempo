import type { Metadata } from "next";
import { SectorPage } from "@/components/SectorPage";
import { t } from "@/messages";

const copy = t.sectorPages.hotel;

export const metadata: Metadata = {
  title: "Robots voor hotels",
  description: copy.intro,
  openGraph: { title: "Robots voor hotels | Robotempo", description: copy.intro },
};

export default function HotelsPage() {
  return <SectorPage sector="hotel" robots={["bram", "mila", "fenna"]} hero={[["bram", 200], ["mila", 250], ["fenna", 220]]} copy={copy} />;
}
