"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";
import { createGalleryItem } from "../actions";

export default function NewGalleryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageUrl) {
      toast.error("Image Required", { description: "Please upload a photo from your device or paste an image URL." });
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("image_url", imageUrl);

    try {
      const res = await createGalleryItem(formData);
      if (res.error) {
        toast.error("Upload Failed", { description: res.error });
      } else {
        toast.success("Photo Added to Gallery!");
        router.push("/admin/gallery");
      }
    } catch {
      toast.error("Failed to add photo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <Link
        href="/admin/gallery"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-gold-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Gallery List</span>
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-gold-300/30 shadow-soft space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
          <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-900">
              Add Photo to Showcase Gallery
            </h1>
            <p className="text-xs text-brand-600">
              Upload a photo with English and Kannada titles.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                name="category"
                required
                defaultValue="Bridal Mehendi"
                className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="Bridal Mehendi">Bridal Mehendi</option>
                <option value="Arabic Mehendi">Arabic Mehendi</option>
                <option value="Wedding Work">Wedding Work</option>
                <option value="Jewellery">Rental Jewellery</option>
                <option value="Customer Photos">Customer / Event Photos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
                Display Order Priority
              </label>
              <input
                type="number"
                name="display_order"
                defaultValue={1}
                className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div className="md:col-span-2">
              <ImageUploadInput
                folder="gallery"
                value={imageUrl}
                onChange={setImageUrl}
                label="Select Photo From Device"
              />
            </div>
          </div>

          {/* Multilingual Titles */}
          <div className="space-y-6 pt-4 border-t border-cream-200">
            <div className="space-y-4 p-5 rounded-2xl bg-cream-50 border border-gold-300/30">
              <span className="text-xs font-bold text-gold-700 uppercase tracking-wider block">
                🇬🇧 English Content
              </span>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  Photo Title (English) *
                </label>
                <input
                  type="text"
                  name="title_en"
                  required
                  placeholder="Full Arm Royal Bridal Pattern"
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  Description / Caption (English)
                </label>
                <textarea
                  name="description_en"
                  rows={2}
                  placeholder="Full arm bridal mehendi applied for bride Ananya..."
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div className="space-y-4 p-5 rounded-2xl bg-cream-50 border border-gold-300/30">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                🇮🇳 Kannada Content (ಕನ್ನಡ)
              </span>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  ಫೋಟೋ ಶೀರ್ಷಿಕೆ (Kannada Title)
                </label>
                <input
                  type="text"
                  name="title_kn"
                  placeholder="ರಾಯಲ್ ಬ್ರೈಡಲ್ ಮೆಹೆಂದಿ ವಿನ್ಯಾಸ"
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  ವಿವರಣೆ (Kannada Caption)
                </label>
                <textarea
                  name="description_kn"
                  rows={2}
                  placeholder="ವಧುವಿಗೆ ಹಾಕಲಾದ ಶ್ರೇಷ್ಠ ವಧುವಿನ ಮೆಹೆಂದಿ ಕಲಾಕೃತಿ..."
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-brand-900 cursor-pointer">
              <input type="checkbox" name="active" value="true" defaultChecked className="w-4 h-4 text-emerald-600 rounded" />
              <span>Active Status (Visible in Public Gallery)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-cream-200 flex items-center justify-end gap-3">
            <Link href="/admin/gallery">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="gold" type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
              Add Photo to Gallery
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
