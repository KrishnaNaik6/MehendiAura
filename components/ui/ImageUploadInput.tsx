"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2, X, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadImageToSupabase } from "@/lib/supabase/storage";

interface ImageUploadInputProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: "services" | "jewellery" | "gallery" | "branding";
  label?: string;
}

export function ImageUploadInput({
  value = "",
  onChange,
  folder = "gallery",
  label = "Image Upload",
}: ImageUploadInputProps) {
  const [imageUrl, setImageUrl] = useState<string>(value);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File", { description: "Please select an image file (JPG, PNG, WEBP)." });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File Too Large", { description: "Maximum image size allowed is 10MB." });
      return;
    }

    setIsUploading(true);
    try {
      const { url, error } = await uploadImageToSupabase(file, folder);
      if (error) {
        toast.error("Upload Failed", { description: error });
      } else if (url) {
        setImageUrl(url);
        onChange(url);
        toast.success("Image Uploaded Successfully!");
      }
    } catch {
      toast.error("An error occurred during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (val: string) => {
    setImageUrl(val);
    onChange(val);
  };

  const handleClear = () => {
    setImageUrl("");
    onChange("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider">
          {label}
        </label>

        {/* Toggle File / URL */}
        <div className="flex items-center gap-1 text-[11px] bg-cream-200 p-0.5 rounded-lg border border-gold-300/40">
          <button
            type="button"
            onClick={() => setUploadMode("file")}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              uploadMode === "file"
                ? "bg-brand-900 text-gold-300 shadow-xs"
                : "text-brand-700 hover:text-brand-900"
            }`}
          >
            Upload Device File
          </button>
          <button
            type="button"
            onClick={() => setUploadMode("url")}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              uploadMode === "url"
                ? "bg-brand-900 text-gold-300 shadow-xs"
                : "text-brand-700 hover:text-brand-900"
            }`}
          >
            Paste Image URL
          </button>
        </div>
      </div>

      {imageUrl ? (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-gold-400 bg-brand-950 group">
          <img
            src={imageUrl}
            alt="Uploaded Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="p-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
              title="Remove Image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Image Attached</span>
          </span>
        </div>
      ) : uploadMode === "file" ? (
        <label className="border-2 border-dashed border-gold-400/60 hover:border-gold-500 bg-cream-50 hover:bg-gold-500/5 rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2 transition-all group">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 className="w-8 h-8 text-gold-600 animate-spin" />
              <span className="text-xs font-semibold text-brand-800">
                Uploading photo to Supabase storage...
              </span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-brand-800 text-gold-300 flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-bold text-brand-900 block">
                  Click to select photo from device
                </span>
                <span className="text-xs text-brand-600 block">
                  Supports JPG, PNG, WEBP (Max 10MB)
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
            </>
          )}
        </label>
      ) : (
        <div className="relative">
          <LinkIcon className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      )}
    </div>
  );
}
