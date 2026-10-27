import { configurator, getRobot, type Robot, type RobotKind } from "./robots";

export type Variant = "a" | "b";

/**
 * Prijstest: variant B is 20% duurder dan robots.json,
 * afgerond op hele euro's, of op €0,50 bij het uurtarief.
 */
export function priceFor(robot: Pick<Robot, "price" | "pricing">, variant: Variant): number | null {
  if (robot.price == null) return null;
  if (variant === "a") return robot.price;
  const raised = robot.price * 1.2;
  return robot.pricing === "dienstuur" ? Math.round(raised * 2) / 2 : Math.round(raised);
}

/** Keuze per robot in de configurator. Nachten en uren gelden alleen voor de modellen die ze gebruiken. */
export interface CrewPick {
  count: number;
  nights?: number;
  hours?: number;
}

export type Crew = Partial<Record<RobotKind, CrewPick>>;

export interface CrewLine {
  slug: RobotKind;
  name: string;
  count: number;
  nights?: number;
  hours?: number;
  month: number;
  avoided: number;
}

export interface CrewQuote {
  lines: CrewLine[];
  totalMonth: number;
  avoidedMonth: number;
}

/** Eén robot per maand, volgens §5. `unit` is de prijs of het vermeden bedrag per eenheid. */
export function perMonth(robot: Robot, pick: CrewPick, unit: number, weeksPerMonth = configurator.weeksPerMonth): number {
  const n = Math.max(0, Math.floor(pick.count));
  switch (robot.pricing) {
    case "nacht":
      return n * (pick.nights ?? 7) * weeksPerMonth * unit;
    case "dienstuur":
      return n * (pick.hours ?? 12) * (pick.nights ?? 7) * weeksPerMonth * unit;
    case "maand":
      return n * unit;
    default:
      return 0;
  }
}

/**
 *   totaal_maand          = Σ per_maand(robot) met price
 *   totaal_vermeden_maand = Σ per_maand(robot) met avoidedPerUnit
 */
export function quoteCrew(crew: Crew, variant: Variant): CrewQuote {
  const lines: CrewLine[] = [];
  for (const [slug, pick] of Object.entries(crew) as [RobotKind, CrewPick][]) {
    const robot = getRobot(slug);
    const price = robot && priceFor(robot, variant);
    if (!robot || price == null || !pick.count) continue;
    lines.push({
      slug,
      name: robot.name,
      count: pick.count,
      nights: robot.pricing === "maand" ? undefined : pick.nights ?? 7,
      hours: robot.pricing === "dienstuur" ? pick.hours ?? 12 : undefined,
      month: perMonth(robot, pick, price),
      avoided: perMonth(robot, pick, robot.avoidedPerUnit ?? 0),
    });
  }
  return {
    lines,
    totalMonth: lines.reduce((s, l) => s + l.month, 0),
    avoidedMonth: lines.reduce((s, l) => s + l.avoided, 0),
  };
}

/** Bedrag in hele euro's, met een punt als duizendtalscheiding: €1.234 */
export function formatEuro(amount: number): string {
  return "€" + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Prijs zoals hij in robots.json staat: €75, €1.650 of €21,50 */
export function formatPrice(amount: number): string {
  return Number.isInteger(amount) ? formatEuro(amount) : `€${amount.toFixed(2).replace(".", ",")}`;
}

/** "Vanaf €75 per schone nacht", "€1.650 per maand", "€18 per dienstuur". Null bij pilot en wachtlijst. */
export function priceLabel(robot: Pick<Robot, "pricing">, amount: number): string | null {
  const p = formatPrice(amount);
  switch (robot.pricing) {
    case "nacht":
      return `Vanaf ${p} per schone nacht`;
    case "dienstuur":
      return `${p} per dienstuur`;
    case "maand":
      return `${p} per maand`;
    default:
      return null;
  }
}
