"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Jewellery } from "@/types/database";
import { updateJewellery } from "../../actions";

interface EditJewelleryFormProps {
  item: Jewellery;
}

export function EditJewelleryForm({ item }: EditJewelleryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateJewellery(item.id, formData);
      if (res.error) {
        toast.error("Update Failed", { description: res.error });
      } else {
        toast.success("Jewellery Item Updated!");
        router.push("/admin/jewellery");
        router.refresh();
      }
    } catch {
      toast.error("Failed to update item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
            Jewellery Set Name
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={item.name}
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
            defaultValue={item.slug}
            className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
            Category
          </label>
          <select
            name="category"
            required
            defaultValue={item.category}
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
            defaultValue={item.rental_price || 0}
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
            defaultValue={item.security_deposit || 0}
            className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
            Availability Status
          </label>
          <select
            name="availability_status"
            defaultValue={item.availability_status}
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
            defaultValue={item.display_order}
            className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
          Included Items in Set (One item per line)
        </label>
        <textarea
          name="included_items"
          rows={4}
          defaultValue={(item.included_items || []).join("\n")}
          className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
          Short Summary
        </label>
        <textarea
          name="short_description"
          required
          rows={2}
          defaultValue={item.short_description}
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
          rows={4}
          defaultValue={item.description || ""}
          className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <div className="flex items-center gap-6 pt-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-brand-900 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={item.featured}
            className="w-4 h-4 text-gold-500 rounded"
          />
          <span>Feature on Home Page</span>
        </label>

        <label className="flex items-center gap-2 text-sm font-semibold text-brand-900 cursor-pointer">
          <input
            type="checkbox"
            name="active"
            value="true"
            defaultChecked={item.active}
            className="w-4 h-4 text-emerald-600 rounded"
          />
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
          Save Changes
        </Button>
      </div>
    </form>
  );
}
