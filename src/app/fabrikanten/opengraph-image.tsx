import { ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "De robots van Robotempo op een rij, op oranje";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("Ben je fabrikant? Schrijf je robot in.");
}
