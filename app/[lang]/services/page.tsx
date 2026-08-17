import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Service } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { ServicesCatalogFilter } from "@/components/services/ServicesCatalogFilter";

interface ServicesPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ServicesPageProps) {
  const { lang } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: `${dictionary.servicesPage.title} | MHendi by Mamatha`,
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

        <ServicesCatalogFilter
          services={services}
          settings={settings}
          locale={locale}
          dictionary={dictionary}
        />
      </Container>
    </div>
  );
}
