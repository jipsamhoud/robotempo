import { AVATAR_LABELS, AVATAR_SHAPES, resolveFill } from "@/lib/avatars";
import type { RobotKind } from "@/lib/robots";

const camel = (k: string) => k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

interface Props {
  kind: RobotKind;
  /** Breedte en hoogte in px. */
  size: number;
  /** Later: een 3D-render of foto. Zelfde props, een andere bron. */
  src?: string;
  /** Lege string maakt het personage decoratief. */
  label?: string;
  className?: string;
  /** Schaal mee met het vak, tot maximaal `size`. */
  fluid?: boolean;
}

/**
 * Een robotpersonage. De figuur staat altijd op de onderkant van zijn vak.
 * Geef `src` mee om de SVG te vervangen door een beeld.
 */
export function RobotAvatar({ kind, size, src, label = AVATAR_LABELS[kind], className = "", fluid = false }: Props) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  const box = `flex items-end justify-center leading-none ${fluid ? "" : "shrink-0"} ${className}`;
  const dims = fluid ? { width: "100%", maxWidth: size, aspectRatio: "1 / 1" } : { width: size, height: size };

  if (src) {
    return (
      <span className={box} style={dims}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} width={size} height={size} className="block h-full w-full object-contain object-bottom" />
      </span>
    );
  }

  return (
    <span className={box} style={dims}>
      <svg viewBox="0 0 200 200" width={size} height={size} className="block h-full w-full overflow-visible" {...a11y}>
        {AVATAR_SHAPES[kind].map(([Tag, attrs], i) => {
          const props: Record<string, string | number> = {};
          for (const [k, v] of Object.entries(attrs)) props[camel(k)] = k === "fill" ? resolveFill(v, kind) : v;
          return <Tag key={i} {...props} />;
        })}
      </svg>
    </span>
  );
}
