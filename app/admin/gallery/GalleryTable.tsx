"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Trash2, CheckCircle2, XCircle, ExternalLink, Filter, X, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";
import { GalleryItem } from "@/types/database";
import { toggleGalleryActive, toggleAllGalleryActive, deleteGalleryItem } from "./actions";

interface GalleryTableProps {
  initialGallery: GalleryItem[];
}

export function GalleryTable({ initialGallery }: GalleryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [galleryList, setGalleryList] = useState(initialGallery);
  const router = useRouter();

  // Extract all unique categories across all uploaded photos
  const categories = ["All", ...Array.from(new Set(galleryList.map((g) => g.category).filter(Boolean)))];

  const filtered = galleryList.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || g.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleToggleActive = async (item: GalleryItem) => {
    try {
      const res = await toggleGalleryActive(item.id, item.active);
      if (res.error) {
        toast.error("Status Update Failed", { description: res.error });
      } else {
        toast.success(`Photo ${!item.active ? "Activated" : "Deactivated"}`);
        setGalleryList((prev) =>
          prev.map((g) => (g.id === item.id ? { ...g, active: !g.active } : g))
        );
        router.refresh();
      }
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  // Toggle All Gallery Photos (Activate All / Deactivate All)
  const [isTogglingAll, setIsTogglingAll] = useState(false);
  const handleToggleAll = async (active: boolean) => {
    if (galleryList.length === 0) return;
    setIsTogglingAll(true);

    const targetIds = new Set(filtered.map((g) => g.id));
    const updated = galleryList.map((g) =>
      targetIds.has(g.id) ? { ...g, active } : g
    );
    setGalleryList(updated);

    try {
      const res = await toggleAllGalleryActive(active, categoryFilter);
      if (res.success) {
        toast.success(
          active
            ? `All ${categoryFilter !== "All" ? `"${categoryFilter}"` : ""} photos activated in gallery!`
            : `All ${categoryFilter !== "All" ? `"${categoryFilter}"` : ""} photos deactivated in gallery.`
        );
        router.refresh();
      } else {
        toast.error("Failed to update photos status.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsTogglingAll(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}" from storage and database?`)) return;

    try {
      const res = await deleteGalleryItem(item.id);
      if (res.error) {
        toast.error("Delete Failed", { description: res.error });
      } else {
        toast.success("Photo Deleted from Storage & Database");
        setGalleryList((prev) => prev.filter((g) => g.id !== item.id));
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete photo");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gold-300/30 shadow-soft overflow-hidden space-y-4 p-6">
      {/* Category Filter Pills */}
      <div className="flex flex-col space-y-3 pb-4 border-b border-cream-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-brand-900 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-gold-600" />
            <span>Category Filter:</span>
          </span>
          {categories.map((cat) => {
            const isActive = categoryFilter === cat;
            const count = cat === "All" ? galleryList.length : galleryList.filter((g) => g.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-brand-900 text-gold-300 border border-gold-400/40 shadow-xs font-bold"
                    : "bg-cream-100 text-brand-800 border border-gold-300/30 hover:bg-cream-200"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? "bg-gold-500 text-brand-950" : "bg-cream-300 text-brand-900"}`}>
                  {count}
                </span>
              </button>
            );
          })}

          {categoryFilter !== "All" && (
            <button
              onClick={() => setCategoryFilter("All")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-red-600 bg-red-500/10 hover:bg-red-500/20 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Clear Filter</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search photo title or category..."
              className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleAll(true)}
                disabled={isTogglingAll || filtered.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300/60 text-xs font-bold transition-all disabled:opacity-50"
                title={`Activate all ${categoryFilter !== "All" ? `"${categoryFilter}"` : ""} photos`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Activate All</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleAll(false)}
                disabled={isTogglingAll || filtered.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 text-brand-800 hover:bg-cream-200 border border-gold-300/40 text-xs font-bold transition-all disabled:opacity-50"
                title={`Deactivate all ${categoryFilter !== "All" ? `"${categoryFilter}"` : ""} photos`}
              >
                <Square className="w-3.5 h-3.5 text-brand-500" />
                <span>Deactivate All</span>
              </button>
            </div>

            <div className="text-xs text-brand-700 font-semibold pl-2">
              Showing <span className="text-gold-700 font-bold">{filtered.length}</span> of {galleryList.length} total photos
            </div>
          </div>
        </div>
      </div>

      {/* Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-cream-300 text-xs font-semibold text-gold-700 uppercase tracking-wider bg-cream-50/50">
              <th className="py-3 px-4">Preview</th>
              <th className="py-3 px-4">Photo Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-brand-600 text-sm">
                  No photos found under category "{categoryFilter}". Click "Upload Multiple Photos" to add!
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-cream-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-14 h-14 rounded-xl bg-brand-900 overflow-hidden border border-gold-300/40 flex items-center justify-center">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-brand-900">
                    <div className="flex flex-col">
                      <span>{item.title}</span>
                      {item.description && (
                        <span className="text-xs text-brand-600 font-normal line-clamp-1">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-800/10 text-brand-900 border border-brand-800/20">
                      {item.category}
                    </span>
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
                      <a
                        href={item.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-brand-700 hover:text-brand-900 hover:bg-cream-200 transition-colors"
                        title="View Full Size Image"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-500/10 transition-colors"
                        title="Delete Photo from Storage & Database"
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
