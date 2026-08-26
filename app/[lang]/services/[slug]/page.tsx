import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Service } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { buildServiceWhatsAppMsg } from "@/lib/whatsapp";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getLocalizedField } from "@/lib/i18n/getLocalizedField";
import { ServiceImageGallery } from "@/components/services/ServiceImageGallery";

interface ServiceDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { lang, slug } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("name, name_en, name_kn, short_description, short_description_en, short_description_kn")
    .eq("slug", slug)
    .single();

  if (!service) {
    return { title: "Mehendi Service | MHendi by Mamatha" };
  }

  const name = getLocalizedField(service, "name", locale);
  const desc = getLocalizedField(service, "short_description", locale);

  return {
    title: `${name} | MHendi by Mamatha`,
    description: desc,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { lang, slug } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  const supabase = await createClient();
  const settings = await fetchBusinessSettings();

  const { data: serviceData } = await supabase
    .from("services")
    .select("*, service_images(*)")
    .eq("slug", slug)
    .single();

  if (!serviceData) {
    notFound();
  }

  const service: Service = serviceData;
  const name = getLocalizedField(service, "name", locale);
  const shortDesc = getLocalizedField(service, "short_description", locale);
  const fullDesc = getLocalizedField(service, "description", locale);
  const whatsappMsg = buildServiceWhatsAppMsg(name, settings.business_name, locale);

  return (
    <div className="py-8 sm:py-16 space-y-8 sm:space-y-12">
      <Container size="lg">
        {/* Back Link */}
        <Link
          href={`/${locale}/services`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-800 hover:text-gold-700 transition-colors mb-6 sm:mb-8"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>{dictionary.common.backToCatalog}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* Service Image Showcase */}
          <ServiceImageGallery
            images={service.service_images}
            serviceName={name}
          />

          {/* Service Details & Booking CTAs */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-semibold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 shrink-0" />
                <span>{service.category} {dictionary.common.mehendi}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-brand-900 leading-tight">
                {name}
              </h1>
            </div>

            {/* Price & Duration Box */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gold-300/40 shadow-soft grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] sm:text-xs font-semibold text-gold-700 uppercase tracking-wider block mb-1">
                  {dictionary.common.startingFrom}
                </span>
                <div className="text-xl sm:text-2xl font-serif font-bold text-brand-900">
                  {service.price || dictionary.common.contactForPrice}
                </div>
              </div>

              {service.duration && (
                <div>
                  <span className="text-[11px] sm:text-xs font-semibold text-brand-600 uppercase tracking-wider block mb-1">
                    {dictionary.common.duration}
                  </span>
                  <div className="text-sm sm:text-base font-semibold text-brand-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gold-600 shrink-0" />
                    <span>{service.duration}</span>
                  </div>
                </div>
              )}
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
                <span>100% Organic Henna Powder &amp; Essential Oils</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Doorstep Service at Home, Hotel, or Wedding Venue</span>
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
