export type Locale = "en" | "kn";

export const LOCALES: Locale[] = ["en", "kn"];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, { name: string; nativeName: string; flag: string }> = {
  en: { name: "English", nativeName: "English", flag: "🇬🇧" },
  kn: { name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
};
