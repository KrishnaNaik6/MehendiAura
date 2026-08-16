import { createClient } from "@/lib/supabase/client";

/**
 * Uploads a local file to Supabase Storage bucket 'mehendiaura-images'
 * Returns the public URL of the uploaded image.
 */
export async function uploadImageToSupabase(
  file: File,
  folder: "services" | "jewellery" | "gallery" | "branding" = "gallery"
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient();

    // Sanitize file extension and filename
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const cleanName = file.name
      .split(".")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");
    const filePath = `${folder}/${Date.now()}-${cleanName}.${fileExt}`;

    // Upload to Supabase Storage bucket 'mehendiaura-images'
    const { data, error } = await supabase.storage
      .from("mehendiaura-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      return { url: null, error: error.message };
    }

    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from("mehendiaura-images")
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || "Failed to upload image." };
  }
}
