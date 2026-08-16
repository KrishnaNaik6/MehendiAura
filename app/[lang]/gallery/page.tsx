import React from "react";
import { createClient } from "@/lib/supabase/server";
import { GalleryItem } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryLightboxModal } from "@/components/gallery/GalleryLightboxModal";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";

interface GalleryPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps) {
  const { lang } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: `${dictionary.galleryPage.title} | MehendiAura`,
    description: dictionary.galleryPage.subtitle,
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { lang } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  const supabase = await createClient();
  const settings = await fetchBusinessSettings();

  const { data: galleryData } = await supabase
    .from("gallery")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const items: GalleryItem[] = (galleryData as any[]) || [];

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <Container size="lg">
        <SectionHeading
          badge={dictionary.galleryPage.badge}
          title={dictionary.galleryPage.title}
          subtitle={dictionary.galleryPage.subtitle}
        />

        {/* Interactive Lightbox Grid Component */}
        <GalleryLightboxModal
          items={items}
          whatsappNumber={settings.whatsapp}
          businessName={settings.business_name}
          locale={locale}
        />
      </Container>
    </div>
  );
}
