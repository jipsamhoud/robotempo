import data from "@/data/robots.json";

export type Sector = "hotel" | "zorg" | "beveiliging";
export type Status = "beschikbaar" | "pilot" | "wachtlijst";
export type RobotKind = "bram" | "mila" | "joop" | "wout" | "rex" | "fenna" | "rik";
export type PricingModel = "nacht" | "dienstuur" | "maand" | "aanvraag" | "wachtlijst";

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
  pricing: PricingModel;
  price: number | null;
  priceLabel: string;
  priceScope: string;
  avoidedPerUnit: number | null;
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

export interface PricingModelInfo {
  label: string;
  unit: string | null;
  explain: string;
}

export interface ConfiguratorSector {
  id: Sector;
  label: string;
  robots: RobotKind[];
  default: Partial<Record<RobotKind, number>>;
  pilotOnly: RobotKind[];
}

export const robots = data.robots as Robot[];
export const pricingModels = data.pricingModels as Record<PricingModel, PricingModelInfo>;
export const avoidedNote = data.avoidedNote;
export const configurator = data.configurator as {
  sectors: ConfiguratorSector[];
  nightsPerWeek: number[];
  guardHoursPerNight: number[];
  weeksPerMonth: number;
};

export const SECTORS: Sector[] = ["hotel", "zorg", "beveiliging"];

export function getRobot(slug: string): Robot | undefined {
  return robots.find((r) => r.slug === slug);
}

export function robotsInSector(sector: Sector | "alle"): Robot[] {
  return sector === "alle" ? robots : robots.filter((r) => r.sectors.includes(sector));
}

export function getConfiguratorSector(id: string): ConfiguratorSector | undefined {
  return configurator.sectors.find((s) => s.id === id);
}
