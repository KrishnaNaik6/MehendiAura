"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Service } from "@/types/database";
import { updateService } from "../../actions";

interface EditServiceFormProps {
  service: Service;
}

const PRESET_CATEGORIES = [
  "Bridal",
  "Engagement",
  "Makeup Service",
  "Saree Draping",
  "Hair Styling",
  "Pre-Wedding Grooming",
  "Arabic",
  "Traditional",
  "Minimal",
  "Party",
];

export function EditServiceForm({ service }: EditServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isInitiallyPreset = PRESET_CATEGORIES.includes(service.category);
  const [selectedCategory, setSelectedCategory] = useState(
    isInitiallyPreset ? service.category : "Custom"
  );
  const [customCategory, setCustomCategory] = useState(
    isInitiallyPreset ? "" : service.category
  );

  const isCustomSelected = selectedCategory === "Custom";
  const finalCategory = isCustomSelected ? customCategory : selectedCategory;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("category", finalCategory || "General Service");

    try {
      const res = await updateService(service.id, formData);
      if (res.error) {
        toast.error("Update Failed", { description: res.error });
      } else {
        toast.success("Service Updated Successfully!");
        router.push("/admin/services");
        router.refresh();
      }
    } catch {
      toast.error("Failed to update service");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
            Service Name
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={service.name}
            className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
            URL Slug
          </label>
          <input
            type="text"
            name="slug"
            required
            defaultValue={service.slug}
            className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
            Category / Service Type *
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="Bridal">Bridal Mehendi</option>
            <option value="Engagement">Engagement Mehendi</option>
            <option value="Makeup Service">Makeup Service (Bridal &amp; Party)</option>
            <option value="Saree Draping">Saree &amp; Lehenga Draping</option>
            <option value="Hair Styling">Hair Styling &amp; Makeover</option>
            <option value="Pre-Wedding Grooming">Pre-Wedding Grooming</option>
            <option value="Arabic">Arabic Henna</option>
            <option value="Traditional">Traditional Mehendi</option>
            <option value="Minimal">Minimal Mehendi</option>
            <option value="Party">Guest &amp; Party Henna</option>
            <option value="Custom">✨ Add Custom Category Name...</option>
          </select>

          {isCustomSelected && (
            <div className="mt-3">
              <label className="block text-xs font-semibold text-gold-700 uppercase tracking-wider mb-1">
                Enter Custom Category Name
              </label>
              <input
                type="text"
                required
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Nail Art, Airbrush Makeup"
                className="w-full px-4 py-2.5 bg-white border border-gold-400 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
            Price (Or "Contact for Price")
          </label>
          <input
            type="text"
            name="price"
            defaultValue={service.price || ""}
            placeholder="Contact for Price"
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
            defaultValue={service.duration || ""}
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
            defaultValue={service.display_order}
            className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
          Short Description (Card Summary)
        </label>
        <textarea
          name="short_description"
          required
          rows={2}
          defaultValue={service.short_description}
          className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
          Full Detailed Description
        </label>
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={service.description}
          className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <div className="flex items-center gap-6 pt-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-brand-900 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={service.featured}
            className="w-4 h-4 text-gold-500 rounded"
          />
          <span>Feature on Home Page</span>
        </label>

        <label className="flex items-center gap-2 text-sm font-semibold text-brand-900 cursor-pointer">
          <input
            type="checkbox"
            name="active"
            value="true"
            defaultChecked={service.active}
            className="w-4 h-4 text-emerald-600 rounded"
          />
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
          Save Changes
        </Button>
      </div>
    </form>
  );
}
