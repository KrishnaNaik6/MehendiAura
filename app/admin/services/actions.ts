"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createService(formData: FormData) {
  try {
    const supabase = await createClient();

    const name_en = formData.get("name_en") as string || formData.get("name") as string;
    const name_kn = formData.get("name_kn") as string;
    const category = (formData.get("category") as string) || "Bridal";
    const price = formData.get("price") as string;
    const duration = formData.get("duration") as string;
    const short_description_en = formData.get("short_description_en") as string || formData.get("short_description") as string;
    const short_description_kn = formData.get("short_description_kn") as string;
    const description_en = formData.get("description_en") as string || formData.get("description") as string;
    const description_kn = formData.get("description_kn") as string;
    const featured = formData.get("featured") === "true";
    const active = formData.get("active") !== "false";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

    if (!name_en || !short_description_en) {
      return { error: "Please provide English Service Name and Short Description." };
    }

    const slug = name_en
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const { data: service, error } = await supabase
      .from("services")
      .insert({
        name: name_en,
        name_en,
        name_kn: name_kn || null,
        slug,
        category,
        price: price || null,
        duration: duration || null,
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

    if (imageUrls.length > 0 && service) {
      const imageInserts = imageUrls.map((url, idx) => {
        let storage_path = `services/${Date.now()}-${idx}.webp`;
        if (url.includes("mehendiaura-images/")) {
          const parts = url.split("mehendiaura-images/");
          if (parts.length > 1) {
            storage_path = parts[1];
          }
        }

        return {
          service_id: service.id,
          image_url: url,
          storage_path,
          alt_text: name_en,
          display_order: idx + 1,
        };
      });

      await supabase.from("service_images").insert(imageInserts);
    }

    revalidatePath("/services", "layout");
    revalidatePath("/admin/services", "page");
    return { success: true, serviceId: service.id };
  } catch (error: any) {
    return { error: error.message || "Failed to create service." };
  }
}

export async function updateService(id: string, formData: FormData) {
  try {
    const supabase = await createClient();

    const name_en = formData.get("name_en") as string || formData.get("name") as string;
    const name_kn = formData.get("name_kn") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const duration = formData.get("duration") as string;
    const short_description_en = formData.get("short_description_en") as string || formData.get("short_description") as string;
    const short_description_kn = formData.get("short_description_kn") as string;
    const description_en = formData.get("description_en") as string || formData.get("description") as string;
    const description_kn = formData.get("description_kn") as string;
    const featured = formData.get("featured") === "true";
    const active = formData.get("active") === "true";
    const display_order = parseInt((formData.get("display_order") as string) || "0", 10);

    const { error } = await supabase
      .from("services")
      .update({
        name: name_en,
        name_en,
        name_kn: name_kn || null,
        category,
        price: price || null,
        duration: duration || null,
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
        .from("service_images")
        .select("image_url")
        .eq("service_id", id);

      const existingUrls = new Set(existingImgs?.map((i) => i.image_url) || []);
      const newUrlsToInsert = imageUrls.filter((url) => !existingUrls.has(url));

      if (newUrlsToInsert.length > 0) {
        const startOrder = (existingImgs?.length || 0) + 1;
        const imageInserts = newUrlsToInsert.map((url, idx) => ({
          service_id: id,
          image_url: url,
          storage_path: url.includes("mehendiaura-images/") ? url.split("mehendiaura-images/")[1] : `services/${Date.now()}-${idx}.webp`,
          alt_text: name_en,
          display_order: startOrder + idx,
        }));
        await supabase.from("service_images").insert(imageInserts);
      }
    }

    revalidatePath("/services", "layout");
    revalidatePath(`/admin/services/${id}/edit`, "page");
    revalidatePath("/admin/services", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update service." };
  }
}

export async function deleteService(id: string) {
  try {
    const supabase = await createClient();

    const { data: images } = await supabase
      .from("service_images")
      .select("image_url, storage_path")
      .eq("service_id", id);

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

    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/services", "layout");
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
      .update({ active: !currentActive })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/services", "layout");
    revalidatePath("/admin/services", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle active status." };
  }
}

export async function toggleServiceFeatured(id: string, currentFeatured: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("services")
      .update({ featured: !currentFeatured })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/services", "layout");
    revalidatePath("/admin/services", "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle featured status." };
  }
}

// -------------------------------------------------------------
// SERVICE IMAGES MANAGEMENT ACTIONS
// -------------------------------------------------------------

export async function addServiceImages(
  serviceId: string,
  imageItems: { url: string; storage_path?: string; alt_text?: string }[]
) {
  try {
    const supabase = await createClient();

    const { data: existingImages } = await supabase
      .from("service_images")
      .select("display_order, image_url")
      .eq("service_id", serviceId);

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
        storage_path = `services/${Date.now()}-${idx}.webp`;
      }

      return {
        service_id: serviceId,
        image_url: item.url,
        storage_path,
        alt_text: item.alt_text || "Service Photo",
        display_order: maxOrder + idx + 1,
      };
    });

    const { error } = await supabase.from("service_images").insert(inserts);
    if (error) throw error;

    revalidatePath("/services", "layout");
    revalidatePath(`/admin/services/${serviceId}/edit`, "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to add service images." };
  }
}

