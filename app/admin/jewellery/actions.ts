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
      await supabase.from("jewellery_images").delete().eq("jewellery_id", id);
      const imageInserts = imageUrls.map((url, idx) => ({
        jewellery_id: id,
        image_url: url,
        storage_path: url.includes("mehendiaura-images/") ? url.split("mehendiaura-images/")[1] : `jewellery/${Date.now()}-${idx}.webp`,
        alt_text: name_en,
        display_order: idx + 1,
      }));
      await supabase.from("jewellery_images").insert(imageInserts);
    }

    revalidatePath("/jewellery", "layout");
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
