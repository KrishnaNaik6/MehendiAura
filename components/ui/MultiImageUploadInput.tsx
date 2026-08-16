"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2, X, Plus, Sparkles, Images } from "lucide-react";
import { toast } from "sonner";
import { uploadImageToSupabase } from "@/lib/supabase/storage";
import { convertToWebP } from "@/lib/utils/imageCompressor";

interface MultiImageUploadInputProps {
  values?: string[];
  onChange: (urls: string[]) => void;
  folder?: "services" | "jewellery" | "gallery" | "branding";
  label?: string;
}

export function MultiImageUploadInput({
  values = [],
  onChange,
  folder = "gallery",
  label = "Upload Multiple Photos",
}: MultiImageUploadInputProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(values);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const handleMultipleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = Array.from(e.target.files || []);
    if (rawFiles.length === 0) return;

    // Filter valid image files
    const validFiles = rawFiles.filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      toast.error("Invalid Files", { description: "Please select image files (JPG, PNG, WEBP, HEIC)." });
      return;
    }

    setIsUploading(true);
    setUploadProgress(`Optimizing ${validFiles.length} photo(s) to WebP...`);

    try {
      // 1. Convert all selected files to WebP in parallel
      const webpFiles = await Promise.all(validFiles.map((f) => convertToWebP(f, 0.85)));

      setUploadProgress(`Uploading ${webpFiles.length} WebP photo(s) to storage...`);

      // 2. Upload WebP files to Supabase Storage in parallel
      const uploadResults = await Promise.all(
        webpFiles.map((file) => uploadImageToSupabase(file, folder))
      );

      const successfulUrls: string[] = [];
      let failCount = 0;

      uploadResults.forEach((res) => {
        if (res.url) {
          successfulUrls.push(res.url);
        } else {
          failCount++;
        }
      });

      if (successfulUrls.length > 0) {
        const updatedUrls = [...imageUrls, ...successfulUrls];
        setImageUrls(updatedUrls);
        onChange(updatedUrls);

        toast.success(`Successfully uploaded ${successfulUrls.length} photo(s)!`, {
          description: "All photos auto-converted to WebP for maximum performance.",
        });
      }

      if (failCount > 0) {
        toast.error(`Failed to upload ${failCount} image(s).`);
      }
    } catch {
      toast.error("An error occurred during batch image upload.");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
      e.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = imageUrls.filter((_, idx) => idx !== indexToRemove);
    setImageUrls(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider flex items-center gap-2">
          <Images className="w-4 h-4 text-gold-600" />
          <span>{label}</span>
        </label>
        <span className="text-xs font-bold text-gold-700">
          {imageUrls.length} Photo(s) Attached
        </span>
      </div>

      {/* Grid of Uploaded Preview Cards */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-cream-50 border border-gold-300/30">
          {imageUrls.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative h-32 rounded-xl overflow-hidden border-2 border-gold-400 bg-brand-950 group shadow-xs"
            >
              <img
                src={url}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-brand-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
                  title="Remove Photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-brand-950/80 text-cream-100 text-[10px] font-semibold">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Multi-File Upload Drop Area */}
      <label className="border-2 border-dashed border-gold-400/60 hover:border-gold-500 bg-cream-50 hover:bg-gold-500/5 rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2 transition-all group">
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <Loader2 className="w-8 h-8 text-gold-600 animate-spin" />
            <span className="text-xs font-semibold text-brand-800">
              {uploadProgress || "Uploading photos..."}
            </span>
            <span className="text-[11px] text-brand-600">
              Converting to high-quality WebP format in parallel
            </span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-brand-800 text-gold-300 flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-sm font-bold text-brand-900 block flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4 text-gold-600" />
                Select Multiple Photos from Device (Hold Ctrl or Shift)
              </span>
              <span className="text-xs text-brand-600 block">
                Supports selecting multiple JPG, PNG, or WEBP photos at once. Auto-converts to WebP.
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleFilesChange}
              className="hidden"
              disabled={isUploading}
            />
          </>
        )}
      </label>

      {/* Hidden serialization input */}
      <input type="hidden" name="image_urls" value={JSON.stringify(imageUrls)} />
    </div>
  );
}
