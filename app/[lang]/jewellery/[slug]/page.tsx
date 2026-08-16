import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gem, ArrowLeft, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Jewellery } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { buildJewelleryWhatsAppMsg } from "@/lib/whatsapp";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getLocalizedField } from "@/lib/i18n/getLocalizedField";

interface JewelleryDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: JewelleryDetailPageProps) {
  const { lang, slug } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("jewellery")
    .select("name, name_en, name_kn, short_description, short_description_en, short_description_kn")
    .eq("slug", slug)
    .single();

  if (!item) {
    return { title: "Rental Jewellery | MehendiAura" };
  }

  const name = getLocalizedField(item, "name", locale);
  const desc = getLocalizedField(item, "short_description", locale);

  return {
    title: `${name} | Rental Jewellery Catalog`,
    description: desc,
  };
}

export default async function JewelleryDetailPage({ params }: JewelleryDetailPageProps) {
  const { lang, slug } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  const supabase = await createClient();
  const settings = await fetchBusinessSettings();

  const { data: itemData } = await supabase
    .from("jewellery")
    .select("*, jewellery_images(*)")
    .eq("slug", slug)
    .single();

  if (!itemData) {
    notFound();
  }

  const item: Jewellery = itemData;
  const name = getLocalizedField(item, "name", locale);
  const shortDesc = getLocalizedField(item, "short_description", locale);
  const fullDesc = getLocalizedField(item, "description", locale);
  const includedItems = getLocalizedField(item, "included_items", locale) || item.included_items;
  const whatsappMsg = buildJewelleryWhatsAppMsg(name, settings.business_name, locale);

  return (
    <div className="py-8 sm:py-16 space-y-8 sm:space-y-12">
      <Container size="lg">
        {/* Back Link */}
        <Link
          href={`/${locale}/jewellery`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-800 hover:text-gold-700 transition-colors mb-6 sm:mb-8"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>{dictionary.common.backToCatalog}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* Image Showcase */}
          <div className="space-y-4">
            <div className="h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-earth-900 via-earth-800 to-brand-950 border border-gold-500/30 overflow-hidden shadow-2xl flex items-center justify-center relative">
              {item.jewellery_images && item.jewellery_images.length > 0 ? (
                <img
                  src={item.jewellery_images[0].image_url}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-gold-300 p-4 text-center">
                  <Gem className="w-12 h-12 sm:w-16 sm:h-16 stroke-1 opacity-80" />
                  <span className="font-serif text-base sm:text-lg tracking-wider text-gold-400">
                    {name}
                  </span>
                </div>
              )}
              <span
                className={`absolute top-3 left-3 sm:top-4 sm:left-4 text-white font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md ${
                  item.availability_status === "available"
                    ? "bg-emerald-700"
                    : item.availability_status === "booked"
                    ? "bg-gold-700"
                    : "bg-red-700"
                }`}
              >
                {dictionary.common.status}: {item.availability_status === "available" ? dictionary.common.available : item.availability_status === "booked" ? dictionary.common.booked : dictionary.common.maintenance}
              </span>
            </div>
          </div>

          {/* Details & Rental Booking CTA */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-semibold uppercase tracking-wider">
                <Gem className="w-3.5 h-3.5 shrink-0" />
                <span>{item.category}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-brand-900 leading-tight">
                {name}
              </h1>
            </div>

            {/* Rental Price & Deposit Box */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gold-300/40 shadow-soft space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cream-200 pb-3 gap-2">
                <div>
                  <span className="text-[11px] sm:text-xs font-semibold text-gold-700 uppercase tracking-wider">
                    {dictionary.common.perDayRate}
                  </span>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700">
                    {item.rental_price ? `₹${item.rental_price}` : dictionary.common.contactForPrice}
                    <span className="text-xs sm:text-sm font-normal text-brand-600"> {dictionary.common.perDay}</span>
                  </div>
                </div>

                {item.security_deposit && (
                  <div className="sm:text-right">
                    <span className="text-[11px] sm:text-xs font-semibold text-brand-600 uppercase tracking-wider">
                      {dictionary.common.securityDeposit}
                    </span>
                    <div className="text-lg sm:text-xl font-bold text-brand-900">
                      ₹{item.security_deposit}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-brand-600 leading-relaxed">
                {dictionary.jewelleryPage.depositNotice}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-900 border-b border-cream-300 pb-2">
                {dictionary.common.viewDetails}
              </h2>
              <p className="text-sm sm:text-base text-brand-700 leading-relaxed whitespace-pre-line">
                {fullDesc || shortDesc}
              </p>
            </div>

            {/* Included Items Checklist */}
            {includedItems && includedItems.length > 0 && (
              <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-cream-50 border border-gold-300/30">
                <h3 className="font-serif font-bold text-brand-900 text-xs sm:text-sm">{dictionary.common.includedItems}:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-700">
                  {includedItems.map((piece: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{piece}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-cream-200">
              <WhatsAppButton
                fullWidth
                size="lg"
                label={dictionary.common.enquireWhatsapp}
                phoneNumber={settings.whatsapp}
                message={whatsappMsg}
              />
              <CallButton fullWidth size="lg" phoneNumber={settings.phone} label={dictionary.common.callNow} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
