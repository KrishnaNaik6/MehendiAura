"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createGalleryItem(formData: FormData) {
  try {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const category = (formData.get("category") as string) || "Bridal Mehendi";
    const description = formData.get("description") as string;
    const image_url = formData.get("image_url") as string;
    const alt_text = (formData.get("alt_text") as string) || title;
    const active = formData.get("active") !== "false";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

    if (!title || !image_url) {
      return { error: "Please provide a title and image URL." };
    }

    const { data: item, error } = await supabase
      .from("gallery")
      .insert({
        title,
        category,
        description: description || null,
        image_url,
        storage_path: `gallery/${Date.now()}.jpg`,
        alt_text: alt_text || null,
        active,
        display_order,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/gallery", "page");
    revalidatePath("/admin/gallery", "page");
    return { success: true, itemId: item.id };
  } catch (error: any) {
    return { error: error.message || "Failed to create gallery item." };
  }
}

export async function updateGalleryItem(id: string, formData: FormData) {
  try {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const image_url = formData.get("image_url") as string;
    const active = formData.get("active") === "true";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

    const { error } = await supabase
      .from("gallery")
      .update({
        title,
        category,
        description: description || null,
        image_url,
        active,
        display_order,
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/gallery", "page");
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

    revalidatePath("/gallery", "page");
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

    revalidatePath("/gallery", "page");
    revalidatePath("/admin/gallery", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle active status." };
  }
}
