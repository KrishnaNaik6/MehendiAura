import React from "react";
import { createClient } from "@/lib/supabase/server";
import { GalleryItem } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryLightboxModal } from "@/components/gallery/GalleryLightboxModal";
import { fetchBusinessSettings } from "@/lib/supabase/helper";

export const metadata = {
  title: "Showcase Gallery | Bridal Mehendi & Rental Jewellery Photos",
  description: "Explore our real client showcase gallery featuring bridal henna patterns, wedding event work, and rental jewellery sets.",
};

export default async function PublicGalleryPage() {
  const supabase = await createClient();
  const settings = await fetchBusinessSettings();

  const { data: galleryData } = await supabase
    .from("gallery")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const items: GalleryItem[] = (galleryData as any[]) || [
    {
      id: "g1",
      title: "Royal Dulha-Dulhan Bridal Mehendi",
      category: "Bridal Mehendi",
      description: "Intricate full-arm bridal henna art with custom portrait motifs.",
      image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
      storage_path: "gallery/g1.jpg",
      alt_text: "Bridal Mehendi Pattern",
      display_order: 1,
      active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "g2",
      title: "Arabic Flowing Floral Vine",
      category: "Arabic Mehendi",
      description: "Shaded floral vines with bold outlines applied for engagement ceremony.",
      image_url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800",
      storage_path: "gallery/g2.jpg",
      alt_text: "Arabic Mehendi Vine",
      display_order: 2,
      active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "g3",
      title: "Kundan Royal Bridal Jewellery Set",
      category: "Jewellery",
      description: "Pristine Kundan bridal choker set displayed on real bride.",
      image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
      storage_path: "gallery/g3.jpg",
      alt_text: "Bridal Jewellery Set",
      display_order: 3,
      active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "g4",
      title: "Sangeet Guest Henna Party",
      category: "Customer Photos",
      description: "On-site group henna application for wedding guests.",
      image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
      storage_path: "gallery/g4.jpg",
      alt_text: "Guest Henna Party",
      display_order: 4,
      active: true,
      created_at: new Date().toISOString(),
    },
  ];

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <Container size="lg">
        <SectionHeading
          badge="Real Work & Client Showcase"
          title="Mehendi &amp; Jewellery Photo Gallery"
          subtitle="Explore our portfolio of handcrafted bridal mehendi patterns, festive guest henna, and pristine rental jewellery sets."
        />

        {/* Interactive Lightbox Grid Component */}
        <GalleryLightboxModal
          items={items}
          whatsappNumber={settings.whatsapp}
          businessName={settings.business_name}
        />
      </Container>
    </div>
  );
}
