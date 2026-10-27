import { nl, type Messages } from "./nl";

export type Locale = "nl";
export const defaultLocale: Locale = "nl";

const messages: Record<Locale, Messages> = { nl };

/** Klaar voor /en: voeg een berichtenbestand toe en een locale-segment in de routes. */
export function getMessages(locale: Locale = defaultLocale): Messages {
  return messages[locale];
}

export const t = getMessages();
