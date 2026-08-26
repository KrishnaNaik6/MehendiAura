import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gem, Clock, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
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
import { JewelleryImageGallery } from "@/components/jewellery/JewelleryImageGallery";

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
    return { title: "Rental Jewellery | MHendi by Mamatha" };
  }

  const name = getLocalizedField(item, "name", locale);
  const desc = getLocalizedField(item, "short_description", locale);

  return {
    title: `${name} | Rental Jewellery | MHendi by Mamatha`,
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
          <JewelleryImageGallery
            images={item.jewellery_images}
            itemName={name}
          />

          {/* Jewellery Details & CTAs */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/10 border border-emerald-700/30 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                <Gem className="w-3.5 h-3.5 shrink-0" />
                <span>{item.category}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-brand-900 leading-tight">
                {name}
              </h1>
            </div>

            {/* Price & Deposit Box */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gold-300/40 shadow-soft space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] sm:text-xs font-semibold text-gold-700 uppercase tracking-wider block mb-1">
                    {dictionary.common.rentalPrice}
                  </span>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-emerald-800">
                    {item.rental_price
                      ? `₹${item.rental_price} ${dictionary.common.perDay}`
                      : dictionary.common.contactForPrice}
                  </div>
                </div>

                {item.security_deposit && (
                  <div>
                    <span className="text-[11px] sm:text-xs font-semibold text-brand-600 uppercase tracking-wider block mb-1">
                      {dictionary.common.securityDeposit}
                    </span>
                    <div className="text-sm sm:text-base font-semibold text-brand-800">
                      ₹{item.security_deposit} (Refundable)
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-cream-200 text-xs text-brand-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{dictionary.jewelleryPage.depositNotice}</span>
              </div>
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

            {/* Guarantees */}
            <div className="p-4 sm:p-5 rounded-2xl bg-cream-50 border border-gold-300/30 space-y-2 text-xs text-brand-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sanitized &amp; Sanitization Inspected After Every Event</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Matching Earrings, Maang Tikka, &amp; Accessories Included</span>
              </div>
            </div>

            {/* Conversion Buttons */}
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
