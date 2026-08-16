"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createJewellery(formData: FormData) {
  try {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const category = (formData.get("category") as string) || "Bridal Sets";
    const short_description = formData.get("short_description") as string;
    const description = formData.get("description") as string;
    const rental_price = parseFloat((formData.get("rental_price") as string) || "0");
    const security_deposit = parseFloat((formData.get("security_deposit") as string) || "0");
    const availability_status = (formData.get("availability_status") as string) || "available";
    const included_items_raw = formData.get("included_items") as string;
    const included_items = included_items_raw
      ? included_items_raw.split("\n").map((i) => i.trim()).filter(Boolean)
      : [];
    const featured = formData.get("featured") === "true";
    const active = formData.get("active") !== "false";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);
    const imageUrl = formData.get("image_url") as string;

    const { data: item, error } = await supabase
      .from("jewellery")
      .insert({
        name,
        slug,
        category,
        short_description,
        description,
        rental_price: rental_price || null,
        security_deposit: security_deposit || null,
        availability_status,
        included_items,
        featured,
        active,
        display_order,
      })
      .select()
      .single();

    if (error) throw error;

    // Attach initial image if provided
    if (imageUrl && item) {
      await supabase.from("jewellery_images").insert({
        jewellery_id: item.id,
        image_url: imageUrl,
        storage_path: `jewellery/${item.id}/main.jpg`,
        alt_text: name,
        display_order: 1,
      });
    }

    revalidatePath("/jewellery", "page");
    revalidatePath("/admin/jewellery", "page");
    return { success: true, itemId: item.id };
  } catch (error: any) {
    return { error: error.message || "Failed to create jewellery entry." };
  }
}

export async function updateJewellery(id: string, formData: FormData) {
  try {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const short_description = formData.get("short_description") as string;
    const description = formData.get("description") as string;
    const rental_price = parseFloat((formData.get("rental_price") as string) || "0");
    const security_deposit = parseFloat((formData.get("security_deposit") as string) || "0");
    const availability_status = (formData.get("availability_status") as string) || "available";
    const included_items_raw = formData.get("included_items") as string;
    const included_items = included_items_raw
      ? included_items_raw.split("\n").map((i) => i.trim()).filter(Boolean)
      : [];
    const featured = formData.get("featured") === "true";
    const active = formData.get("active") === "true";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

    const { error } = await supabase
      .from("jewellery")
      .update({
        name,
        slug,
        category,
        short_description,
        description,
        rental_price: rental_price || null,
        security_deposit: security_deposit || null,
        availability_status,
        included_items,
        featured,
        active,
        display_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/jewellery", "page");
    revalidatePath(`/jewellery/${slug}`, "page");
    revalidatePath("/admin/jewellery", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update jewellery item." };
  }
}

export async function deleteJewellery(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("jewellery").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/jewellery", "page");
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
      .update({ active: !currentActive, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/jewellery", "page");
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
      .update({ featured: !currentFeatured, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/", "page");
    revalidatePath("/jewellery", "page");
    revalidatePath("/admin/jewellery", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle featured status." };
  }
}
