import type { RobotKind } from "@/lib/robots";

/**
 * Echte beelden per robot. Zolang een veld leeg is, toont de site het SVG-personage.
 * Zet bestanden in /public/media en vul het pad in, bijvoorbeeld "/media/rex.mp4".
 */
export const MEDIA: Partial<Record<RobotKind, { image?: string; video?: string; poster?: string }>> = {
  rex: { image: "", video: "", poster: "" },
};
