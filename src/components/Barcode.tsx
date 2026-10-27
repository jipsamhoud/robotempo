const BARS: [number, number][] = [[0, 3], [6, 1.5], [10, 4], [17, 1.5], [21, 2.5], [27, 5], [35, 1.5], [40, 3], [46, 1.5], [50, 4], [57, 2], [62, 5], [70, 1.5], [74, 3], [80, 4]];

export function Barcode() {
  return (
    <svg width="84" height="26" viewBox="0 0 84 26" aria-hidden="true">
      <g fill="#111111">
        {BARS.map(([x, w]) => <rect key={x} x={x} y="0" width={w} height="26" />)}
      </g>
    </svg>
  );
}
