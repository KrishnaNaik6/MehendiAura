import React from "react";
import Link from "next/link";
import { Phone, MessageSquare, MapPin, Clock, Instagram, Facebook, Youtube, Navigation } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { buildGeneralWhatsAppMsg } from "@/lib/whatsapp";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ContactPageProps) {
  const { lang } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: `${dictionary.contactPage.title} | MHendi by Mamatha`,
    description: dictionary.contactPage.subtitle,
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  const settings = await fetchBusinessSettings();
  const whatsappMsg = buildGeneralWhatsAppMsg(settings.business_name, locale);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <Container size="lg">
        <SectionHeading
          badge={dictionary.contactPage.badge}
          title={dictionary.contactPage.title}
          subtitle={dictionary.contactPage.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Contact Methods Box */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gold-300/30 shadow-soft space-y-6">
              <h2 className="font-serif text-2xl font-bold text-brand-900 border-b border-cream-200 pb-3">
                {dictionary.contactPage.directCtas}
              </h2>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-900 text-base">{dictionary.common.whatsapp}</h3>
                      <p className="text-xs text-brand-600">{dictionary.contactPage.whatsappDesc}</p>
                    </div>
                  </div>
                  <WhatsAppButton
                    fullWidth
                    size="lg"
                    phoneNumber={settings.whatsapp}
                    message={whatsappMsg}
                    label={dictionary.common.enquireWhatsapp}
                  />
                </div>

                <div className="p-5 rounded-2xl bg-cream-50 border border-gold-400/40 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-900 text-gold-300 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-900 text-base">{dictionary.common.callNow}</h3>
                      <p className="text-xs text-brand-600">{settings.phone}</p>
                    </div>
                  </div>
                  <CallButton fullWidth size="lg" phoneNumber={settings.phone} label={dictionary.common.callStudio} />
                </div>
              </div>
            </div>

            {/* Studio Address & Hours */}
            <div className="bg-white p-8 rounded-3xl border border-gold-300/30 shadow-soft space-y-4">
              <h2 className="font-serif text-xl font-bold text-brand-900 border-b border-cream-200 pb-3">
                {dictionary.contactPage.studioLocationTitle}
              </h2>

              <div className="space-y-3 text-sm text-brand-800">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-brand-900">{dictionary.common.address}:</span>
                    <span>{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-brand-900">{dictionary.common.businessHours}:</span>
                    <span>{settings.business_hours}</span>
                  </div>
                </div>
              </div>

              {/* Social Connections */}
              <div className="pt-4 border-t border-cream-200 flex items-center gap-3">
                <span className="text-xs font-semibold text-brand-900 uppercase tracking-wider">
                  {dictionary.common.followUs}:
                </span>
                {settings.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors"
                    aria-label="Instagram Profile"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    aria-label="Facebook Page"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    aria-label="YouTube Channel"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Embedded Google Maps / Directions */}
          <div className="bg-white p-6 rounded-3xl border border-gold-300/30 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-brand-900">{dictionary.contactPage.mapTitle}</h2>
              {settings.google_maps_url && (
                <a
                  href={settings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gold-700 hover:text-brand-900"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{dictionary.common.getDirections}</span>
                </a>
              )}
            </div>

            <div className="h-96 rounded-2xl bg-cream-100 border border-gold-300/40 overflow-hidden relative">
              <iframe
                title="Studio Location Google Map"
                src="https://maps.google.com/maps?q=Wedding%20Boulevard%20MG%20Road&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
