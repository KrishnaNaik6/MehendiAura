"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createJewellery(formData: FormData) {
  try {
    const supabase = await createClient();

    const name_en = formData.get("name_en") as string || formData.get("name") as string;
    const name_kn = formData.get("name_kn") as string;
    const category = (formData.get("category") as string) || "Bridal Sets";
    const rental_price = parseFloat((formData.get("rental_price") as string) || "0");
    const security_deposit = parseFloat((formData.get("security_deposit") as string) || "0");
    const availability_status = (formData.get("availability_status") as string) || "available";
    
    const included_raw_en = (formData.get("included_items_en") as string) || (formData.get("included_items") as string) || "";
    const included_raw_kn = (formData.get("included_items_kn") as string) || "";
    const included_items_en = included_raw_en.split("\n").map((i) => i.trim()).filter(Boolean);
    const included_items_kn = included_raw_kn.split("\n").map((i) => i.trim()).filter(Boolean);

    const short_description_en = formData.get("short_description_en") as string || formData.get("short_description") as string;
    const short_description_kn = formData.get("short_description_kn") as string;
    const description_en = formData.get("description_en") as string || formData.get("description") as string;
    const description_kn = formData.get("description_kn") as string;
    const featured = formData.get("featured") === "true";
    const active = formData.get("active") !== "false";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

    if (!name_en || !short_description_en) {
      return { error: "Please provide English Jewellery Set Name and Short Description." };
    }

    const slug = name_en
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const { data: item, error } = await supabase
      .from("jewellery")
      .insert({
        name: name_en,
        name_en,
        name_kn: name_kn || null,
        slug,
        category,
        rental_price: rental_price || null,
        security_deposit: security_deposit || null,
        availability_status,
        included_items: included_items_en,
        included_items_en,
        included_items_kn: included_items_kn.length > 0 ? included_items_kn : null,
        short_description: short_description_en,
        short_description_en,
        short_description_kn: short_description_kn || null,
        description: description_en || short_description_en,
        description_en: description_en || short_description_en,
        description_kn: description_kn || null,
        featured,
        active,
        display_order,
      })
      .select()
      .single();

    if (error) throw error;

    // Parse single or multiple image URLs
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

    if (imageUrls.length > 0 && item) {
      const imageInserts = imageUrls.map((url, idx) => {
        let storage_path = `jewellery/${Date.now()}-${idx}.webp`;
        if (url.includes("mehendiaura-images/")) {
          const parts = url.split("mehendiaura-images/");
          if (parts.length > 1) {
            storage_path = parts[1];
          }
        }

        return {
          jewellery_id: item.id,
          image_url: url,
          storage_path,
          alt_text: name_en,
          display_order: idx + 1,
        };
      });

      await supabase.from("jewellery_images").insert(imageInserts);
    }

    revalidatePath("/jewellery", "layout");
    revalidatePath("/admin/jewellery", "page");
    return { success: true, itemId: item.id };
  } catch (error: any) {
    return { error: error.message || "Failed to create jewellery item." };
  }
}

