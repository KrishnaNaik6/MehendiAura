"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Check, Images, Loader2, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchMediaLibraryImages } from "@/app/admin/services/actions";

export interface MediaItem {
  url: string;
  storage_path?: string;
  title?: string;
  category?: string;
  source?: "gallery" | "service" | "jewellery" | "storage";
}

interface MediaSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImages: (selectedItems: MediaItem[]) => void;
  alreadyAttachedUrls?: string[];
  title?: string;
}

export function MediaSelectorModal({
  isOpen,
  onClose,
  onSelectImages,
  alreadyAttachedUrls = [],
  title = "Choose Existing Images from Library",
}: MediaSelectorModalProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadMediaLibrary();
      setSelectedUrls([]);
    }
  }, [isOpen]);

  const loadMediaLibrary = async () => {
    setIsLoading(true);
    try {
      const res = await fetchMediaLibraryImages();
      if (res.success && res.data) {
        setMediaItems(res.data);
      }
    } catch {
      // Fallback silent handle
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredItems = mediaItems.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      item.url.toLowerCase().includes(q)
    );
  });

  const toggleSelectUrl = (url: string) => {
    if (alreadyAttachedUrls.includes(url)) return; // Prevent selecting already attached
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const handleConfirm = () => {
    const selectedMedia = mediaItems.filter((item) => selectedUrls.includes(item.url));
    onSelectImages(selectedMedia);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-brand-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gold-300/40 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-cream-200 flex items-center justify-between bg-cream-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-800 text-gold-300 flex items-center justify-center shrink-0">
              <Images className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-900 leading-tight">
                {title}
              </h2>
              <p className="text-xs text-brand-600">
                Select existing uploaded photos to attach without re-uploading duplicate files.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-brand-600 hover:text-brand-900 hover:bg-cream-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Search & Stats */}
        <div className="p-4 bg-white border-b border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-brand-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search library by title or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-cream-50 border border-gold-300/40 rounded-xl text-xs text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <div className="text-xs font-bold text-gold-700 flex items-center gap-2">
            <span>{selectedUrls.length} Image(s) Selected</span>
            <span className="text-brand-400">|</span>
            <span className="text-brand-600">{filteredItems.length} Total Available</span>
          </div>
        </div>

        {/* Modal Body - Scrollable Image Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-cream-50/30">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="w-8 h-8 text-gold-600 animate-spin" />
              <span className="text-xs font-semibold text-brand-800">
                Loading uploaded media library...
              </span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <Images className="w-12 h-12 text-gold-400 mx-auto opacity-60" />
              <p className="text-sm font-bold text-brand-900">No matching images found</p>
              <p className="text-xs text-brand-600">
                No uploaded images found matching your search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredItems.map((item, idx) => {
                const isAttached = alreadyAttachedUrls.includes(item.url);
                const isSelected = selectedUrls.includes(item.url);

                return (
                  <div
                    key={`${item.url}-${idx}`}
                    onClick={() => toggleSelectUrl(item.url)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group h-36 sm:h-40 bg-brand-950 flex flex-col justify-between p-2 ${
                      isAttached
                        ? "border-cream-300 opacity-60 cursor-not-allowed"
                        : isSelected
                        ? "border-gold-500 ring-2 ring-gold-400 shadow-md scale-[1.02]"
                        : "border-gold-300/30 hover:border-gold-400"
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.title || "Library Photo"}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-transparent to-black/30" />

                    {/* Checkbox / Badge */}
                    <div className="relative z-10 flex items-center justify-between">
                      {isAttached ? (
                        <span className="px-2 py-0.5 rounded-full bg-cream-200 text-brand-900 font-bold text-[9px] uppercase tracking-wider shadow-sm">
                          Already Added
                        </span>
                      ) : isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-gold-500 text-brand-950 flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-white/80 bg-black/40 group-hover:border-gold-400 transition-colors" />
                      )}

                      {item.source && (
                        <span className="px-2 py-0.5 rounded-full bg-brand-900/80 text-gold-300 font-semibold text-[9px] capitalize shadow-xs backdrop-blur-xs">
                          {item.source}
                        </span>
                      )}
                    </div>

                    {/* Title Footer */}
                    <div className="relative z-10">
                      <span className="text-[10px] font-semibold text-white truncate block">
                        {item.title || "Uploaded Image"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-cream-200 bg-white flex items-center justify-between gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="gold"
            type="button"
            disabled={selectedUrls.length === 0}
            onClick={handleConfirm}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add {selectedUrls.length > 0 ? `${selectedUrls.length} Selected` : "Selected"} Image(s)
          </Button>
        </div>
      </div>
    </div>
  );
}
