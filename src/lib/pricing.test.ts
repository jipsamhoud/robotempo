import { describe, expect, it } from "vitest";
import { formatEuro, formatPrice, perMonth, priceFor, priceLabel, quoteCrew } from "./pricing";
import { getConfiguratorSector, getRobot } from "./robots";

const W = 4.33;
const bram = getRobot("bram")!;
const mila = getRobot("mila")!;
const joop = getRobot("joop")!;
const wout = getRobot("wout")!;

describe("prijsmodel per schone nacht (Bram)", () => {
  it("aantal × nachten × weken per maand × prijs", () => {
    expect(perMonth(bram, { count: 1, nights: 7 }, 75)).toBeCloseTo(1 * 7 * W * 75, 6);
    expect(perMonth(bram, { count: 2, nights: 5 }, 75)).toBeCloseTo(2 * 5 * W * 75, 6);
  });
  it("vermeden inhuur met avoidedPerUnit", () => {
    const q = quoteCrew({ bram: { count: 1, nights: 7 } }, "a");
    expect(q.avoidedMonth).toBeCloseTo(7 * W * 87, 6);
  });
});

describe("prijsmodel per dienstuur (Wout)", () => {
  it("aantal × uren × nachten × weken per maand × prijs", () => {
    expect(perMonth(wout, { count: 2, hours: 12, nights: 7 }, 18)).toBeCloseTo(2 * 12 * 7 * W * 18, 6);
    expect(perMonth(wout, { count: 1, hours: 8, nights: 5 }, 18)).toBeCloseTo(8 * 5 * W * 18, 6);
  });
  it("vermeden inhuur", () => {
    const q = quoteCrew({ wout: { count: 1, hours: 12, nights: 7 } }, "a");
    expect(q.totalMonth).toBeCloseTo(12 * 7 * W * 18, 6);
    expect(q.avoidedMonth).toBeCloseTo(12 * 7 * W * 26, 6);
  });
});

describe("prijsmodel per maand (Mila, Joop)", () => {
  it("aantal × prijs, nachten doen niet mee", () => {
    expect(perMonth(mila, { count: 2, nights: 5 }, 1650)).toBe(3300);
    expect(perMonth(joop, { count: 1 }, 2250)).toBe(2250);
  });
});

describe("quoteCrew", () => {
  it("telt een hotelploeg op", () => {
    const q = quoteCrew({ bram: { count: 1, nights: 7 }, mila: { count: 1 } }, "a");
    expect(q.totalMonth).toBeCloseTo(7 * W * 75 + 1650, 6);
    expect(q.avoidedMonth).toBeCloseTo(7 * W * 87 + 2100, 6);
    expect(q.lines.map((l) => l.slug)).toEqual(["bram", "mila"]);
  });
  it("negeert pilot- en wachtlijstrobots en lege aantallen", () => {
    const q = quoteCrew({ rex: { count: 2 }, fenna: { count: 1 }, rik: { count: 1 }, joop: { count: 0 } }, "a");
    expect(q.lines).toEqual([]);
    expect(q.totalMonth).toBe(0);
  });
  it("variant B is duurder, vermeden inhuur blijft gelijk", () => {
    const a = quoteCrew({ wout: { count: 1, hours: 8, nights: 7 } }, "a");
    const b = quoteCrew({ wout: { count: 1, hours: 8, nights: 7 } }, "b");
    expect(b.totalMonth).toBeCloseTo(8 * 7 * W * 21.5, 6);
    expect(b.avoidedMonth).toBe(a.avoidedMonth);
  });
});

describe("prijsvariant B", () => {
  it("+20%, op hele euro's of op €0,50 bij het uurtarief", () => {
    expect(priceFor(bram, "b")).toBe(90);
    expect(priceFor(mila, "b")).toBe(1980);
    expect(priceFor(joop, "b")).toBe(2700);
    expect(priceFor(wout, "b")).toBe(21.5);
    expect(priceFor(getRobot("rex")!, "b")).toBeNull();
  });
});

describe("standaardploegen uit robots.json", () => {
  it("per sector", () => {
    expect(getConfiguratorSector("hotel")!.default).toEqual({ bram: 1, mila: 1 });
    expect(getConfiguratorSector("zorg")!.default).toEqual({ bram: 1, joop: 1 });
    expect(getConfiguratorSector("beveiliging")!.default).toEqual({ wout: 1 });
    expect(getConfiguratorSector("beveiliging")!.pilotOnly).toEqual(["rex"]);
  });
});

describe("opmaak", () => {
  it("bedragen", () => {
    expect(formatEuro(2273.25)).toBe("€2.273");
    expect(formatEuro(1234567.5)).toBe("€1.234.568");
    expect(formatPrice(1650)).toBe("€1.650");
    expect(formatPrice(21.5)).toBe("€21,50");
  });
  it("prijslabels zoals in robots.json", () => {
    for (const slug of ["bram", "mila", "joop", "wout"]) {
      const r = getRobot(slug)!;
      expect(priceLabel(r, r.price!)).toBe(r.priceLabel);
    }
  });
});
