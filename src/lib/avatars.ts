import type { RobotKind } from "./robots";

// De zes personages uit design/RobotAvatar.dc.html, als data.
// Zo kan dezelfde tekening als React-SVG én als string (Open Graph) worden gebruikt.

type Attrs = Record<string, string | number>;
export type Shape = ["rect" | "circle" | "ellipse", Attrs];

const A = "accent";
const body = { fill: "#F4F5F7", stroke: "#1C2129", "stroke-opacity": 0.14, "stroke-width": 2 };
const shadow = (rx: number): Shape => ["ellipse", { cx: 100, cy: 195, rx, ry: 5, fill: "#000000", opacity: 0.14 }];
const eye = (x: number, y: number, w: number, h: number): Shape => ["rect", { x, y, width: w, height: h, rx: w / 2, fill: "#FFFFFF" }];

export const ACCENTS: Record<RobotKind, string> = {
  bram: "#4D7CFF",
  mila: "#FF5A1F",
  joop: "#12A37A",
  wout: "#1F3A5F",
  rex: "#F2B705",
  fenna: "#9B5CF6",
  rik: "#8A93A3",
};

export const AVATAR_LABELS: Record<RobotKind, string> = {
  bram: "Bram, vloerspecialist",
  mila: "Mila, roomservice",
  joop: "Joop, rondebrenger",
  wout: "Wout, nachtwaker",
  rex: "Rex, terreinspecialist",
  fenna: "Fenna, lobbyhost",
  rik: "Rik, allrounder in opleiding",
};

