import { describe, expect, it } from "vitest";
import { formatEuro, formatRate, quoteCrew, rateFor, SECTOR_PRESETS } from "./pricing";
import { getRobot } from "./robots";

describe("quoteCrew", () => {
  it("rekent een hotelploeg met nachtdienst, 7 dagen, variant A", () => {
    const q = quoteCrew({ crew: { bram: 2, mila: 1 }, shift: "nacht", days: 7, variant: "a" });
    // Bram: 2 × 8 × 7 = 112 uur × 8,25 = 924. Mila: 1 × 8 × 7 = 56 uur × 4,95 = 277,20
    expect(q.hoursWeek).toBe(168);
    expect(q.costWeek).toBeCloseTo(1201.2, 6);
    expect(q.costMonth).toBeCloseTo((1201.2 * 52) / 12, 6);
    // Vermeden: 112 × 0,6 × 31,5 × 0,5 + 56 × 0,4 × 31,5 × 0,5 = 1058,4 + 352,8
    expect(q.avoidedWeek).toBeCloseTo(1411.2, 6);
    expect(q.lines.map((l) => [l.slug, l.hours])).toEqual([
      ["bram", 112],
      ["mila", 56],
    ]);
  });

  it("gebruikt het tarief van een nachtbeveiliger voor Wout", () => {
    const q = quoteCrew({ crew: { wout: 2 }, shift: "nacht", days: 7, variant: "a" });
    expect(q.hoursWeek).toBe(112);
    expect(q.costWeek).toBeCloseTo(2016, 6);
    expect(q.avoidedWeek).toBeCloseTo(112 * 1.0 * 52 * 0.5, 6);
  });

  it("rekent dagdienst en rond de klok met 5 dagen", () => {
    expect(quoteCrew({ crew: { joop: 1 }, shift: "dag", days: 5, variant: "a" }).hoursWeek).toBe(60);
    expect(quoteCrew({ crew: { joop: 1 }, shift: "klok", days: 5, variant: "a" }).hoursWeek).toBe(100);
  });

  it("variant B is 20% duurder, vermeden inhuur blijft gelijk", () => {
    const a = quoteCrew({ crew: { bram: 1 }, shift: "nacht", days: 7, variant: "a" });
    const b = quoteCrew({ crew: { bram: 1 }, shift: "nacht", days: 7, variant: "b" });
    expect(b.costWeek).toBeCloseTo(56 * 9.9, 6);
    expect(b.avoidedWeek).toBe(a.avoidedWeek);
  });

  it("negeert robots zonder tarief en lege aantallen", () => {
    const q = quoteCrew({ crew: { fenna: 3, rik: 1, bram: 0 }, shift: "nacht", days: 7, variant: "a" });
    expect(q.lines).toEqual([]);
    expect(q.costWeek).toBe(0);
  });

  it("de sectorploegen kloppen met de handoff", () => {
    expect(SECTOR_PRESETS.hotel.crew).toEqual({ bram: 2, mila: 1 });
    expect(SECTOR_PRESETS.zorg.crew).toEqual({ bram: 1, joop: 2 });
    expect(SECTOR_PRESETS.beveiliging).toMatchObject({ crew: { wout: 2 }, shift: "nacht" });
  });
});

describe("formatting", () => {
  it("rondt af en zet een punt als duizendtalscheiding", () => {
    expect(formatEuro(1201.2)).toBe("€1.201");
    expect(formatEuro(462)).toBe("€462");
    expect(formatEuro(1234567.5)).toBe("€1.234.568");
    expect(formatEuro(0)).toBe("€0");
  });

  it("toont uurtarieven zoals in de ontwerpen", () => {
    expect(formatRate(8.25)).toBe("€8,25");
    expect(formatRate(18)).toBe("€18");
    expect(formatRate(5.5)).toBe("€5,50");
  });

  it("rekent variant B per robot", () => {
    expect(rateFor(getRobot("mila")!, "b")).toBe(5.94);
    expect(rateFor(getRobot("wout")!, "b")).toBe(21.6);
    expect(rateFor(getRobot("fenna")!, "b")).toBeNull();
  });
});
