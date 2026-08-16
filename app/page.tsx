import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, Locale } from "@/lib/i18n/config";

export default async function RootPage() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value as Locale;
  const locale = LOCALES.includes(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  redirect(`/${locale}`);
}
