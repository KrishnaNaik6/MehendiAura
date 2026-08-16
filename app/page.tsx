import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, Locale } from "@/lib/i18n/config";
import { fetchBusinessSettings } from "@/lib/supabase/helper";

export default async function RootPage() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value as Locale;

  if (LOCALES.includes(cookieLocale)) {
    redirect(`/${cookieLocale}`);
  }

  // If no explicit cookie is set by visitor, use Admin's configured default language
  const settings = await fetchBusinessSettings();
  const adminDefaultLocale = (settings?.default_locale as Locale) || DEFAULT_LOCALE;
  const targetLocale = LOCALES.includes(adminDefaultLocale) ? adminDefaultLocale : DEFAULT_LOCALE;

  redirect(`/${targetLocale}`);
}
