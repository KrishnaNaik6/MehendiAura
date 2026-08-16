"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Star, Edit, Trash2, CheckCircle2, XCircle, ExternalLink, Gem } from "lucide-react";
import { toast } from "sonner";
import { Jewellery } from "@/types/database";
import { toggleJewelleryActive, toggleJewelleryFeatured, deleteJewellery } from "./actions";

interface JewelleryTableProps {
  initialJewellery: Jewellery[];
}

export function JewelleryTable({ initialJewellery }: JewelleryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [jewelleryList, setJewelleryList] = useState(initialJewellery);
  const router = useRouter();

  const filtered = jewelleryList.filter(
    (j) =>
      j.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActive = async (item: Jewellery) => {
    try {
      const res = await toggleJewelleryActive(item.id, item.active);
      if (res.error) {
        toast.error("Status Update Failed", { description: res.error });
      } else {
        toast.success(`Item ${!item.active ? "Activated" : "Deactivated"}`);
        setJewelleryList((prev) =>
          prev.map((j) => (j.id === item.id ? { ...j, active: !j.active } : j))
        );
        router.refresh();
      }
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const handleToggleFeatured = async (item: Jewellery) => {
    try {
      const res = await toggleJewelleryFeatured(item.id, item.featured);
      if (res.error) {
        toast.error("Featured Update Failed", { description: res.error });
      } else {
        toast.success(`Item ${!item.featured ? "Featured" : "Unfeatured"}`);
        setJewelleryList((prev) =>
          prev.map((j) => (j.id === item.id ? { ...j, featured: !j.featured } : j))
        );
        router.refresh();
      }
    } catch {
      toast.error("Failed to toggle featured status");
    }
  };

  const handleDelete = async (item: Jewellery) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    try {
      const res = await deleteJewellery(item.id);
      if (res.error) {
        toast.error("Delete Failed", { description: res.error });
      } else {
        toast.success("Jewellery Item Deleted");
        setJewelleryList((prev) => prev.filter((j) => j.id !== item.id));
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gold-300/30 shadow-soft overflow-hidden space-y-4 p-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-cream-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jewellery or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div className="text-xs text-brand-700 font-semibold">
          Total Items: <span className="text-gold-700 font-bold">{filtered.length}</span>
        </div>
      </div>

      {/* Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-cream-300 text-xs font-semibold text-gold-700 uppercase tracking-wider bg-cream-50/50">
              <th className="py-3 px-4">Jewellery Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Rental Rate</th>
              <th className="py-3 px-4">Deposit</th>
              <th className="py-3 px-4 text-center">Availability</th>
              <th className="py-3 px-4 text-center">Featured</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-brand-600 text-sm">
                  No rental jewellery items found. Click "Add Rental Item" to create one!
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-cream-50/80 transition-colors">
                  <td className="py-4 px-4 font-semibold text-brand-900">
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-[11px] text-brand-600 font-mono font-normal">
                        /{item.slug}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-earth-100 text-earth-900 border border-gold-300/40">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-700">
                    {item.rental_price ? `₹${item.rental_price} / day` : "Contact for Rate"}
                  </td>
                  <td className="py-4 px-4 text-xs text-brand-700 font-medium">
                    {item.security_deposit ? `₹${item.security_deposit}` : "N/A"}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        item.availability_status === "available"
                          ? "bg-emerald-600 text-white"
                          : item.availability_status === "booked"
                          ? "bg-gold-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {item.availability_status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        item.featured
                          ? "bg-gold-500/20 text-gold-700 border-gold-400"
                          : "bg-cream-100 text-cream-400 border-cream-300 hover:text-gold-600"
                      }`}
                      title={item.featured ? "Featured on Home" : "Click to Feature"}
                    >
                      <Star className={`w-4 h-4 ${item.featured ? "fill-gold-500 text-gold-500" : ""}`} />
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        item.active
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                          : "bg-red-500/10 text-red-700 border-red-500/30"
                      }`}
                    >
                      {item.active ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/jewellery/${item.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg text-brand-700 hover:text-brand-900 hover:bg-cream-200 transition-colors"
                        title="View Public Item Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/jewellery/${item.id}/edit`}
                        className="p-2 rounded-lg text-gold-700 hover:text-gold-900 hover:bg-gold-500/10 transition-colors"
                        title="Edit Item"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-500/10 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