export async function updateJewellery(id: string, formData: FormData) {
  try {
    const supabase = await createClient();

    const name_en = formData.get("name_en") as string || formData.get("name") as string;
    const name_kn = formData.get("name_kn") as string;
    const category = formData.get("category") as string;
    const rental_price = parseFloat((formData.get("rental_price") as string) || "0");
    const security_deposit = parseFloat((formData.get("security_deposit") as string) || "0");
    const availability_status = formData.get("availability_status") as string;

    const included_raw_en = (formData.get("included_items_en") as string) || (formData.get("included_items") as string) || "";
    const included_raw_kn = (formData.get("included_items_kn") as string) || "";
    const included_items_en = included_raw_en.split("\n").map((i) => i.trim()).filter(Boolean);
    const included_items_kn = included_raw_kn.split("\n").map((i) => i.trim()).filter(Boolean);

    const short_description_en = formData.get("short_description_en") as string || formData.get("short_description") as string;
    const short_description_kn = formData.get("short_description_kn") as string;
    const description_en = formData.get("description_en") as string || formData.get("description") as string;
    const description_kn = formData.get("description_kn") as string;
    const featured = formData.get("featured") === "true";
    const active = formData.get("active") === "true";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

    const { error } = await supabase
      .from("jewellery")
      .update({
        name: name_en,
        name_en,
        name_kn: name_kn || null,
        category,
        rental_price: rental_price || null,
        security_deposit: security_deposit || null,
        availability_status,
        included_items: included_items_en,
        included_items_en,
        included_items_kn: included_items_kn.length > 0 ? included_items_kn : null,
        short_description: short_description_en,
        short_description_en,
        short_description_kn: short_description_kn || null,
        description: description_en,
        description_en,
        description_kn: description_kn || null,
        featured,
        active,
        display_order,
      })
      .eq("id", id);

    if (error) throw error;

    // Optional update of attached images if provided
    const rawUrls = (formData.get("image_urls") as string) || "[]";
    let imageUrls: string[] = [];
    try {
      imageUrls = JSON.parse(rawUrls);
    } catch {
      const singleUrl = formData.get("image_url") as string;
      if (singleUrl) imageUrls = [singleUrl];
    }

    if (imageUrls.length > 0) {
      const { data: existingImgs } = await supabase
        .from("jewellery_images")
        .select("image_url")
        .eq("jewellery_id", id);

      const existingUrls = new Set(existingImgs?.map((i) => i.image_url) || []);
      const newUrlsToInsert = imageUrls.filter((url) => !existingUrls.has(url));

      if (newUrlsToInsert.length > 0) {
        const startOrder = (existingImgs?.length || 0) + 1;
        const imageInserts = newUrlsToInsert.map((url, idx) => ({
          jewellery_id: id,
          image_url: url,
          storage_path: url.includes("mehendiaura-images/") ? url.split("mehendiaura-images/")[1] : `jewellery/${Date.now()}-${idx}.webp`,
          alt_text: name_en,
          display_order: startOrder + idx,
        }));
        await supabase.from("jewellery_images").insert(imageInserts);
      }
    }

    revalidatePath("/jewellery", "layout");
    revalidatePath(`/admin/jewellery/${id}/edit`, "page");
    revalidatePath("/admin/jewellery", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update jewellery item." };
  }
}

export async function deleteJewellery(id: string) {
  try {
    const supabase = await createClient();

    const { data: images } = await supabase
      .from("jewellery_images")
      .select("image_url, storage_path")
      .eq("jewellery_id", id);

    if (images && images.length > 0) {
      const pathsToRemove: string[] = [];
      images.forEach((img) => {
        let path = img.storage_path;
        if ((!path || !path.includes("/")) && img.image_url?.includes("mehendiaura-images/")) {
          const parts = img.image_url.split("mehendiaura-images/");
          if (parts.length > 1) {
            path = parts[1];
          }
        }
        if (path) pathsToRemove.push(path);
      });

      if (pathsToRemove.length > 0) {
        await supabase.storage.from("mehendiaura-images").remove(pathsToRemove);
      }
    }

    const { error } = await supabase.from("jewellery").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/jewellery", "layout");
    revalidatePath("/admin/jewellery", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete jewellery item." };
  }
}

export async function toggleJewelleryActive(id: string, currentActive: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("jewellery")
      .update({ active: !currentActive })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/jewellery", "layout");
    revalidatePath("/admin/jewellery", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle active status." };
  }
}

export async function toggleJewelleryFeatured(id: string, currentFeatured: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("jewellery")
      .update({ featured: !currentFeatured })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/jewellery", "layout");
    revalidatePath("/admin/jewellery", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle featured status." };
  }
}

// -------------------------------------------------------------
// JEWELLERY IMAGES MANAGEMENT ACTIONS
// -------------------------------------------------------------

export async function addJewelleryImages(
  jewelleryId: string,
  imageItems: { url: string; storage_path?: string; alt_text?: string }[]
) {
  try {
    const supabase = await createClient();

    const { data: existingImages } = await supabase
      .from("jewellery_images")
      .select("display_order, image_url")
      .eq("jewellery_id", jewelleryId);

    const existingUrls = new Set(existingImages?.map((i) => i.image_url) || []);
    const filteredItems = imageItems.filter((item) => !existingUrls.has(item.url));

    if (filteredItems.length === 0) {
      return { success: true, message: "No new unique images to add." };
    }

    const maxOrder = existingImages?.reduce((max, i) => Math.max(max, i.display_order || 0), 0) || 0;

    const inserts = filteredItems.map((item, idx) => {
      let storage_path = item.storage_path;
      if (!storage_path && item.url.includes("mehendiaura-images/")) {
        storage_path = item.url.split("mehendiaura-images/")[1];
      }
      if (!storage_path) {
        storage_path = `jewellery/${Date.now()}-${idx}.webp`;
      }

      return {
        jewellery_id: jewelleryId,
        image_url: item.url,
        storage_path,
        alt_text: item.alt_text || "Jewellery Photo",
        display_order: maxOrder + idx + 1,
      };
    });

    const { error } = await supabase.from("jewellery_images").insert(inserts);
    if (error) throw error;

    revalidatePath("/jewellery", "layout");
    revalidatePath(`/admin/jewellery/${jewelleryId}/edit`, "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to add jewellery images." };
  }
}

export async function deleteJewelleryImage(imageId: string, jewelleryId: string) {
  try {
    const supabase = await createClient();

    // 1. Fetch image info before deleting row
    const { data: img } = await supabase
      .from("jewellery_images")
      .select("image_url, storage_path")
      .eq("id", imageId)
      .single();

    if (img) {
      let storagePath = img.storage_path;
      if (!storagePath && img.image_url?.includes("mehendiaura-images/")) {
        storagePath = img.image_url.split("mehendiaura-images/")[1];
      }

      if (storagePath) {
        // Check if this storagePath is referenced by any other database records
        const [{ count: countService }, { count: countJewellery }, { count: countGallery }] = await Promise.all([
          supabase.from("service_images").select("*", { count: "exact", head: true }).eq("storage_path", storagePath),
          supabase.from("jewellery_images").select("*", { count: "exact", head: true }).eq("storage_path", storagePath).neq("id", imageId),
          supabase.from("gallery").select("*", { count: "exact", head: true }).eq("storage_path", storagePath),
        ]);

        const isShared = (countService || 0) + (countJewellery || 0) + (countGallery || 0) > 0;

        if (!isShared) {
          try {
            await supabase.storage.from("mehendiaura-images").remove([storagePath]);
          } catch {
            // Storage cleanup failure handled safely without breaking db state
          }
        }
      }
    }

    // 2. Delete database record
    const { error } = await supabase.from("jewellery_images").delete().eq("id", imageId);
    if (error) throw error;

    // 3. Re-index display_order for remaining images
    const { data: remaining } = await supabase
      .from("jewellery_images")
      .select("id")
      .eq("jewellery_id", jewelleryId)
      .order("display_order", { ascending: true });

    if (remaining && remaining.length > 0) {
      for (let idx = 0; idx < remaining.length; idx++) {
        await supabase
          .from("jewellery_images")
          .update({ display_order: idx + 1 })
          .eq("id", remaining[idx].id);
      }
    }

    revalidatePath("/jewellery", "layout");
    revalidatePath(`/admin/jewellery/${jewelleryId}/edit`, "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete jewellery image." };
  }
}

export async function reorderJewelleryImages(jewelleryId: string, imageIdsInOrder: string[]) {
  try {
    const supabase = await createClient();

    for (let idx = 0; idx < imageIdsInOrder.length; idx++) {
      const id = imageIdsInOrder[idx];
      await supabase
        .from("jewellery_images")
        .update({ display_order: idx + 1 })
        .eq("id", id);
    }

    revalidatePath("/jewellery", "layout");
    revalidatePath(`/admin/jewellery/${jewelleryId}/edit`, "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to reorder jewellery images." };
  }
}

export async function updateJewelleryImageAltText(imageId: string, altText: string, jewelleryId: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("jewellery_images")
      .update({ alt_text: altText })
      .eq("id", imageId);

    if (error) throw error;

    revalidatePath("/jewellery", "layout");
    revalidatePath(`/admin/jewellery/${jewelleryId}/edit`, "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update image alt text." };
  }
}

export async function toggleJewelleryImageVisibility(
  imageId: string,
  currentAltText: string | null,
  jewelleryId: string
) {
  try {
    const isCurrentlyHidden = currentAltText?.startsWith("[hidden]");
    const cleanText = (currentAltText || "").replace("[hidden]", "").trim() || "Jewellery Photo";
    const newAlt = isCurrentlyHidden ? cleanText : `[hidden] ${cleanText}`;

    return await updateJewelleryImageAltText(imageId, newAlt, jewelleryId);
  } catch (error: any) {
    return { error: error.message || "Failed to toggle image visibility." };
  }
}

export async function setJewelleryImageAsPrimary(
  imageId: string,
  jewelleryId: string
) {
  try {
    const supabase = await createClient();

    const { data: images } = await supabase
      .from("jewellery_images")
      .select("id, display_order, alt_text")
      .eq("jewellery_id", jewelleryId)
      .order("display_order", { ascending: true });

    if (!images || images.length === 0) return { success: true };

    // Ensure image is unhidden if set as primary
    const targetImg = images.find((i) => i.id === imageId);
    if (targetImg && targetImg.alt_text?.startsWith("[hidden]")) {
      await updateJewelleryImageAltText(
        imageId,
        targetImg.alt_text.replace("[hidden]", "").trim() || "Jewellery Photo",
        jewelleryId
      );
    }

    const remaining = images.filter((img) => img.id !== imageId);
    const newOrderIds = [imageId, ...remaining.map((img) => img.id)];

    return await reorderJewelleryImages(jewelleryId, newOrderIds);
  } catch (error: any) {
    return { error: error.message || "Failed to set image as primary." };
  }
}

export async function toggleAllJewelleryImagesVisibility(
  jewelleryId: string,
  visible: boolean
) {
  try {
    const supabase = await createClient();

    const { data: images } = await supabase
      .from("jewellery_images")
      .select("id, alt_text")
      .eq("jewellery_id", jewelleryId);

    if (!images || images.length === 0) return { success: true };

    for (const img of images) {
      const clean = (img.alt_text || "").replace("[hidden]", "").trim() || "Jewellery Photo";
      const newAlt = visible ? clean : `[hidden] ${clean}`;
      await supabase
        .from("jewellery_images")
        .update({ alt_text: newAlt })
        .eq("id", img.id);
    }

    revalidatePath("/jewellery", "layout");
    revalidatePath(`/admin/jewellery/${jewelleryId}/edit`, "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update all jewellery images." };
  }
}
