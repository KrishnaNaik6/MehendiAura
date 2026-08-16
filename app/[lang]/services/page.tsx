import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Service } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { buildServiceWhatsAppMsg } from "@/lib/whatsapp";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getLocalizedField } from "@/lib/i18n/getLocalizedField";

interface ServicesPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ServicesPageProps) {
  const { lang } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: `${dictionary.servicesPage.title} | MehendiAura`,
    description: dictionary.servicesPage.subtitle,
  };
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { lang } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  const supabase = await createClient();
  const settings = await fetchBusinessSettings();

  const { data: servicesData } = await supabase
    .from("services")
    .select("*, service_images(*)")
    .eq("active", true)
    .order("display_order", { ascending: true });

  const services: Service[] = (servicesData as any[]) || [];

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <Container size="lg">
        <SectionHeading
          badge={dictionary.servicesPage.badge}
          title={dictionary.servicesPage.title}
          subtitle={dictionary.servicesPage.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const name = getLocalizedField(service, "name", locale);
            const shortDesc = getLocalizedField(service, "short_description", locale);
            const mainImg = service.service_images && service.service_images.length > 0
              ? service.service_images[0].image_url
              : null;
            const whatsappMsg = buildServiceWhatsAppMsg(name, settings.business_name, locale);

            return (
              <Card key={service.id} hoverEffect glass className="flex flex-col justify-between">
                <div>
                  <div className="h-48 bg-gradient-to-tr from-brand-900 via-brand-800 to-brand-950 flex items-center justify-center text-gold-300 p-6 relative overflow-hidden">
                    {mainImg ? (
                      <img
                        src={mainImg}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Heart className="w-12 h-12 stroke-1 opacity-80" />
                    )}
                    <span className="absolute top-4 right-4 bg-gold-500 text-brand-950 font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {service.category}
                    </span>
                  </div>

                  <CardHeader>
                    <h2 className="font-serif text-2xl font-bold text-brand-900 hover:text-gold-700 transition-colors">
                      <Link href={`/${locale}/services/${service.slug}`}>{name}</Link>
                    </h2>
                  </CardHeader>

                  <CardBody>
                    <p className="text-sm text-brand-700 leading-relaxed mb-4">
                      {shortDesc}
                    </p>
                    <div className="space-y-1 text-xs text-brand-600 border-t border-cream-200 pt-3">
                      {service.duration && (
                        <div>
                          <span className="font-semibold">{dictionary.common.duration}:</span> {service.duration}
                        </div>
                      )}
                      <div className="text-sm font-semibold text-brand-900 pt-1">
                        {dictionary.common.startingFrom}: <span className="text-gold-700">{service.price || dictionary.common.contactForPrice}</span>
                      </div>
                    </div>
                  </CardBody>
                </div>

                <CardFooter className="flex-col sm:flex-row gap-2">
                  <WhatsAppButton
                    fullWidth
                    size="sm"
                    label={dictionary.common.whatsapp}
                    phoneNumber={settings.whatsapp}
                    message={whatsappMsg}
                  />
                  <CallButton fullWidth size="sm" phoneNumber={settings.phone} label={dictionary.common.callNow} />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
