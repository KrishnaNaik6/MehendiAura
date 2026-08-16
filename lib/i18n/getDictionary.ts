import { Locale, DEFAULT_LOCALE } from "./config";
import { en } from "./translations/en";
import { kn } from "./translations/kn";

const dictionaries = {
  en,
  kn,
};

export type Dictionary = typeof en;

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}
