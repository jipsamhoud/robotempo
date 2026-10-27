import { avoidedFactor, baseRates, configuratorRobots, shifts, type Robot, type ShiftId } from "./robots";

export type Variant = "a" | "b";

/** Prijstest: variant B is 20% duurder dan de tarieven uit robots.json. */
export const VARIANT_MULTIPLIER: Record<Variant, number> = { a: 1, b: 1.2 };

export type Crew = Partial<Record<string, number>>;

export interface CrewInput {
  crew: Crew;
  shift: ShiftId;
  days: number;
  variant: Variant;
}

export interface CrewLine {
  slug: string;
  name: string;
  count: number;
  hours: number;
  cost: number;
}

export interface CrewQuote {
  lines: CrewLine[];
  hoursWeek: number;
  costWeek: number;
  costMonth: number;
  avoidedWeek: number;
}

/** Uurtarief voor een robot in een prijsvariant, op centen afgerond. */
export function rateFor(robot: Pick<Robot, "rate">, variant: Variant): number | null {
  if (robot.rate == null) return null;
  return Math.round(robot.rate * VARIANT_MULTIPLIER[variant] * 100) / 100;
}

export function shiftHours(shift: ShiftId): number {
  const s = shifts.find((x) => x.id === shift);
  if (!s) throw new Error(`Onbekende dienst: ${shift}`);
  return s.hours;
}

/**
 * De berekening uit de handoff, §4:
 *   uren_robot_week = aantal × uren_per_dienst × dagen
 *   kosten_week     = Σ uren_robot_week × rate
 *   kosten_maand    = kosten_week × 52 / 12
 *   vermeden_inhuur = Σ uren_robot_week × productivity × baseRates[baseRate] × avoidedFactor
 */
export function quoteCrew({ crew, shift, days, variant }: CrewInput, pool: Robot[] = configuratorRobots): CrewQuote {
  const perShift = shiftHours(shift);
  const lines: CrewLine[] = [];
  let hoursWeek = 0;
  let costWeek = 0;
  let avoidedWeek = 0;

  for (const robot of pool) {
    const count = Math.max(0, Math.floor(crew[robot.slug] ?? 0));
    const rate = rateFor(robot, variant);
    if (!count || rate == null) continue;
    const hours = count * perShift * days;
    const cost = hours * rate;
    hoursWeek += hours;
    costWeek += cost;
    if (robot.productivity != null && robot.baseRate) {
      avoidedWeek += hours * robot.productivity * baseRates[robot.baseRate] * avoidedFactor;
    }
    lines.push({ slug: robot.slug, name: robot.name, count, hours, cost });
  }

  return { lines, hoursWeek, costWeek, costMonth: (costWeek * 52) / 12, avoidedWeek };
}

/** Bedrag in hele euro's, met een punt als duizendtalscheiding: €1.234 */
export function formatEuro(amount: number): string {
  return "€" + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Uurtarief: €18 of €8,25 */
export function formatRate(rate: number): string {
  return Number.isInteger(rate) ? `€${rate}` : `€${rate.toFixed(2).replace(".", ",")}`;
}

/** Startploegen voor ?sector=… */
export const SECTOR_PRESETS: Record<string, { crew: Crew; shift: ShiftId; days: number }> = {
  hotel: { crew: { bram: 2, mila: 1 }, shift: "nacht", days: 7 },
  zorg: { crew: { bram: 1, joop: 2 }, shift: "nacht", days: 7 },
  beveiliging: { crew: { wout: 2 }, shift: "nacht", days: 7 },
};

export const MAX_PER_ROBOT = 5;
