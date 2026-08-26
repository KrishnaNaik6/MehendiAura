import React from "react";
import Link from "next/link";
import { Image as ImageIcon, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GalleryItem } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { GalleryTable } from "./GalleryTable";

export default async function AdminGalleryPage() {
  const supabase = await createClient();

  // 1. Fetch direct portfolio gallery records (excluding Homepage Featured Showcase)
  const { data: galleryData } = await supabase
    .from("gallery")
    .select("*")
    .neq("category", "Featured Showcase")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  // 2. Fetch service photos categorized by service type (Mehendi, Makeup, Draping, etc.)
  const { data: serviceImages } = await supabase
    .from("service_images")
    .select("*, services!inner(name, name_en, name_kn, category, active)");

  // 3. Fetch jewellery photos categorized by rental jewellery
  const { data: jewelleryImages } = await supabase
    .from("jewellery_images")
    .select("*, jewellery!inner(name, name_en, name_kn, category, active)");

  const directItems: GalleryItem[] = (galleryData as any[]) || [];

  const serviceGalleryItems: GalleryItem[] = (serviceImages || []).map((img: any) => ({
    id: `service-img-${img.id}`,
    title: img.services?.name_en || img.services?.name || "Service Photo",
    title_en: img.services?.name_en || img.services?.name || "Service Photo",
    title_kn: img.services?.name_kn || null,
    category: img.services?.category || "Services",
    description: "Service Attachment",
    description_en: "Service Attachment",
    description_kn: null,
    image_url: img.image_url,
    storage_path: img.storage_path || "",
    alt_text: img.alt_text || img.services?.name,
    alt_text_en: img.alt_text || img.services?.name,
    alt_text_kn: null,
    active: img.services?.active ?? true,
    display_order: img.display_order || 1,
    created_at: img.created_at || new Date().toISOString(),
    isReadonly: true, // System auto-aggregated photo
  }));

  const jewelleryGalleryItems: GalleryItem[] = (jewelleryImages || []).map((img: any) => ({
    id: `jewellery-img-${img.id}`,
    title: img.jewellery?.name_en || img.jewellery?.name || "Jewellery Set Photo",
    title_en: img.jewellery?.name_en || img.jewellery?.name || "Jewellery Set Photo",
    title_kn: img.jewellery?.name_kn || null,
    category: "Rental Jewellery",
    description: "Jewellery Inventory Photo",
    description_en: "Jewellery Inventory Photo",
    description_kn: null,
    image_url: img.image_url,
    storage_path: img.storage_path || "",
    alt_text: img.alt_text || img.jewellery?.name,
    alt_text_en: img.alt_text || img.jewellery?.name,
    alt_text_kn: null,
    active: img.jewellery?.active ?? true,
    display_order: img.display_order || 1,
    created_at: img.created_at || new Date().toISOString(),
    isReadonly: true, // System auto-aggregated photo
  }));

  const allGalleryItems: GalleryItem[] = [
    ...directItems,
    ...serviceGalleryItems,
    ...jewelleryGalleryItems,
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-cream-100 p-6 sm:p-8 rounded-3xl border border-gold-500/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Master Photo CMS</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Photo Gallery Management (Category Wise)
          </h1>
          <p className="text-xs sm:text-sm text-cream-200 mt-1">
            View, filter category-wise, reorder, and manage all uploaded photos across Gallery, Services, and Rental Jewellery.
          </p>
        </div>

        <Link href="/admin/gallery/new" className="shrink-0">
          <Button variant="gold" size="lg" leftIcon={<Plus className="w-5 h-5" />}>
            Upload Multiple Photos
          </Button>
        </Link>
      </div>

      {/* Gallery Table Component with Category Filtering */}
      <GalleryTable initialGallery={allGalleryItems} />
    </div>
  );
}
