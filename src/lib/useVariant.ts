"use client";

import { useSyncExternalStore } from "react";
import type { Variant } from "./pricing";
import { getVariant } from "./variant";

const subscribe = () => () => {};

/** De prijsvariant in een client-component. Server-render gaat uit van A. */
export function useVariant(): Variant {
  return useSyncExternalStore(subscribe, getVariant, () => "a" as Variant);
}
