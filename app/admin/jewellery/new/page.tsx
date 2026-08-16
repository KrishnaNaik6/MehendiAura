"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Gem } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";
import { createJewellery } from "../actions";

export default function NewJewelleryPage() {
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
      const res = await createJewellery(formData);
      if (res.error) {
        toast.error("Creation Failed", { description: res.error });
      } else {
        toast.success("Jewellery Item Added!");
        router.push("/admin/jewellery");
      }
    } catch {
      toast.error("Failed to add jewellery item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <Link
        href="/admin/jewellery"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-gold-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Jewellery Inventory</span>
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-gold-300/30 shadow-soft space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
          <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
            <Gem className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-900">
              Add New Rental Jewellery Set
            </h1>
            <p className="text-xs text-brand-600">
              Create a new rental jewellery listing with English and Kannada details.
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
                defaultValue="Bridal Sets"
                className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="Bridal Sets">Bridal Sets</option>
                <option value="Necklace Sets">Necklace Sets</option>
                <option value="Temple Jewellery">Temple Jewellery</option>
                <option value="Choker Sets">Choker Sets</option>
                <option value="Earrings">Earrings / Jhumkas</option>
                <option value="Bangles">Bangles &amp; Kadas</option>
                <option value="Maang Tikka">Maang Tikka &amp; Matha Patti</option>
                <option value="Vaddanam">Vaddanam / Waist Belt</option>
                <option value="Hair Accessories">Hair Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
                Rental Price Per Day (₹)
              </label>
              <input
                type="number"
                name="rental_price"
                step="50"
                placeholder="2500"
                className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
                Security Deposit (Refundable ₹)
              </label>
              <input
                type="number"
                name="security_deposit"
                step="50"
                placeholder="3000"
                className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
                Availability Status
              </label>
              <select
                name="availability_status"
                defaultValue="available"
                className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-semibold text-emerald-700"
              >
                <option value="available">Available for Rental</option>
                <option value="booked">Currently Booked / On Rent</option>
                <option value="maintenance">Under Maintenance / Polishing</option>
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
                folder="jewellery"
                value={imageUrl}
                onChange={setImageUrl}
                label="Jewellery Photo (Select File or Paste URL)"
              />
            </div>
          </div>

          {/* Multilingual Details */}
          <div className="space-y-6 pt-4 border-t border-cream-200">
            {/* English Section */}
            <div className="space-y-4 p-5 rounded-2xl bg-cream-50 border border-gold-300/30">
              <span className="text-xs font-bold text-gold-700 uppercase tracking-wider block">
                🇬🇧 English Content
              </span>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  Jewellery Set Name (English) *
                </label>
                <input
                  type="text"
                  name="name_en"
                  required
                  placeholder="Kundu & Polki Royal Bridal Set"
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  Included Items in Set (English — One per line)
                </label>
                <textarea
                  name="included_items_en"
                  rows={3}
                  placeholder={`Royal Choker Necklace\nLong Layered Haram\nMatha Patti\nMatching Jhumka Earrings`}
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  Short Summary (English) *
                </label>
                <textarea
                  name="short_description_en"
                  required
                  rows={2}
                  placeholder="Regal Kundan necklace set with matching long haram, matha patti, jhumkas, and waist belt."
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  Full Detailed Description (English)
                </label>
                <textarea
                  name="description_en"
                  rows={3}
                  placeholder="Handcrafted premium Kundan bridal rental set plated in 22K gold finish..."
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
                  ಆಭರಣ ಸೆಟ್‌ನ ಹೆಸರು (Kannada Name)
                </label>
                <input
                  type="text"
                  name="name_kn"
                  placeholder="ಕುಂದನ್ ರಾಯಲ್ ಬ್ರೈಡಲ್ ಸೆಟ್"
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  ಒಳಗೊಂಡಿರುವ ವಸ್ತುಗಳು (Kannada Included Items — One per line)
                </label>
                <textarea
                  name="included_items_kn"
                  rows={3}
                  placeholder={`ರಾಯಲ್ ಚೋಕರ್ ಹಾರ\nಉದ್ದನೆಯ ಹಾರ\nಮತ್ತಾಪಟ್ಟಿ\nಜುಮುಕಿ ಕಿವಿ ಓಲೆಗಳು`}
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ (Kannada Short Summary)
                </label>
                <textarea
                  name="short_description_kn"
                  rows={2}
                  placeholder="ಕುಂದನ್ ಹಾರ, ಉದ್ದನೆಯ ಹಾರ, ಮತ್ತಾಪಟ್ಟಿ ಮತ್ತು ಜುಮುಕಿ ಒಳಗೊಂಡಿರುವ ಪ್ರೀಮಿಯಂ ಬ್ರೈಡಲ್ ಸೆಟ್."
                  className="w-full px-4 py-2.5 bg-white border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 mb-1">
                  ಸಂಪೂರ್ಣ ವಿವರಣೆ (Kannada Full Description)
                </label>
                <textarea
                  name="description_kn"
                  rows={3}
                  placeholder="22K ಗೋಲ್ಡ್ ಫಿನಿಶ್‌ನೊಂದಿಗೆ ಕೈಯಿಂದ ತಯಾರಿಸಿದ ರಾಯಲ್ ಕುಂದನ್ ಬ್ರೈಡಲ್ ಆಭರಣ ಸೆಟ್..."
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
            <Link href="/admin/jewellery">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="gold" type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
              Save Jewellery Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
