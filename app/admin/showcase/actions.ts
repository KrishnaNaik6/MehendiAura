"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { GalleryItem } from "@/types/database";

export async function fetchShowcaseItems() {
  try {
    const supabase = await createClient();

    // Strictly fetch only Featured Showcase items (completely separate from general gallery)
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("category", "Featured Showcase")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { items: (data as GalleryItem[]) || [] };
  } catch (error: any) {
    return { items: [], error: error.message || "Failed to fetch showcase items." };
  }
}

export async function addItemsToShowcase(
  items: {
    url: string;
    title?: string;
    title_kn?: string;
    category?: string;
    storage_path?: string;
  }[]
) {
  try {
    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("gallery")
      .select("display_order, image_url")
      .eq("category", "Featured Showcase");

    const existingUrls = new Set(existing?.map((i) => i.image_url) || []);
    const filtered = items.filter((i) => !existingUrls.has(i.url));

    if (filtered.length === 0) {
      return { success: true, message: "Selected photos are already in showcase." };
    }

    const maxOrder = existing?.reduce((max, i) => Math.max(max, i.display_order || 0), 0) || 0;

    const inserts = filtered.map((item, idx) => {
      let storage_path = item.storage_path;
      if (!storage_path && item.url.includes("mehendiaura-images/")) {
        storage_path = item.url.split("mehendiaura-images/")[1];
      }
      if (!storage_path) {
        storage_path = `gallery/showcase/${Date.now()}-${idx}.webp`;
      }

      const titleEn = item.title || "Featured Showcase Slide";

      return {
        title: titleEn,
        title_en: titleEn,
        title_kn: item.title_kn || null,
        category: "Featured Showcase", // Enforce dedicated showcase category
        description: null,
        description_en: null,
        description_kn: null,
        image_url: item.url,
        storage_path,
        alt_text: titleEn,
        alt_text_en: titleEn,
        alt_text_kn: item.title_kn || null,
        active: true,
        display_order: maxOrder + idx + 1,
      };
    });

    const { error } = await supabase.from("gallery").insert(inserts);
    if (error) throw error;

    revalidatePath("/", "layout");
    revalidatePath("/admin/showcase", "page");
    return { success: true, count: inserts.length };
  } catch (error: any) {
    return { error: error.message || "Failed to add photos to showcase." };
  }
}

export async function reorderShowcaseItems(orderedIds: string[]) {
  try {
    const supabase = await createClient();

    for (let idx = 0; idx < orderedIds.length; idx++) {
      const id = orderedIds[idx];
      await supabase
        .from("gallery")
        .update({ display_order: idx + 1 })
        .eq("id", id)
        .eq("category", "Featured Showcase");
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/showcase", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to save showcase order." };
  }
}

export async function toggleShowcaseItemActive(id: string, currentActive: boolean) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("gallery")
      .update({ active: !currentActive })
      .eq("id", id)
      .eq("category", "Featured Showcase");

    if (error) throw error;

    revalidatePath("/", "layout");
    revalidatePath("/admin/showcase", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle showcase visibility." };
  }
}

export async function toggleAllShowcaseActive(active: boolean) {
  try {
    const supabase = await createClient();

    // Strictly update only Featured Showcase records
    const { error } = await supabase
      .from("gallery")
      .update({ active })
      .eq("category", "Featured Showcase");

    if (error) throw error;

    revalidatePath("/", "layout");
    revalidatePath("/admin/showcase", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update all showcase slides." };
  }
}

export async function updateShowcaseItemDetails(
  id: string,
  formData: FormData
) {
  try {
    const supabase = await createClient();

    const title_en = (formData.get("title_en") as string) || (formData.get("title") as string) || "Showcase Photo";
    const title_kn = formData.get("title_kn") as string;
    const description_en = formData.get("description_en") as string;
    const description_kn = formData.get("description_kn") as string;
    const active = formData.get("active") === "true";

    const { error } = await supabase
      .from("gallery")
      .update({
        title: title_en,
        title_en,
        title_kn: title_kn || null,
        category: "Featured Showcase",
        description: description_en || null,
        description_en: description_en || null,
        description_kn: description_kn || null,
        alt_text: title_en,
        alt_text_en: title_en,
        alt_text_kn: title_kn || null,
        active,
      })
      .eq("id", id)
      .eq("category", "Featured Showcase");

    if (error) throw error;

    revalidatePath("/", "layout");
    revalidatePath("/admin/showcase", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update showcase item details." };
  }
}

export async function deleteShowcaseItem(id: string) {
  try {
    const supabase = await createClient();

    // Delete only the showcase slide record (without touching gallery, services, or jewellery)
    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id)
      .eq("category", "Featured Showcase");

    if (error) throw error;

    // Re-index remaining showcase slides
    const { data: remaining } = await supabase
      .from("gallery")
      .select("id")
      .eq("category", "Featured Showcase")
      .order("display_order", { ascending: true });

    if (remaining && remaining.length > 0) {
      for (let idx = 0; idx < remaining.length; idx++) {
        await supabase
          .from("gallery")
          .update({ display_order: idx + 1 })
          .eq("id", remaining[idx].id);
      }
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/showcase", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to remove item from showcase." };
  }
}
