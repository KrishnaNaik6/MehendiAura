import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, Locale } from "@/lib/i18n/config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function FallbackServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value as Locale;
  const locale = LOCALES.includes(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  redirect(`/${locale}/services/${slug}`);
}
