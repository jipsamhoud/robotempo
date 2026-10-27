import { ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Joop en Bram op oranje";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("Meer handen aan het bed.", [["joop", 300], ["bram", 260]]);
}
