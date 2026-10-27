import Link from "next/link";
import type { Robot } from "@/lib/robots";
import { t } from "@/messages";
import { Barcode } from "./Barcode";
import { rateLabel } from "./Price";
import { RobotAvatar } from "./RobotAvatar";

/** Personeelspas van een robot. */
export function TeamCard({ robot }: { robot: Robot }) {
  return (
    <Link
      href={`/robots/${robot.slug}`}
      className="group flex flex-col overflow-hidden rounded-[26px] border-2 border-ink bg-paper text-ink no-underline transition-transform hover:-translate-y-1 hover:text-ink"
    >
      <div className="kicker flex items-center justify-between gap-3 whitespace-nowrap px-[18px] py-3 text-xs" style={{ background: robot.band, color: robot.bandText }}>
        <span>{t.home.employee} {robot.no}</span>
        <span>{t.status[robot.status]}</span>
      </div>
      <div className="flex h-[250px] items-end justify-center overflow-hidden pt-[22px]" style={{ background: robot.tint }}>
        <RobotAvatar kind={robot.slug} size={220} label="" />
      </div>
      <div className="flex flex-col gap-1.5 p-[22px]">
        <h3 className="m-0 font-display text-[40px] font-black leading-none tracking-[-0.03em] group-hover:underline group-hover:decoration-4 group-hover:underline-offset-4">{robot.name}</h3>
        <div className="text-[17px] font-semibold">{robot.role}</div>
        <div className="text-[15px] text-muted-2">{robot.shiftShort}</div>
        <div className="mt-3 flex items-center justify-between gap-4 border-t-2 border-dashed border-line pt-3.5">
          <span className="text-[17px] font-bold">{rateLabel(robot)}</span>
          <Barcode />
        </div>
      </div>
    </Link>
  );
}
