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
    title: `${dictionary.galleryPage.title} | MHendi by Mamatha`,
    description: dictionary.galleryPage.subtitle,
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { lang } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  const supabase = await createClient();
  const settings = await fetchBusinessSettings();

  // 1. Fetch direct portfolio gallery records (excluding Homepage Featured Showcase)
  const { data: galleryData } = await supabase
    .from("gallery")
    .select("*")
    .neq("category", "Featured Showcase")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  // 2. Fetch service photos categorized by service type (Mehendi, Makeup, Draping, etc.)
  const { data: serviceImages } = await supabase
    .from("service_images")
    .select("*, services!inner(name, name_en, name_kn, category, active)")
    .eq("services.active", true);

  // 3. Fetch jewellery photos categorized by rental jewellery
  const { data: jewelleryImages } = await supabase
    .from("jewellery_images")
    .select("*, jewellery!inner(name, name_en, name_kn, category, active)")
    .eq("jewellery.active", true);

  const directItems: GalleryItem[] = (galleryData as any[]) || [];

  // Map service photos into gallery format with service category
  const serviceGalleryItems: GalleryItem[] = (serviceImages || []).map((img: any) => ({
    id: `service-img-${img.id}`,
    title: img.services?.name_en || img.services?.name || "Service Showcase",
    title_en: img.services?.name_en || img.services?.name || "Service Showcase",
    title_kn: img.services?.name_kn || null,
    category: img.services?.category || "Services",
    description: null,
    description_en: null,
    description_kn: null,
    image_url: img.image_url,
    storage_path: img.storage_path || "",
    alt_text: img.alt_text || img.services?.name,
    alt_text_en: img.alt_text || img.services?.name,
    alt_text_kn: null,
    active: true,
    display_order: img.display_order || 1,
    created_at: img.created_at || new Date().toISOString(),
  }));

  // Map jewellery photos into gallery format
  const jewelleryGalleryItems: GalleryItem[] = (jewelleryImages || []).map((img: any) => ({
    id: `jewellery-img-${img.id}`,
    title: img.jewellery?.name_en || img.jewellery?.name || "Rental Jewellery Set",
    title_en: img.jewellery?.name_en || img.jewellery?.name || "Rental Jewellery Set",
    title_kn: img.jewellery?.name_kn || null,
    category: "Rental Jewellery",
    description: null,
    description_en: null,
    description_kn: null,
    image_url: img.image_url,
    storage_path: img.storage_path || "",
    alt_text: img.alt_text || img.jewellery?.name,
    alt_text_en: img.alt_text || img.jewellery?.name,
    alt_text_kn: null,
    active: true,
    display_order: img.display_order || 1,
    created_at: img.created_at || new Date().toISOString(),
  }));

  // Combine all uploaded photos across Gallery, Services, and Jewellery category-wise
  const allItems: GalleryItem[] = [
    ...directItems,
    ...serviceGalleryItems,
    ...jewelleryGalleryItems,
  ];

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
          items={allItems}
          whatsappNumber={settings.whatsapp}
          businessName={settings.business_name}
          locale={locale}
        />
      </Container>
    </div>
  );
}
