import { Locale, DEFAULT_LOCALE } from "./config";

/**
 * Returns localized text from a database record based on locale.
 * Checks `${field}_${locale}` -> `${field}_en` -> `${field}` (legacy fallback).
 */
export function getLocalizedField<T extends Record<string, any>>(
  item: T | null | undefined,
  field: string,
  locale: Locale = DEFAULT_LOCALE
): any {
  if (!item) return "";

  const localizedKey = `${field}_${locale}`;
  const englishKey = `${field}_en`;

  // 1. Check for specific locale field (e.g. name_kn)
  if (item[localizedKey] !== undefined && item[localizedKey] !== null && item[localizedKey] !== "") {
    return item[localizedKey];
  }

  // 2. Fallback to explicit English field (e.g. name_en)
  if (item[englishKey] !== undefined && item[englishKey] !== null && item[englishKey] !== "") {
    return item[englishKey];
  }

  // 3. Fallback to base field (e.g. name)
  if (item[field] !== undefined && item[field] !== null) {
    return item[field];
  }

  return "";
}
