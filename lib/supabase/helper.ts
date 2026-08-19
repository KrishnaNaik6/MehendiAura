import { BusinessSettings } from "@/types/database";
import { createClient as createBrowserSupabase } from "@/lib/supabase/client";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  id: "default-settings",
  business_name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "MHendi by Mamatha",
  phone: process.env.NEXT_PUBLIC_DEFAULT_PHONE || "+919876543210",
  whatsapp: process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "919876543210",
  email: "contact@mhendibymamatha.com",
  address: "Main Studio & Rental Store, Sagara, Karnataka 577401",
  google_maps_url: "https://maps.google.com/?q=Sagara+Karnataka",
  business_hours: "Mon - Sun: 9:00 AM - 9:00 PM",
  instagram_url: "https://instagram.com/mhendibymamatha",
  facebook_url: "https://facebook.com/mhendibymamatha",
  youtube_url: null,
  logo_url: null,
  hero_image_url: null,
  hero_title: "Exquisite Sagara Mehendi Artistry & Premium Rental Jewellary",
  hero_description: "MHendi by Mamatha (Mamatha Sagara / Mamatha Sagar) - Crafting unforgettable bridal mehendi designs & curating regal rental jewellery sets in Sagara.",
  about_content: "MHendi by Mamatha (Mamatha Sagara) is a premier bridal mehendi artistry and rental jewellery studio in Sagara, Karnataka.",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export interface StorageStats {
  usedStorageMb: number;
  totalStorageMb: number;
  freeStorageMb: number;
  usagePercentage: number;
  totalUploadedFiles: number;
  dbRecordsCount: number;
}

export async function fetchBusinessSettings(): Promise<BusinessSettings> {
  try {
    const supabase = createBrowserSupabase();
    const { data, error } = await supabase
      .from("business_settings")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return DEFAULT_BUSINESS_SETTINGS;
    }

    return data as BusinessSettings;
  } catch {
    return DEFAULT_BUSINESS_SETTINGS;
  }
}

export async function fetchStorageStats(): Promise<StorageStats> {
  try {
    const supabase = await createServerSupabase();
    let totalBytes = 0;
    let totalFiles = 0;

    const folders = ["services", "jewellery", "gallery", "branding", ""];
    for (const folder of folders) {
      const { data: files } = await supabase.storage
        .from("mehendiaura-images")
        .list(folder, { limit: 100 });

      if (files) {
        files.forEach((file) => {
          if (file.name && file.name !== ".emptyFolderPlaceholder") {
            const size = file.metadata?.size || 450 * 1024;
            totalBytes += size;
            totalFiles += 1;
          }
        });
      }
    }

    // Query database record counts for accurate estimation
    const [{ count: galleryCount }, { count: serviceImgCount }, { count: jewelleryImgCount }, { count: servicesCount }, { count: jewelleryCount }, { count: testimonialsCount }, { count: faqsCount }] = await Promise.all([
      supabase.from("gallery").select("*", { count: "exact", head: true }),
      supabase.from("service_images").select("*", { count: "exact", head: true }),
      supabase.from("jewellery_images").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("jewellery").select("*", { count: "exact", head: true }),
      supabase.from("testimonials").select("*", { count: "exact", head: true }),
      supabase.from("faqs").select("*", { count: "exact", head: true }),
    ]);

    const totalDbRecords = (galleryCount || 0) + (serviceImgCount || 0) + (jewelleryImgCount || 0) + (servicesCount || 0) + (jewelleryCount || 0) + (testimonialsCount || 0) + (faqsCount || 0);
    const dbImagesCount = (galleryCount || 0) + (serviceImgCount || 0) + (jewelleryImgCount || 0);

    if (totalFiles === 0 && dbImagesCount > 0) {
      totalFiles = dbImagesCount;
      totalBytes = dbImagesCount * 450 * 1024; // ~450 KB per photo average
    }

    const usedMb = parseFloat((totalBytes / (1024 * 1024)).toFixed(2));
    const totalMb = 1000; // 1,000 MB (1 GB) Supabase Free Tier limit
    const freeMb = parseFloat(Math.max(0, totalMb - usedMb).toFixed(2));
    const usagePercentage = Math.min(100, parseFloat(((usedMb / totalMb) * 100).toFixed(1)));

    return {
      usedStorageMb: usedMb,
      totalStorageMb: totalMb,
      freeStorageMb: freeMb,
      usagePercentage,
      totalUploadedFiles: Math.max(totalFiles, dbImagesCount),
      dbRecordsCount: totalDbRecords,
    };
  } catch {
    return {
      usedStorageMb: 0,
      totalStorageMb: 1000,
      freeStorageMb: 1000,
      usagePercentage: 0,
      totalUploadedFiles: 0,
      dbRecordsCount: 0,
    };
  }
}
