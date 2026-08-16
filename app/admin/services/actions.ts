"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createService(formData: FormData) {
  try {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const category = (formData.get("category") as string) || "Bridal";
    const short_description = formData.get("short_description") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const duration = formData.get("duration") as string;
    const featured = formData.get("featured") === "true";
    const active = formData.get("active") !== "false";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);
    const imageUrl = formData.get("image_url") as string;

    const { data: service, error } = await supabase
      .from("services")
      .insert({
        name,
        slug,
        category,
        short_description,
        description,
        price: price || null,
        duration: duration || null,
        featured,
        active,
        display_order,
      })
      .select()
      .single();

    if (error) throw error;

    // If initial image URL provided, attach to service_images
    if (imageUrl && service) {
      await supabase.from("service_images").insert({
        service_id: service.id,
        image_url: imageUrl,
        storage_path: `services/${service.id}/main.jpg`,
        alt_text: name,
        display_order: 1,
      });
    }

    revalidatePath("/services", "page");
    revalidatePath("/admin/services", "page");
    return { success: true, serviceId: service.id };
  } catch (error: any) {
    return { error: error.message || "Failed to create service." };
  }
}

export async function updateService(id: string, formData: FormData) {
  try {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const short_description = formData.get("short_description") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const duration = formData.get("duration") as string;
    const featured = formData.get("featured") === "true";
    const active = formData.get("active") === "true";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

    const { error } = await supabase
      .from("services")
      .update({
        name,
        slug,
        category,
        short_description,
        description,
        price: price || null,
        duration: duration || null,
        featured,
        active,
        display_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/services", "page");
    revalidatePath(`/services/${slug}`, "page");
    revalidatePath("/admin/services", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update service." };
  }
}

export async function deleteService(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/services", "page");
    revalidatePath("/admin/services", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete service." };
  }
}

export async function toggleServiceActive(id: string, currentActive: boolean) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("services")
      .update({ active: !currentActive, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/services", "page");
    revalidatePath("/admin/services", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle service status." };
  }
}

export async function toggleServiceFeatured(id: string, currentFeatured: boolean) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("services")
      .update({ featured: !currentFeatured, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/", "page");
    revalidatePath("/services", "page");
    revalidatePath("/admin/services", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle service featured status." };
  }
}
