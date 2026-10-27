import { ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Bram, Mila en Fenna op oranje";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("Robots voor hotels.", [["bram", 260], ["mila", 300], ["fenna", 280]]);
}
