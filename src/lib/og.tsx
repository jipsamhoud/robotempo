import { ImageResponse } from "next/og";
import { avatarSvgString } from "./avatars";
import type { RobotKind } from "./robots";

export const ogSize = { width: 1200, height: 630 };

const lineup: [RobotKind, number][] = [["mila", 230], ["bram", 200], ["rik", 240], ["wout", 220], ["joop", 215], ["fenna", 215]];

let font: Promise<ArrayBuffer | null> | null = null;

/** Archivo 900 als TTF, bij de build opgehaald. Lukt dat niet, dan valt hij terug op de standaardletter. */
function archivo(): Promise<ArrayBuffer | null> {
  font ??= (async () => {
    try {
      const css = await (await fetch("https://fonts.googleapis.com/css2?family=Archivo:wght@900")).text();
      const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
      return url ? await (await fetch(url)).arrayBuffer() : null;
    } catch {
      return null;
    }
  })();
  return font;
}

/** De Open Graph-afbeelding: de robotrij op oranje, met een kop. */
export async function ogImage(title: string) {
  const data = await archivo();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#FF5A1F", fontFamily: "Archivo", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", padding: "56px 64px 0" }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#111111" }}>Robotempo</div>
          <div style={{ fontSize: 76, fontWeight: 900, color: "#111111", lineHeight: 0.95, letterSpacing: -3, marginTop: 18, maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", padding: "0 40px" }}>
            {lineup.map(([kind, size]) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={kind} width={size * 0.8} height={size * 0.8} src={`data:image/svg+xml;utf8,${encodeURIComponent(avatarSvgString(kind, size))}`} alt="" />
            ))}
          </div>
          <div style={{ height: 40, background: "#111111" }} />
        </div>
      </div>
    ),
    { ...ogSize, fonts: data ? [{ name: "Archivo", data, weight: 900, style: "normal" }] : undefined },
  );
}
