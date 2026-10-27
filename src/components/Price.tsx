import { formatPrice, priceFor, priceLabel } from "@/lib/pricing";
import type { Robot } from "@/lib/robots";
import { t } from "@/messages";

/**
 * Een prijs in beide prijsvarianten. CSS toont de juiste, zonder flikkeren.
 * `format` maakt van het bedrag de zichtbare tekst; standaard het label van het prijsmodel.
 */
export function Price({ robot, format }: { robot: Robot; format?: (amount: number) => string }) {
  const a = priceFor(robot, "a");
  const b = priceFor(robot, "b");
  if (a == null || b == null) return <>{robot.status === "wachtlijst" ? t.price.notYet : t.price.onRequest}</>;
  const show = format ?? ((n: number) => priceLabel(robot, n) ?? formatPrice(n));
  return (
    <>
      <span className="pv-a">{show(a)}</span>
      <span className="pv-b">{show(b)}</span>
    </>
  );
}
