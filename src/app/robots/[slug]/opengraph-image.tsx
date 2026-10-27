import { ogImage, ogSize } from "@/lib/og";
import { getRobot, robots } from "@/lib/robots";

export const dynamic = "force-static";
export const alt = "De robots van Robotempo op een rij, op oranje";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return robots.map((r) => ({ slug: r.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const r = getRobot((await params).slug)!;
  return ogImage(`Hoi, ik ben ${r.name}. ${r.role}.`);
}
