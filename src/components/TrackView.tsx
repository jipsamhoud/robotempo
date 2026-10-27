"use client";

import { useEffect } from "react";
import { track, type EventName } from "@/lib/analytics";

/** Stuurt één event zodra de pagina geladen is. */
export function TrackView({ event, props }: { event: EventName; props?: Record<string, string> }) {
  useEffect(() => {
    track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
