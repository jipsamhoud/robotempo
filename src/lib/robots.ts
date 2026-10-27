import data from "@/data/robots.json";

export type Sector = "hotel" | "zorg" | "beveiliging";
export type Status = "beschikbaar" | "pilot" | "wachtlijst";
export type RobotKind = "bram" | "mila" | "joop" | "wout" | "fenna" | "rik";
export type BaseRateKey = keyof typeof data.baseRates;
export type ShiftId = "nacht" | "dag" | "klok";

export interface Skill {
  name: string;
  note: string;
}

export interface Robot {
  slug: RobotKind;
  no: string;
  name: string;
  role: string;
  sectors: Sector[];
  shift: string;
  shiftShort: string;
  rate: number | null;
  productivity: number | null;
  baseRate: BaseRateKey | null;
  status: Status;
  tint: string;
  band: string;
  bandText: string;
  configurator: boolean;
  pitch: string;
  intro: string;
  can: Skill[];
  cannot: string[];
  pairing: string;
  tags: string[];
}

export interface Shift {
  id: ShiftId;
  label: string;
  sub: string;
  hours: number;
}

export const robots = data.robots as Robot[];
export const shifts = data.shifts as Shift[];
export const dayOptions = data.days;
export const baseRates = data.baseRates;
export const avoidedFactor = data.avoidedFactor;

export const configuratorRobots = robots.filter((r) => r.configurator);

export function getRobot(slug: string): Robot | undefined {
  return robots.find((r) => r.slug === slug);
}

export function robotsInSector(sector: Sector | "alle"): Robot[] {
  return sector === "alle" ? robots : robots.filter((r) => r.sectors.includes(sector));
}
