"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
    
    const hero_title_en = formData.get("hero_title_en") as string || formData.get("hero_title") as string;
    const hero_title_kn = formData.get("hero_title_kn") as string;
    const hero_description_en = formData.get("hero_description_en") as string || formData.get("hero_description") as string;
    const hero_description_kn = formData.get("hero_description_kn") as string;
    const about_content_en = formData.get("about_content_en") as string || formData.get("about_content") as string;
    const about_content_kn = formData.get("about_content_kn") as string;

    const { data: existing } = await supabase.from("business_settings").select("id").limit(1).single();

    const payload = {
      business_name,
      phone,
      whatsapp,
      email: email || null,
      address,
      google_maps_url: google_maps_url || null,
      business_hours,
      instagram_url: instagram_url || null,
      facebook_url: facebook_url || null,
      youtube_url: youtube_url || null,
      hero_title: hero_title_en,
      hero_title_en,
      hero_title_kn: hero_title_kn || null,
      hero_description: hero_description_en,
      hero_description_en,
      hero_description_kn: hero_description_kn || null,
      about_content: about_content_en,
      about_content_en,
      about_content_kn: about_content_kn || null,
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      const { error } = await supabase.from("business_settings").update(payload).eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("business_settings").insert(payload);
      if (error) throw error;
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings", "page");

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update settings." };
  }
}
