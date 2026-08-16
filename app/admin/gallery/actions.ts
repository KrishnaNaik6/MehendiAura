"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createGalleryItem(formData: FormData) {
  try {
    const supabase = await createClient();

    const title_en = formData.get("title_en") as string || formData.get("title") as string;
    const title_kn = formData.get("title_kn") as string;
    const category = (formData.get("category") as string) || "Bridal Mehendi";
    const description_en = formData.get("description_en") as string || formData.get("description") as string;
    const description_kn = formData.get("description_kn") as string;
    const image_url = formData.get("image_url") as string;
    const alt_text_en = (formData.get("alt_text_en") as string) || title_en;
    const alt_text_kn = formData.get("alt_text_kn") as string;
    const active = formData.get("active") !== "false";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

    if (!title_en || !image_url) {
      return { error: "Please provide English title and image URL." };
    }

    const { data: item, error } = await supabase
      .from("gallery")
      .insert({
        title: title_en,
        title_en,
        title_kn: title_kn || null,
        category,
        description: description_en || null,
        description_en: description_en || null,
        description_kn: description_kn || null,
        image_url,
        storage_path: `gallery/${Date.now()}.jpg`,
        alt_text: alt_text_en || null,
        alt_text_en: alt_text_en || null,
        alt_text_kn: alt_text_kn || null,
        active,
        display_order,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/gallery", "layout");
    revalidatePath("/admin/gallery", "page");
    return { success: true, itemId: item.id };
  } catch (error: any) {
    return { error: error.message || "Failed to create gallery item." };
  }
}

export async function updateGalleryItem(id: string, formData: FormData) {
  try {
    const supabase = await createClient();

    const title_en = formData.get("title_en") as string || formData.get("title") as string;
    const title_kn = formData.get("title_kn") as string;
    const category = formData.get("category") as string;
    const description_en = formData.get("description_en") as string || formData.get("description") as string;
    const description_kn = formData.get("description_kn") as string;
    const image_url = formData.get("image_url") as string;
    const active = formData.get("active") === "true";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

    const { error } = await supabase
      .from("gallery")
      .update({
        title: title_en,
        title_en,
        title_kn: title_kn || null,
        category,
        description: description_en || null,
        description_en: description_en || null,
        description_kn: description_kn || null,
        image_url,
        active,
        display_order,
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/gallery", "layout");
    revalidatePath("/admin/gallery", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update gallery item." };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/gallery", "layout");
    revalidatePath("/admin/gallery", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete gallery item." };
  }
}

export async function toggleGalleryActive(id: string, currentActive: boolean) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("gallery")
      .update({ active: !currentActive })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/gallery", "layout");
    revalidatePath("/admin/gallery", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle active status." };
  }
}
