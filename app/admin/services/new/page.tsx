"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Sparkle, Globe } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";
import { createService } from "../actions";

export default function NewServicePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    if (imageUrl) {
      formData.set("image_url", imageUrl);
    }

    try {
      const res = await createService(formData);
      if (res.error) {
        toast.error("Creation Failed", { description: res.error });
      } else {
        toast.success("Service Created Successfully!");
        router.push("/admin/services");
      }
    } catch {
      toast.error("Failed to create service");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-gold-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Services List</span>
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-gold-300/30 shadow-soft space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
          <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
            <Sparkle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-900">
              Create New Mehendi Service
            </h1>
            <p className="text-xs text-brand-600">
              Add a new service offering with English and Kannada descriptions.
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
                defaultValue="Bridal"
                className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="Bridal">Bridal Mehendi</option>
                <option value="Engagement">Engagement Mehendi</option>
                <option value="Arabic">Arabic Mehendi</option>
                <option value="Traditional">Traditional Mehendi</option>
                <option value="Minimal">Minimal Mehendi</option>
                <option value="Party">Guest &amp; Party Henna</option>
                <option value="Custom">Custom Henna Designs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
                Price (Or "Contact for Price")
              </label>
              <input
                type="text"
                name="price"
                placeholder="Contact for Price (or Starting from ₹5,000)"
                className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
                Estimated Duration
              </label>
              <input
                type="text"
                name="duration"
                placeholder="4 - 6 Hours"
                className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
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
                folder="services"
                value={imageUrl}
                onChange={setImageUrl}
                label="Service Photo (Select File or Paste URL)"
              />
            </div>
          </div>

          {/* Multilingual Name & Descriptions */}
          <div className="space-y-6 pt-4 border-t border-cream-200">
            {/* English Section */}
            <div className="space-y-4 p-5 rounded-2xl bg-cream-50 border border-gold-300/30">
              <span className="text-xs font-bold text-gold-700 uppercase tracking-wider block">
                🇬🇧 English Content
              </span>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  Service Name (English) *
                </label>
                <input
                  type="text"
                  name="name_en"
                  required
                  placeholder="Royal Bridal Mehendi"
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  Short Description (English) *
                </label>
                <textarea
                  name="short_description_en"
                  required
                  rows={2}
                  placeholder="Intricate full-arm and leg bridal henna art featuring custom dulha-dulhan portrait motifs."
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  Full Detailed Description (English)
                </label>
                <textarea
                  name="description_en"
                  rows={4}
                  placeholder="Our signature Royal Bridal Mehendi package offers bespoke, highly detailed bridal henna patterns..."
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            {/* Kannada Section */}
            <div className="space-y-4 p-5 rounded-2xl bg-cream-50 border border-gold-300/30">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                🇮🇳 Kannada Content (ಕನ್ನಡ)
              </span>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  ಸೇವೆಯ ಹೆಸರು (Kannada)
                </label>
                <input
                  type="text"
                  name="name_kn"
                  placeholder="ರಾಯಲ್ ಬ್ರೈಡಲ್ ಮೆಹೆಂದಿ"
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ (Kannada Short Description)
                </label>
                <textarea
                  name="short_description_kn"
                  rows={2}
                  placeholder="ವರ-ವಧುವಿನ ಭಾವಚಿತ್ರಗಳನ್ನು ಒಳಗೊಂಡಿರುವ ಪೂರ್ಣ ಕೈ ಮತ್ತು ಕಾಲುಗಳ ಶ್ರೇಷ್ಠ ಬ್ರೈಡಲ್ ಮೆಹೆಂದಿ."
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  ಸಂಪೂರ್ಣ ವಿವರಣೆ (Kannada Full Description)
                </label>
                <textarea
                  name="description_kn"
                  rows={4}
                  placeholder="ನಮ್ಮ ರಾಯಲ್ ಬ್ರೈಡಲ್ ಮೆಹೆಂದಿ ಸೇವೆಯು ನೈಸರ್ಗಿಕ ಮೆಹೆಂದಿ ಬಣ್ಣದೊಂದಿಗೆ..."
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-brand-900 cursor-pointer">
              <input type="checkbox" name="featured" value="true" className="w-4 h-4 text-gold-500 rounded" />
              <span>Feature on Home Page</span>
            </label>

            <label className="flex items-center gap-2 text-sm font-semibold text-brand-900 cursor-pointer">
              <input type="checkbox" name="active" value="true" defaultChecked className="w-4 h-4 text-emerald-600 rounded" />
              <span>Active Status</span>
            </label>
          </div>

          <div className="pt-4 border-t border-cream-200 flex items-center justify-end gap-3">
            <Link href="/admin/services">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="gold" type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
              Create Service
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
