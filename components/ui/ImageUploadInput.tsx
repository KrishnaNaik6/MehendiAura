"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2, X, Link as LinkIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { uploadImageToSupabase } from "@/lib/supabase/storage";
import { convertToWebP } from "@/lib/utils/imageCompressor";

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
  const [uploadStats, setUploadStats] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    if (!rawFile.type.startsWith("image/")) {
      toast.error("Invalid File", { description: "Please select an image file (JPG, PNG, WEBP, HEIC)." });
      return;
    }

    if (rawFile.size > 15 * 1024 * 1024) {
      toast.error("File Too Large", { description: "Maximum image size allowed is 15MB." });
      return;
    }

    setIsUploading(true);
    setUploadStats(null);

    try {
      // 1. Client-Side WebP Conversion & Compression
      const webpFile = await convertToWebP(rawFile, 0.85);

      const originalMb = (rawFile.size / (1024 * 1024)).toFixed(2);
      const webpKb = (webpFile.size / 1024).toFixed(0);
      const savingsPercent = Math.max(0, Math.round((1 - webpFile.size / rawFile.size) * 100));

      // 2. Upload Compressed WebP to Supabase Storage
      const { url, error } = await uploadImageToSupabase(webpFile, folder);

      if (error) {
        toast.error("Upload Failed", { description: error });
      } else if (url) {
        setImageUrl(url);
        onChange(url);

        const statsMsg = `Converted to WebP: ${originalMb}MB → ${webpKb}KB (${savingsPercent}% saved)`;
        setUploadStats(statsMsg);

        toast.success("Image Optimized & Uploaded!", {
          description: `Auto-converted to WebP (${webpKb}KB, ${savingsPercent}% storage saved).`,
        });
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
    setUploadStats(null);
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
        <div className="relative w-full h-52 rounded-2xl overflow-hidden border-2 border-gold-400 bg-brand-950 group">
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

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Image Attached</span>
            </span>

            {uploadStats && (
              <span className="px-3 py-1 rounded-full bg-brand-950/80 text-gold-300 text-[11px] font-medium flex items-center gap-1.5 backdrop-blur-md border border-gold-400/30 shadow-md truncate">
                <Sparkles className="w-3 h-3 text-gold-400 shrink-0" />
                <span className="truncate">{uploadStats}</span>
              </span>
            )}
          </div>
        </div>
      ) : uploadMode === "file" ? (
        <label className="border-2 border-dashed border-gold-400/60 hover:border-gold-500 bg-cream-50 hover:bg-gold-500/5 rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2 transition-all group">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 className="w-8 h-8 text-gold-600 animate-spin" />
              <span className="text-xs font-semibold text-brand-800">
                Converting to high-quality WebP &amp; uploading...
              </span>
              <span className="text-[11px] text-brand-600">
                Optimizing image for 3x faster page speed
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
                  Auto-converts to optimized <strong className="text-gold-700">WebP format</strong> (Max 15MB)
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
