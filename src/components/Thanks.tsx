"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getRobot, type RobotKind } from "@/lib/robots";
import { t } from "@/messages";
import { RobotAvatar } from "./RobotAvatar";

const FORMS = ["aanvraag", "pilot", "wachtlijst", "flexpool", "fabrikant"] as const;

export function Thanks() {
  const params = useSearchParams();
  const raw = params.get("form");
  const form = (FORMS as readonly string[]).includes(raw ?? "") ? (raw as (typeof FORMS)[number]) : "pilot";
  const robot = getRobot(params.get("robot") ?? "");
  const kind: RobotKind = robot?.slug ?? (form === "fabrikant" ? "rik" : "bram");
  const copy = t.thanks[form];

  return (
    <div className="flex flex-wrap items-end gap-10">
      <div className="flex h-[280px] w-[280px] items-end justify-center overflow-hidden rounded-[26px] border-2 border-ink pt-6" style={{ background: getRobot(kind)!.tint }}>
        <RobotAvatar kind={kind} size={240} />
      </div>
      <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
        <h1 className="m-0 text-[clamp(44px,6vw,96px)] font-black leading-[0.9]">{copy.title}</h1>
        <p className="m-0 max-w-[640px] text-xl font-medium leading-[1.45]">{copy.text}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn bg-ink text-white hover:text-white">{t.thanks.home}</Link>
          <Link href="/robots" className="btn bg-paper text-ink hover:text-ink">{t.thanks.robots}</Link>
        </div>
      </div>
    </div>
  );
}
