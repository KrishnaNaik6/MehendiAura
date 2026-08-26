import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Gem, Sparkles, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Jewellery } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { buildJewelleryWhatsAppMsg } from "@/lib/whatsapp";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getLocalizedField } from "@/lib/i18n/getLocalizedField";

interface JewelleryPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: JewelleryPageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: `${dictionary.jewelleryPage.title} | MHendi by Mamatha Sagara`,
    description: dictionary.jewelleryPage.subtitle,
  };
}

export default async function JewelleryPage({ params }: JewelleryPageProps) {
  const { lang } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  const supabase = await createClient();
  const settings = await fetchBusinessSettings();

  const { data: jewelleryData } = await supabase
    .from("jewellery")
    .select("*, jewellery_images(*)")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("display_order", { ascending: true });

  const jewelleryList: Jewellery[] = (jewelleryData as any[]) || [];

  return (
    <div className="py-12 space-y-12">
      <Container size="lg">
        <SectionHeading
          badge={dictionary.jewelleryPage.badge}
          title={dictionary.jewelleryPage.title}
          subtitle={dictionary.jewelleryPage.subtitle}
        />

        {/* Security Deposit Banner */}
        <div className="bg-gold-500/10 border border-gold-400/40 p-4 sm:p-6 rounded-2xl flex items-center gap-4 text-xs sm:text-sm text-brand-900 max-w-3xl mx-auto shadow-xs">
          <ShieldCheck className="w-6 h-6 text-gold-700 shrink-0" />
          <p className="leading-relaxed">
            {dictionary.jewelleryPage.depositNotice}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jewelleryList.map((item) => {
            const name = getLocalizedField(item, "name", locale);
            const shortDesc = getLocalizedField(item, "short_description", locale);
            const visibleImgs = (item.jewellery_images || [])
              .filter((img) => !img.alt_text?.startsWith("[hidden]"))
              .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

            const mainImg = visibleImgs.length > 0 ? visibleImgs[0].image_url : null;
            const whatsappMsg = buildJewelleryWhatsAppMsg(name, settings.business_name, locale);

            return (
              <Card key={item.id} hoverEffect className="flex flex-col justify-between group border-gold-300/40">
                <div>
                  {/* Full image display with ambient blur backdrop */}
                  <div className="h-52 sm:h-56 bg-earth-950 flex items-center justify-center text-gold-300 relative overflow-hidden group/img">
                    {mainImg ? (
                      <>
                        <img
                          src={mainImg}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110"
                        />
                        <img
                          src={mainImg}
                          alt={name}
                          className="relative z-10 w-full h-full object-contain p-2 group-hover/img:scale-105 transition-transform duration-500"
                        />
                      </>
                    ) : (
                      <Gem className="w-12 h-12 stroke-1 opacity-80" />
                    )}
                    <span className="absolute top-4 right-4 z-20 bg-emerald-700 text-white font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {item.availability_status === "available"
                        ? dictionary.common.available
                        : item.availability_status === "booked"
                        ? dictionary.common.booked
                        : dictionary.common.maintenance}
                    </span>
                  </div>

                  <CardHeader>
                    <h2 className="font-serif text-2xl font-bold text-brand-900 hover:text-gold-700 transition-colors">
                      <Link href={`/${locale}/jewellery/${item.slug}`}>{name}</Link>
                    </h2>
                  </CardHeader>

                  <CardBody>
                    <p className="text-sm text-brand-700 leading-relaxed mb-4">
                      {shortDesc}
                    </p>
                    <div className="space-y-1 border-t border-cream-200 pt-3">
                      <div className="text-xs text-brand-600 font-semibold uppercase tracking-wider">
                        {dictionary.common.perDayRate}
                      </div>
                      <div className="text-lg font-serif font-bold text-emerald-700">
                        {item.rental_price ? `₹${item.rental_price} ${dictionary.common.perDay}` : dictionary.common.contactForPrice}
                      </div>
                    </div>
                  </CardBody>
                </div>

                <CardFooter className="flex-col sm:flex-row gap-2">
                  <WhatsAppButton
                    fullWidth
                    size="sm"
                    label={dictionary.common.enquireWhatsapp}
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
