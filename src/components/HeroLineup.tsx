import Link from "next/link";
import { getRobot, type RobotKind } from "@/lib/robots";
import { RobotAvatar } from "./RobotAvatar";

const LINEUP: [RobotKind, number][] = [["mila", 270], ["bram", 230], ["rik", 280], ["wout", 255], ["joop", 250], ["fenna", 250]];
const BAND = 78;

/** De zes robots op een zwarte band. Op mobiel een horizontaal scrollende rij. */
export function HeroLineup() {
  return (
    <div style={{ backgroundImage: `linear-gradient(to top, #111111 ${BAND}px, transparent ${BAND}px)` }}>
      <ul className="wrap scrollbar-none m-0 flex list-none items-end snap-x snap-mandatory overflow-x-auto pt-14 md:overflow-visible" aria-label="De ploeg">
        {LINEUP.map(([kind, size]) => {
          const r = getRobot(kind)!;
          return (
            <li
              key={kind}
              className="min-w-[var(--m)] snap-start md:min-w-0"
              // Breedte naar verhouding van het personage, zodat de lengteverschillen blijven kloppen.
              style={{ flex: `${size} 1 0`, ["--m" as string]: `${Math.round(size * 0.62)}px` }}
            >
              <Link href={`/robots/${kind}`} className="group flex flex-col items-center text-white no-underline hover:text-white" aria-label={`${r.name}, ${r.role}`}>
                <span className="flex w-full justify-center px-1 transition-transform group-hover:-translate-y-1.5">
                  <RobotAvatar kind={kind} size={size} label="" fluid />
                </span>
                <span className="flex w-full flex-col items-center justify-center text-center" style={{ height: BAND }}>
                  <span className="font-display text-[22px] font-extrabold tracking-[-0.02em] group-hover:underline">{r.name}</span>
                  <span className="mt-0.5 text-[13px] text-[#A8A8A8]">{r.role}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
