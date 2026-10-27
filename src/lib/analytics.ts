import { getVariant } from "./variant";

export type EventName =
  | "robot_profile_view"
  | "sector_page_view"
  | "filter_used"
  | "configurator_start"
  | "crew_changed"
  | "request_submitted"
  | "pilot_signup"
  | "waitlist_signup"
  | "flexpool_request"
  | "manufacturer_signup";

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: ((event: string, options?: { props?: Props }) => void) & { q?: unknown[] };
  }
}

/** Stuurt een event naar Plausible, altijd met de prijsvariant erbij. */
export function track(event: EventName, props: Props = {}) {
  if (typeof window === "undefined") return;
  const all = { ...props, variant: getVariant() };
  if (window.plausible) window.plausible(event, { props: all });
  if (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DEMO === "1") {
    console.info("[event]", event, all);
  }
}
