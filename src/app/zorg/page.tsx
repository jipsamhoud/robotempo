import type { Metadata } from "next";
import { SectorPage } from "@/components/SectorPage";
import { t } from "@/messages";

const copy = t.sectorPages.zorg;

export const metadata: Metadata = {
  title: "Robots voor de zorg",
  description: copy.intro,
  openGraph: { title: "Robots voor de zorg | Robotempo", description: copy.intro },
};

export default function ZorgPage() {
  return <SectorPage sector="zorg" robots={["joop", "bram"]} hero={[["joop", 260], ["bram", 210]]} copy={copy} />;
}
