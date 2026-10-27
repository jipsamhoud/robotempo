import { ogImage, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "Wout en Rex op oranje";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("De nachtploeg voor je terrein.", [["wout", 300], ["rex", 300]]);
}