export const AVATAR_SHAPES: Record<RobotKind, Shape[]> = {
  bram: [
    shadow(78),
    ["rect", { x: 96, y: 64, width: 8, height: 30, rx: 4, fill: "#C9CED6" }],
    ["circle", { cx: 100, cy: 60, r: 9, fill: A }],
    ["rect", { x: 24, y: 88, width: 152, height: 100, rx: 44, ...body }],
    ["rect", { x: 24, y: 148, width: 152, height: 12, fill: A }],
    ["rect", { x: 36, y: 176, width: 128, height: 14, rx: 7, fill: "#2A303A" }],
    ["rect", { x: 56, y: 104, width: 88, height: 36, rx: 18, fill: "#1C2129" }],
    eye(80, 113, 11, 17),
    eye(109, 113, 11, 17),
  ],
  mila: [
    shadow(56),
    ["rect", { x: 58, y: 16, width: 84, height: 166, rx: 36, ...body }],
    ["rect", { x: 70, y: 30, width: 60, height: 34, rx: 17, fill: "#1C2129" }],
    eye(85, 38, 10, 16),
    eye(105, 38, 10, 16),
    ["rect", { x: 70, y: 78, width: 60, height: 84, rx: 16, fill: A }],
    ["rect", { x: 119, y: 108, width: 4, height: 24, rx: 2, fill: "#FFFFFF", opacity: 0.85 }],
    ["rect", { x: 52, y: 176, width: 96, height: 14, rx: 7, fill: "#2A303A" }],
  ],
  joop: [
    shadow(66),
    ["rect", { x: 93, y: 56, width: 14, height: 120, rx: 4, fill: "#C9CED6" }],
    ["rect", { x: 64, y: 10, width: 72, height: 48, rx: 24, ...body }],
    ["rect", { x: 74, y: 20, width: 52, height: 28, rx: 14, fill: "#1C2129" }],
    eye(88, 27, 8, 14),
    eye(104, 27, 8, 14),
    ["rect", { x: 32, y: 76, width: 136, height: 12, rx: 6, fill: A }],
    ["rect", { x: 32, y: 110, width: 136, height: 12, rx: 6, fill: A }],
    ["rect", { x: 32, y: 144, width: 136, height: 12, rx: 6, fill: A }],
    ["rect", { x: 38, y: 166, width: 124, height: 24, rx: 12, ...body }],
    ["rect", { x: 50, y: 184, width: 100, height: 8, rx: 4, fill: "#2A303A" }],
  ],
  wout: [
    shadow(62),
    ["rect", { x: 80, y: 12, width: 40, height: 12, rx: 6, fill: "#F2B705" }],
    ["rect", { x: 54, y: 22, width: 92, height: 152, rx: 46, ...body }],
    ["rect", { x: 66, y: 46, width: 68, height: 32, rx: 16, fill: "#1C2129" }],
    eye(85, 54, 10, 16),
    eye(105, 54, 10, 16),
    ["rect", { x: 54, y: 98, width: 92, height: 12, fill: A }],
    ["circle", { cx: 100, cy: 134, r: 13, fill: "#1C2129" }],
    ["circle", { cx: 100, cy: 134, r: 5, fill: "#7CC4FF" }],
    ["rect", { x: 44, y: 166, width: 112, height: 24, rx: 12, fill: "#2A303A" }],
  ],
  rex: [
    shadow(80),
    ["rect", { x: 50, y: 128, width: 13, height: 40, rx: 6.5, fill: "#C9CED6", transform: "rotate(10 56 128)" }],
    ["rect", { x: 132, y: 128, width: 13, height: 40, rx: 6.5, fill: "#C9CED6", transform: "rotate(-10 138 128)" }],
    ["rect", { x: 66, y: 128, width: 14, height: 36, rx: 7, ...body }],
    ["rect", { x: 66, y: 160, width: 14, height: 28, rx: 7, ...body, transform: "rotate(-12 73 160)" }],
    ["rect", { x: 120, y: 128, width: 14, height: 36, rx: 7, ...body }],
    ["rect", { x: 120, y: 160, width: 14, height: 28, rx: 7, ...body, transform: "rotate(12 127 160)" }],
    ["rect", { x: 64, y: 186, width: 18, height: 7, rx: 3.5, fill: "#2A303A" }],
    ["rect", { x: 122, y: 186, width: 18, height: 7, rx: 3.5, fill: "#2A303A" }],
    ["rect", { x: 36, y: 92, width: 128, height: 44, rx: 22, ...body }],
    ["rect", { x: 36, y: 114, width: 128, height: 9, fill: A }],
    ["rect", { x: 76, y: 82, width: 30, height: 12, rx: 5, fill: "#2A303A" }],
    ["rect", { x: 146, y: 66, width: 46, height: 38, rx: 15, ...body }],
    ["rect", { x: 154, y: 74, width: 32, height: 20, rx: 10, fill: "#1C2129" }],
    eye(163, 79, 6, 10),
    eye(174, 79, 6, 10),
  ],
  fenna: [
    shadow(50),
    ["rect", { x: 62, y: 84, width: 76, height: 106, rx: 38, ...body }],
    ["circle", { cx: 100, cy: 48, r: 36, ...body }],
    ["rect", { x: 74, y: 34, width: 52, height: 30, rx: 15, fill: "#1C2129" }],
    eye(88, 41, 8, 15),
    eye(104, 41, 8, 15),
    ["rect", { x: 76, y: 106, width: 48, height: 36, rx: 9, fill: A }],
    ["rect", { x: 85, y: 117, width: 30, height: 4, rx: 2, fill: "#FFFFFF" }],
    ["rect", { x: 85, y: 127, width: 20, height: 4, rx: 2, fill: "#FFFFFF" }],
  ],
  rik: [
    shadow(46),
    ["rect", { x: 76, y: 6, width: 48, height: 42, rx: 18, ...body }],
    ["rect", { x: 82, y: 16, width: 36, height: 20, rx: 10, fill: "#1C2129" }],
    eye(91, 21, 6, 10),
    eye(103, 21, 6, 10),
    ["rect", { x: 94, y: 48, width: 12, height: 10, fill: "#C9CED6" }],
    ["rect", { x: 44, y: 62, width: 16, height: 70, rx: 8, ...body }],
    ["rect", { x: 140, y: 62, width: 16, height: 70, rx: 8, ...body }],
    ["rect", { x: 64, y: 56, width: 72, height: 76, rx: 24, ...body }],
    ["rect", { x: 86, y: 74, width: 28, height: 18, rx: 6, fill: A }],
    ["rect", { x: 74, y: 132, width: 22, height: 54, rx: 10, ...body }],
    ["rect", { x: 104, y: 132, width: 22, height: 54, rx: 10, ...body }],
    ["rect", { x: 70, y: 182, width: 30, height: 9, rx: 4.5, fill: "#2A303A" }],
    ["rect", { x: 100, y: 182, width: 30, height: 9, rx: 4.5, fill: "#2A303A" }],
  ],
};

export function resolveFill(value: string | number, kind: RobotKind): string | number {
  return value === A ? ACCENTS[kind] : value;
}

/** SVG als string, voor gegenereerde afbeeldingen. */
export function avatarSvgString(kind: RobotKind, size: number): string {
  const inner = AVATAR_SHAPES[kind]
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs)
        .map(([k, v]) => `${k}="${k === "fill" ? resolveFill(v, kind) : v}"`)
        .join(" ");
      return `<${tag} ${a}/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}" overflow="visible">${inner}</svg>`;
}
