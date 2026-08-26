"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createBatchGalleryItems(formData: FormData) {
  try {
    const supabase = await createClient();

    const baseTitle_en = (formData.get("title_en") as string) || (formData.get("title") as string) || "Showcase Photo";
    const baseTitle_kn = formData.get("title_kn") as string;
    const category = (formData.get("category") as string) || "Bridal Mehendi";
    const description_en = (formData.get("description_en") as string) || (formData.get("description") as string);
    const description_kn = formData.get("description_kn") as string;
    const active = formData.get("active") !== "false";

    const rawUrls = (formData.get("image_urls") as string) || "[]";
    let imageUrls: string[] = [];

    try {
      imageUrls = JSON.parse(rawUrls);
    } catch {
      const singleUrl = formData.get("image_url") as string;
      if (singleUrl) imageUrls = [singleUrl];
    }

    const singleUrlFallback = formData.get("image_url") as string;
    if (imageUrls.length === 0 && singleUrlFallback) {
      imageUrls = [singleUrlFallback];
    }

    if (imageUrls.length === 0) {
      return { error: "Please select at least one photo file." };
    }

    const catSlug = category.toLowerCase().replace(/[^a-z0-9]/g, "-");

    const itemsToInsert = imageUrls.map((url, idx) => {
      let storage_path = `gallery/${catSlug}/${Date.now()}-${idx}.webp`;
      if (url.includes("mehendiaura-images/")) {
        const parts = url.split("mehendiaura-images/");
        if (parts.length > 1) {
          storage_path = parts[1];
        }
      }

      const itemTitleEn = imageUrls.length > 1 ? `${baseTitle_en} #${idx + 1}` : baseTitle_en;
      const itemTitleKn = baseTitle_kn ? (imageUrls.length > 1 ? `${baseTitle_kn} #${idx + 1}` : baseTitle_kn) : null;

      return {
        title: itemTitleEn,
        title_en: itemTitleEn,
        title_kn: itemTitleKn,
        category,
        description: description_en || null,
        description_en: description_en || null,
        description_kn: description_kn || null,
        image_url: url,
        storage_path,
        alt_text: itemTitleEn,
        alt_text_en: itemTitleEn,
        alt_text_kn: itemTitleKn,
        active,
        display_order: idx + 1,
      };
    });

    const { error } = await supabase.from("gallery").insert(itemsToInsert);
    if (error) throw error;

    revalidatePath("/gallery", "layout");
    revalidatePath("/admin/gallery", "page");
    return { success: true, count: imageUrls.length };
  } catch (error: any) {
    return { error: error.message || "Failed to create gallery items." };
  }
}

export async function createGalleryItem(formData: FormData) {
  return createBatchGalleryItems(formData);
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

    // 1. Handle deletion of service attachment photos
    if (id.startsWith("service-img-")) {
      const realId = id.replace("service-img-", "");
      const { data: img } = await supabase
        .from("service_images")
        .select("image_url, storage_path")
        .eq("id", realId)
        .single();

      if (img) {
        let path = img.storage_path;
        if ((!path || !path.includes("/")) && img.image_url?.includes("mehendiaura-images/")) {
          path = img.image_url.split("mehendiaura-images/")[1];
        }
        if (path) {
          await supabase.storage.from("mehendiaura-images").remove([path]);
        }
      }

      await supabase.from("service_images").delete().eq("id", realId);
      revalidatePath("/services", "layout");
      revalidatePath("/gallery", "layout");
      revalidatePath("/admin/gallery", "page");
      return { success: true };
    }

    // 2. Handle deletion of jewellery attachment photos
    if (id.startsWith("jewellery-img-")) {
      const realId = id.replace("jewellery-img-", "");
      const { data: img } = await supabase
        .from("jewellery_images")
        .select("image_url, storage_path")
        .eq("id", realId)
        .single();

      if (img) {
        let path = img.storage_path;
        if ((!path || !path.includes("/")) && img.image_url?.includes("mehendiaura-images/")) {
          path = img.image_url.split("mehendiaura-images/")[1];
        }
        if (path) {
          await supabase.storage.from("mehendiaura-images").remove([path]);
        }
      }

      await supabase.from("jewellery_images").delete().eq("id", realId);
      revalidatePath("/jewellery", "layout");
      revalidatePath("/gallery", "layout");
      revalidatePath("/admin/gallery", "page");
      return { success: true };
    }

    // 3. Handle standard gallery item deletion
    const { data: item } = await supabase
      .from("gallery")
      .select("image_url, storage_path")
      .eq("id", id)
      .single();

    if (item) {
      let pathToRemove = item.storage_path;
      if ((!pathToRemove || !pathToRemove.includes("/")) && item.image_url?.includes("mehendiaura-images/")) {
        const parts = item.image_url.split("mehendiaura-images/");
        if (parts.length > 1) {
          pathToRemove = parts[1];
        }
      }

      if (pathToRemove) {
        await supabase.storage.from("mehendiaura-images").remove([pathToRemove]);
      }
    }

    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/gallery", "layout");
    revalidatePath("/admin/gallery", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete item." };
  }
}

export async function toggleGalleryActive(id: string, currentActive: boolean) {
  try {
    const supabase = await createClient();

    if (id.startsWith("service-img-")) {
      const realId = id.replace("service-img-", "");
      const { data: img } = await supabase.from("service_images").select("service_id").eq("id", realId).single();
      if (img?.service_id) {
        await supabase.from("services").update({ active: !currentActive }).eq("id", img.service_id);
      }
    } else if (id.startsWith("jewellery-img-")) {
      const realId = id.replace("jewellery-img-", "");
      const { data: img } = await supabase.from("jewellery_images").select("jewellery_id").eq("id", realId).single();
      if (img?.jewellery_id) {
        await supabase.from("jewellery").update({ active: !currentActive }).eq("id", img.jewellery_id);
      }
    } else {
      const { error } = await supabase
        .from("gallery")
        .update({ active: !currentActive })
        .eq("id", id);
      if (error) throw error;
    }

    revalidatePath("/gallery", "layout");
    revalidatePath("/admin/gallery", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle active status." };
  }
}

export async function toggleAllGalleryActive(
  active: boolean,
  categoryFilter?: string
) {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("gallery")
      .update({ active })
      .neq("category", "Featured Showcase");

    if (categoryFilter && categoryFilter !== "All") {
      query = query.eq("category", categoryFilter);
    }

    const { error } = await query;
    if (error) throw error;

    revalidatePath("/gallery", "layout");
    revalidatePath("/admin/gallery", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update gallery photos status." };
  }
}
