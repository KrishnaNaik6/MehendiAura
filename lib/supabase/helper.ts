import { BusinessSettings } from "@/types/database";
import { createClient as createBrowserSupabase } from "@/lib/supabase/client";

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  id: "default-settings",
  business_name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "MehendiAura",
  phone: process.env.NEXT_PUBLIC_DEFAULT_PHONE || "+919876543210",
  whatsapp: process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "919876543210",
  email: "contact@mehendiaura.com",
  address: "Studio #12, Wedding Boulevard, MG Road, City Center",
  google_maps_url: "https://maps.google.com",
  business_hours: "Mon - Sun: 9:00 AM - 9:00 PM",
  instagram_url: "https://instagram.com/mehendiaura",
  facebook_url: "https://facebook.com/mehendiaura",
  youtube_url: null,
  logo_url: null,
  hero_image_url: null,
  hero_title: "Exquisite Mehendi Artistry & Premium Rental Jewellery",
  hero_description: "Crafting unforgettable bridal mehendi designs & curating regal rental jewellery sets for weddings and grand celebrations.",
  about_content: "MehendiAura is a premier bridal mehendi artistry and rental jewellery studio dedicated to timeless Indian wedding traditions.",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

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
