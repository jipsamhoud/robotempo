import { rateFor } from "@/lib/pricing";
import { formatRate } from "@/lib/pricing";
import type { Robot } from "@/lib/robots";
import { t } from "@/messages";

/**
 * Toont een tarief in beide prijsvarianten. CSS toont de juiste, zonder flikkeren.
 * `format` maakt van het tarief de zichtbare tekst.
 */
export function Price({ robot, format = formatRate }: { robot: Pick<Robot, "rate">; format?: (rate: number) => string }) {
  const a = rateFor(robot, "a");
  const b = rateFor(robot, "b");
  if (a == null || b == null) return null;
  return (
    <>
      <span className="pv-a">{format(a)}</span>
      <span className="pv-b">{format(b)}</span>
    </>
  );
}

/** Een bedrag dat lineair met het tarief meeschaalt, zoals de kosten van een voorbeeldweek. */
export function ScaledAmount({ robot, render }: { robot: Pick<Robot, "rate">; render: (rate: number) => string }) {
  return <Price robot={robot} format={render} />;
}

export function rateLabel(robot: Robot, style: "from" | "plain" = "from") {
  if (robot.status === "wachtlijst") return t.price.notYet;
  if (robot.rate == null) return t.price.onRequest;
  return (
    <>
      {style === "from" ? `${t.price.from} ` : ""}
      <Price robot={robot} /> {t.price.perHour}
    </>
  );
}