export async function deleteServiceImage(imageId: string, serviceId: string) {
  try {
    const supabase = await createClient();

    // 1. Fetch image info before deleting row
    const { data: img } = await supabase
      .from("service_images")
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
          supabase.from("service_images").select("*", { count: "exact", head: true }).eq("storage_path", storagePath).neq("id", imageId),
          supabase.from("jewellery_images").select("*", { count: "exact", head: true }).eq("storage_path", storagePath),
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
    const { error } = await supabase.from("service_images").delete().eq("id", imageId);
    if (error) throw error;

    // 3. Re-index display_order for remaining images
    const { data: remaining } = await supabase
      .from("service_images")
      .select("id")
      .eq("service_id", serviceId)
      .order("display_order", { ascending: true });

    if (remaining && remaining.length > 0) {
      for (let idx = 0; idx < remaining.length; idx++) {
        await supabase
          .from("service_images")
          .update({ display_order: idx + 1 })
          .eq("id", remaining[idx].id);
      }
    }

    revalidatePath("/services", "layout");
    revalidatePath(`/admin/services/${serviceId}/edit`, "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete service image." };
  }
}

export async function reorderServiceImages(serviceId: string, imageIdsInOrder: string[]) {
  try {
    const supabase = await createClient();

    for (let idx = 0; idx < imageIdsInOrder.length; idx++) {
      const id = imageIdsInOrder[idx];
      await supabase
        .from("service_images")
        .update({ display_order: idx + 1 })
        .eq("id", id);
    }

    revalidatePath("/services", "layout");
    revalidatePath(`/admin/services/${serviceId}/edit`, "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to reorder service images." };
  }
}

export async function updateServiceImageAltText(imageId: string, altText: string, serviceId: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("service_images")
      .update({ alt_text: altText })
      .eq("id", imageId);

    if (error) throw error;

    revalidatePath("/services", "layout");
    revalidatePath(`/admin/services/${serviceId}/edit`, "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update image alt text." };
  }
}

export async function fetchMediaLibraryImages() {
  try {
    const supabase = await createClient();

    const [{ data: gallery }, { data: serviceImgs }, { data: jewelleryImgs }] = await Promise.all([
      supabase.from("gallery").select("image_url, storage_path, title, category").order("created_at", { ascending: false }),
      supabase.from("service_images").select("image_url, storage_path, alt_text, services(name, category)").order("created_at", { ascending: false }),
      supabase.from("jewellery_images").select("image_url, storage_path, alt_text, jewellery(name, category)").order("created_at", { ascending: false }),
    ]);

    const seenUrls = new Set<string>();
    const library: { url: string; storage_path?: string; title?: string; category?: string; source?: "gallery" | "service" | "jewellery" | "storage" }[] = [];

    (gallery || []).forEach((g) => {
      if (g.image_url && !seenUrls.has(g.image_url)) {
        seenUrls.add(g.image_url);
        library.push({
          url: g.image_url,
          storage_path: g.storage_path,
          title: g.title || "Gallery Showcase",
          category: g.category || "Gallery",
          source: "gallery",
        });
      }
    });

    (serviceImgs || []).forEach((s: any) => {
      if (s.image_url && !seenUrls.has(s.image_url)) {
        seenUrls.add(s.image_url);
        library.push({
          url: s.image_url,
          storage_path: s.storage_path,
          title: s.alt_text || s.services?.name || "Service Photo",
          category: s.services?.category || "Service Offering",
          source: "service",
        });
      }
    });

    (jewelleryImgs || []).forEach((j: any) => {
      if (j.image_url && !seenUrls.has(j.image_url)) {
        seenUrls.add(j.image_url);
        library.push({
          url: j.image_url,
          storage_path: j.storage_path,
          title: j.alt_text || j.jewellery?.name || "Jewellery Set",
          category: j.jewellery?.category || "Rental Jewellery",
          source: "jewellery",
        });
      }
    });

    // Also fetch storage bucket items
    try {
      const folders = ["services", "jewellery", "gallery", "branding", ""];
      for (const folder of folders) {
        const { data: files } = await supabase.storage
          .from("mehendiaura-images")
          .list(folder, { limit: 100 });

        if (files) {
          files.forEach((file) => {
            if (file.name && file.name !== ".emptyFolderPlaceholder") {
              const fullPath = folder ? `${folder}/${file.name}` : file.name;
              const { data: publicUrlData } = supabase.storage
                .from("mehendiaura-images")
                .getPublicUrl(fullPath);

              const url = publicUrlData.publicUrl;
              if (url && !seenUrls.has(url)) {
                seenUrls.add(url);
                library.push({
                  url,
                  storage_path: fullPath,
                  title: file.name,
                  category: folder || "General Storage",
                  source: "storage",
                });
              }
            }
          });
        }
      }
    } catch {
      // Storage listing fallback handled cleanly
    }

    return { success: true, data: library };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch media library.", data: [] };
  }
}
