import { MEDIA } from "@/data/media";
import { AVATAR_LABELS } from "@/lib/avatars";
import type { RobotKind } from "@/lib/robots";
import { RobotAvatar } from "./RobotAvatar";

/**
 * Een robot als video, foto of SVG-personage, in die volgorde van voorkeur.
 * Voor Rex komen er een echte foto en video; tot die er zijn toont dit het personage.
 */
export function RobotMedia({ kind, size, fluid, label }: { kind: RobotKind; size: number; fluid?: boolean; label?: string }) {
  const m = MEDIA[kind];
  if (m?.video) {
    return (
      <video
        className="block aspect-square w-full object-contain object-bottom"
        style={{ maxWidth: size }}
        src={m.video}
        poster={m.poster || undefined}
        autoPlay
        muted
        loop
        playsInline
        aria-label={label ?? AVATAR_LABELS[kind]}
      />
    );
  }
  return <RobotAvatar kind={kind} size={size} fluid={fluid} label={label} src={m?.image || undefined} />;
}
