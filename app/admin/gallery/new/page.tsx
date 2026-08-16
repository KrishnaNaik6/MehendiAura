"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Images } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { MultiImageUploadInput } from "@/components/ui/MultiImageUploadInput";
import { createBatchGalleryItems } from "../actions";

export default function NewGalleryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      toast.error("Photos Required", {
        description: "Please select one or multiple photo files from your device.",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("image_urls", JSON.stringify(imageUrls));

    try {
      const res = await createBatchGalleryItems(formData);
      if (res.error) {
        toast.error("Upload Failed", { description: res.error });
      } else {
        toast.success(`Successfully added ${res.count || imageUrls.length} photo(s) to Gallery!`);
        router.push("/admin/gallery");
      }
    } catch {
      toast.error("Failed to add gallery photos.");
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
            <Images className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-900">
              Add Multiple Photos to Showcase Gallery
            </h1>
            <p className="text-xs text-brand-600">
              Select single or multiple photos to upload into a gallery category at once.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
                Gallery Category
              </label>
              <select
                name="category"
                required
                defaultValue="Bridal Mehendi"
                className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-semibold"
              >
                <option value="Bridal Mehendi">Bridal Mehendi</option>
                <option value="Arabic Mehendi">Arabic Mehendi</option>
                <option value="Wedding Work">Wedding Work</option>
                <option value="Makeup Service">Makeup Service</option>
                <option value="Saree Draping">Saree Draping</option>
                <option value="Hair Styling">Hair Styling</option>
                <option value="Jewellery">Rental Jewellery</option>
                <option value="Customer Photos">Customer / Event Photos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
                Base Title (English)
              </label>
              <input
                type="text"
                name="title_en"
                placeholder="Royal Bridal Pattern"
                defaultValue="Showcase Artwork"
                className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            {/* Multiple Image Selector */}
            <div className="md:col-span-2">
              <MultiImageUploadInput
                folder="gallery"
                values={imageUrls}
                onChange={setImageUrls}
                label="Select Photo(s) From Device (Single or Multiple)"
              />
            </div>
          </div>

          {/* Optional Multilingual Description */}
          <div className="space-y-6 pt-4 border-t border-cream-200">
            <div className="space-y-4 p-5 rounded-2xl bg-cream-50 border border-gold-300/30">
              <span className="text-xs font-bold text-gold-700 uppercase tracking-wider block">
                🇬🇧 Optional English Details
              </span>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  Description / Caption (English)
                </label>
                <textarea
                  name="description_en"
                  rows={2}
                  placeholder="Bridal artwork applied for wedding event..."
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div className="space-y-4 p-5 rounded-2xl bg-cream-50 border border-gold-300/30">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                🇮🇳 Optional Kannada Details (ಕನ್ನಡ)
              </span>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  ಫೋಟೋ ಶೀರ್ಷಿಕೆ (Kannada Base Title)
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
            <Button
              variant="gold"
              type="submit"
              isLoading={isLoading}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Upload {imageUrls.length > 0 ? `${imageUrls.length} Photo(s)` : "Photos"} to Gallery
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
