"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Trash2, CheckCircle2, XCircle, ExternalLink, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { GalleryItem } from "@/types/database";
import { toggleGalleryActive, deleteGalleryItem } from "./actions";

interface GalleryTableProps {
  initialGallery: GalleryItem[];
}

export function GalleryTable({ initialGallery }: GalleryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [galleryList, setGalleryList] = useState(initialGallery);
  const router = useRouter();

  const filtered = galleryList.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    try {
      const res = await deleteGalleryItem(item.id);
      if (res.error) {
        toast.error("Delete Failed", { description: res.error });
      } else {
        toast.success("Photo Deleted");
        setGalleryList((prev) => prev.filter((g) => g.id !== item.id));
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete photo");
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
            placeholder="Search gallery photos..."
            className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div className="text-xs text-brand-700 font-semibold">
          Total Gallery Photos: <span className="text-gold-700 font-bold">{filtered.length}</span>
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
              <th className="py-3 px-4">Display Order</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-brand-600 text-sm">
                  No photos in showcase gallery. Click "Add Photo to Gallery" to upload!
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
                  <td className="py-4 px-4 text-xs font-mono font-medium text-gold-700">
                    #{item.display_order}
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
                        title="Delete Photo"
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
