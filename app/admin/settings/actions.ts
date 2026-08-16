"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { BusinessSettings } from "@/types/database";

export async function updateBusinessSettings(formData: FormData) {
  try {
    const supabase = await createClient();

    const business_name = formData.get("business_name") as string;
    const phone = formData.get("phone") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const google_maps_url = formData.get("google_maps_url") as string;
    const business_hours = formData.get("business_hours") as string;
    const instagram_url = formData.get("instagram_url") as string;
    const facebook_url = formData.get("facebook_url") as string;
    const youtube_url = formData.get("youtube_url") as string;
    const hero_title = formData.get("hero_title") as string;
    const hero_description = formData.get("hero_description") as string;
    const about_content = formData.get("about_content") as string;
    const logo_url = formData.get("logo_url") as string;
    const hero_image_url = formData.get("hero_image_url") as string;

    const payload: Partial<BusinessSettings> = {
      business_name: business_name || "MehendiAura",
      phone: phone || "+919876543210",
      whatsapp: whatsapp || "919876543210",
      email: email || null,
      address: address || "Main Studio & Rental Store",
      google_maps_url: google_maps_url || null,
      business_hours: business_hours || "Mon - Sun: 9:00 AM - 9:00 PM",
      instagram_url: instagram_url || null,
      facebook_url: facebook_url || null,
      youtube_url: youtube_url || null,
      hero_title: hero_title || "Exquisite Mehendi Artistry & Premium Rental Jewellery",
      hero_description: hero_description || "Crafting unforgettable bridal mehendi designs...",
      about_content: about_content || "MehendiAura is a premier studio...",
      logo_url: logo_url || null,
      hero_image_url: hero_image_url || null,
      updated_at: new Date().toISOString(),
    };

    // Check if row exists in business_settings
    const { data: existing } = await supabase
      .from("business_settings")
      .select("id")
      .limit(1);

    if (existing && existing.length > 0) {
      const { error } = await supabase
        .from("business_settings")
        .update(payload)
        .eq("id", existing[0].id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("business_settings")
        .insert(payload);

      if (error) throw error;
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings", "page");
    return { success: true, message: "Business settings saved successfully!" };
  } catch (error: any) {
    return { error: error.message || "Failed to update business settings." };
  }
}
