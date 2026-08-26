"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Star,
  Trash2,
  Edit,
  Plus,
  UploadCloud,
  Images,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  Loader2,
  AlertTriangle,
  Sparkle,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { GalleryItem } from "@/types/database";
import {
  addItemsToShowcase,
  reorderShowcaseItems,
  toggleShowcaseItemActive,
  toggleAllShowcaseActive,
  updateShowcaseItemDetails,
  deleteShowcaseItem,
} from "@/app/admin/showcase/actions";
import { MediaSelectorModal, MediaItem } from "@/components/ui/MediaSelectorModal";
import { uploadImageToSupabase } from "@/lib/supabase/storage";
import { convertToWebP } from "@/lib/utils/imageCompressor";

interface ShowcaseManagerViewProps {
  initialItems: GalleryItem[];
}

export function ShowcaseManagerView({ initialItems }: ShowcaseManagerViewProps) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>(initialItems);

  // New Upload state
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // Media Library modal state
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [isAddingExisting, setIsAddingExisting] = useState(false);

  // Edit Item modal state
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Live Preview slider state
  const [previewIdx, setPreviewIdx] = useState(0);
  const [showLivePreview, setShowLivePreview] = useState(true);

  const activeItems = items.filter((i) => i.active);

  // Toggle Visibility / Public Display
  const handleToggleActive = async (item: GalleryItem) => {
    const updated = items.map((i) =>
      i.id === item.id ? { ...i, active: !i.active } : i
    );
    setItems(updated);

    try {
      const res = await toggleShowcaseItemActive(item.id, item.active);
      if (res.success) {
        toast.success(
          item.active
            ? "Slide hidden from homepage carousel."
            : "Slide enabled for homepage carousel!"
        );
      } else {
        toast.error("Failed to update slide visibility.");
      }
    } catch {
      toast.error("An error occurred.");
    }
  };

  // Toggle All Slides (Select All / Deselect All)
  const [isTogglingAll, setIsTogglingAll] = useState(false);
  const handleToggleAll = async (active: boolean) => {
    if (items.length === 0) return;
    setIsTogglingAll(true);

    const updated = items.map((i) => ({ ...i, active }));
    setItems(updated);

    try {
      const res = await toggleAllShowcaseActive(active);
      if (res.success) {
        toast.success(
          active
            ? "All slides enabled for Homepage Carousel!"
            : "All slides deselected / hidden from Homepage Carousel."
        );
      } else {
        toast.error("Failed to update all slides.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsTogglingAll(false);
    }
  };

  // Set as Slide #1 (Make First)
  const handleMakeFirst = async (item: GalleryItem) => {
    const remaining = items.filter((i) => i.id !== item.id);
    const newOrder = [item, ...remaining].map((i, idx) => ({
      ...i,
      display_order: idx + 1,
    }));

    setItems(newOrder);

    try {
      const res = await reorderShowcaseItems(newOrder.map((i) => i.id));
      if (res.success) {
        toast.success(`"${item.title}" is now Slide #1 on Homepage!`);
      }
    } catch {
      toast.error("Failed to reorder slides.");
    }
  };

  // Reorder Left / Right
  const handleMoveItem = async (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const reordered = newItems.map((img, idx) => ({
      ...img,
      display_order: idx + 1,
    }));

    setItems(reordered);

    try {
      const res = await reorderShowcaseItems(reordered.map((img) => img.id));
      if (res.success) {
        toast.success("Showcase order updated!");
      }
    } catch {
      toast.error("Failed to save order.");
    }
  };

  // Delete Confirm
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteShowcaseItem(itemToDelete.id);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
        toast.success("Item removed from showcase.");
      } else {
        toast.error("Failed to remove item.");
      }
    } catch {
      toast.error("An error occurred during deletion.");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // Pending File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length === 0) return;

    setPendingFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPendingPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const handleRemovePending = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, idx) => idx !== index));
    setPendingPreviews((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Upload Pending Files to Supabase Storage
  const handleUploadPendingFiles = async () => {
    if (pendingFiles.length === 0) return;

    setIsUploadingNew(true);
    setUploadProgress(`Optimizing ${pendingFiles.length} photo(s) to WebP...`);

    try {
      const webpFiles = await Promise.all(
        pendingFiles.map((f) => convertToWebP(f, 0.85))
      );

      setUploadProgress(`Uploading ${webpFiles.length} WebP photo(s)...`);

      const uploadResults = await Promise.all(
        webpFiles.map((file) => uploadImageToSupabase(file, "gallery"))
      );

      const itemsToAdd: { url: string; title: string; category: string; storage_path?: string }[] = [];
      uploadResults.forEach((res, idx) => {
        if (res.url) {
          let storage_path = res.url.includes("mehendiaura-images/")
            ? res.url.split("mehendiaura-images/")[1]
            : undefined;
          itemsToAdd.push({
            url: res.url,
            storage_path,
            title: `Featured Artistry #${items.length + idx + 1}`,
            category: "Featured Showcase",
          });
        }
      });

      if (itemsToAdd.length > 0) {
        const res = await addItemsToShowcase(itemsToAdd);
        if (res.success) {
          toast.success(`Successfully uploaded and added ${itemsToAdd.length} photo(s)!`);
          setPendingFiles([]);
          setPendingPreviews([]);
          router.refresh();
        } else {
          toast.error("Failed to add photos.", { description: res.error });
        }
      }
    } catch {
      toast.error("An error occurred during image upload.");
    } finally {
      setIsUploadingNew(false);
      setUploadProgress("");
    }
  };

  // Pick from Media Library Modal
  const handleSelectMediaItems = async (selectedMedia: MediaItem[]) => {
    if (selectedMedia.length === 0) return;

    setIsAddingExisting(true);
    try {
      const itemsToAdd = selectedMedia.map((m) => ({
        url: m.url,
        storage_path: m.storage_path,
        title: m.title || "Featured Showcase Item",
        category: m.category || "Featured Showcase",
      }));

      const res = await addItemsToShowcase(itemsToAdd);
      if (res.success) {
        toast.success(`Added ${selectedMedia.length} photo(s) to showcase!`);
        router.refresh();
      } else {
        toast.error("Failed to add selected images.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsAddingExisting(false);
    }
  };

  // Save Edit Item Details
  const handleSaveEditItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsUpdatingDetails(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await updateShowcaseItemDetails(editingItem.id, formData);
      if (res.success) {
        toast.success("Showcase slide details updated!");
        setEditingItem(null);
        router.refresh();
      } else {
        toast.error("Failed to update slide details.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsUpdatingDetails(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gold-300/40 shadow-soft">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-spin-slow" />
            <span>Homepage Auto-Sliding Carousel</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-900">
            Featured Showcase Manager
          </h1>
          <p className="text-xs sm:text-sm text-brand-600 max-w-2xl">
            Choose which photos appear in the prominent auto-sliding carousel on the homepage, arrange slide order, and customize slide captions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsMediaSelectorOpen(true)}
            isLoading={isAddingExisting}
            leftIcon={<Sparkle className="w-4 h-4 text-gold-600" />}
          >
            Choose from Media Library
          </Button>

          <Link href="/en" target="_blank" className="hidden sm:inline-flex">
            <Button
              type="button"
              variant="gold"
              size="sm"
              leftIcon={<ExternalLink className="w-4 h-4" />}
            >
              View Live Site
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gold-300/30 shadow-xs">
          <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider block">
            Total Showcase Slides
          </span>
          <span className="font-serif text-2xl font-bold text-brand-900">{items.length}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gold-300/30 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Active on Homepage
          </span>
          <span className="font-serif text-2xl font-bold text-emerald-700">{activeItems.length}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gold-300/30 shadow-xs">
          <span className="text-[11px] font-bold text-brand-500 uppercase tracking-wider block">
            Hidden Slides
          </span>
          <span className="font-serif text-2xl font-bold text-brand-500">
            {items.length - activeItems.length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gold-300/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-gold-800 uppercase tracking-wider block">
              Live Preview
            </span>
            <span className="text-xs font-semibold text-brand-700">
              {showLivePreview ? "Visible Below" : "Collapsed"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="p-2 rounded-xl bg-cream-100 hover:bg-gold-500/20 text-gold-800 transition-colors"
            title="Toggle Live Preview"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Live Interactive Homepage Carousel Preview */}
      {showLivePreview && activeItems.length > 0 && (
        <div className="bg-brand-950 p-6 rounded-3xl border border-gold-500/30 shadow-2xl text-white space-y-4">
          <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
            <div className="flex items-center gap-2 text-gold-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Live Homepage Carousel Preview (Real-Time Order)</span>
            </div>
            <span className="text-xs text-cream-300">
              Slide {previewIdx + 1} of {activeItems.length}
            </span>
          </div>

          <div className="relative h-60 sm:h-80 rounded-2xl overflow-hidden bg-black border border-gold-500/30 flex items-center justify-center">
            {/* Ambient Background */}
            <img
              src={activeItems[previewIdx]?.image_url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110"
            />

            {/* Foreground Image */}
            <img
              src={activeItems[previewIdx]?.image_url}
              alt={activeItems[previewIdx]?.title || "Preview"}
              className="relative z-10 max-h-full max-w-full object-contain p-2"
            />

            {/* Caption Overlay */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-brand-950/90 via-transparent to-transparent p-4 flex flex-col justify-end">
              <span className="text-[10px] uppercase font-bold text-gold-400">
                {activeItems[previewIdx]?.category || "Featured Showcase"}
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                {activeItems[previewIdx]?.title || "Artistry Showcase"}
              </h3>
            </div>

            {/* Prev / Next Controls */}
            {activeItems.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setPreviewIdx(
                      (previewIdx - 1 + activeItems.length) % activeItems.length
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-brand-900/80 text-gold-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPreviewIdx((previewIdx + 1) % activeItems.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-brand-900/80 text-gold-300 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 4. Showcase Cards List & Reordering */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-cream-200">
          <div>
            <h2 className="font-serif text-xl font-bold text-brand-900">
              Showcase Slides ({items.length} Total)
            </h2>
            <span className="text-xs text-brand-600">
              Drag/move slides to reorder. Slide #1 will be the first image shown to visitors.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleToggleAll(true)}
              disabled={isTogglingAll || items.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300/60 text-xs font-bold transition-all disabled:opacity-50"
              title="Show all slides on homepage"
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Select All</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleAll(false)}
              disabled={isTogglingAll || items.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 text-brand-800 hover:bg-cream-200 border border-gold-300/40 text-xs font-bold transition-all disabled:opacity-50"
              title="Hide all slides from homepage"
            >
              <Square className="w-3.5 h-3.5 text-brand-500" />
              <span>Deselect All</span>
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gold-300/60 p-8 space-y-3">
            <Images className="w-12 h-12 text-gold-400 mx-auto opacity-70" />
            <h3 className="font-serif text-lg font-bold text-brand-900">
              No photos added to showcase yet
            </h3>
            <p className="text-xs text-brand-600 max-w-md mx-auto">
              Pick existing photos from your Media Library or upload new high-resolution photos below.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={() => setIsMediaSelectorOpen(true)}
                leftIcon={<Sparkle className="w-4 h-4" />}
              >
                Choose from Media Library
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, idx) => {
              const isFirst = idx === 0;

              return (
                <div
                  key={item.id}
                  className={`relative rounded-3xl overflow-hidden border-2 bg-white flex flex-col justify-between shadow-soft transition-all ${
                    isFirst
                      ? "border-gold-500 ring-2 ring-gold-400/40"
                      : !item.active
                      ? "border-cream-300 opacity-60 hover:opacity-100"
                      : "border-gold-300/40"
                  }`}
                >
                  {/* Thumbnail Stage */}
                  <div className="relative h-48 bg-brand-950 overflow-hidden group">
                    <img
                      src={item.image_url}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110"
                    />
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="relative z-10 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-950/85 text-cream-100 text-[10px] font-bold shadow-md">
                        Slide #{idx + 1}
                      </span>

                      {isFirst ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold-500 text-brand-950 font-bold text-[10px] uppercase tracking-wider shadow-md">
                          <Star className="w-3 h-3 fill-brand-950" />
                          1ST SLIDE
                        </span>
                      ) : !item.active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cream-300 text-brand-800 font-bold text-[10px] uppercase tracking-wider shadow-md">
                          <EyeOff className="w-3 h-3" />
                          HIDDEN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
                          <Eye className="w-3 h-3" />
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Slide Captions */}
                  <div className="p-3.5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-gold-700 block">
                      {item.category || "Showcase"}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-brand-900 line-clamp-1">
                      {item.title}
                    </h3>
                    {item.title_kn && (
                      <p className="text-[11px] text-brand-600 font-medium line-clamp-1">
                        {item.title_kn}
                      </p>
                    )}
                  </div>

                  {/* Public Display & Make First Bar */}
                  <div className="px-3.5 py-2 bg-cream-50 border-t border-cream-200 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-brand-900 hover:text-gold-700"
                      title={
                        item.active
                          ? "Click to hide from carousel"
                          : "Click to show on carousel"
                      }
                    >
                      {item.active ? (
                        <>
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-800 font-bold">On Homepage</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-4 h-4 text-brand-400" />
                          <span className="text-brand-500 line-through">On Homepage</span>
                        </>
                      )}
                    </button>

                    {!isFirst && (
                      <button
                        type="button"
                        onClick={() => handleMakeFirst(item)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gold-500/20 text-gold-800 hover:bg-gold-500/30 text-[11px] font-bold transition-colors border border-gold-400/40"
                        title="Make this the first slide"
                      >
                        <Star className="w-3 h-3" />
                        <span>Make 1st</span>
                      </button>
                    )}
                  </div>

                  {/* Card Controls & Reordering */}
                  <div className="p-3 bg-white border-t border-cream-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveItem(idx, "left")}
                        className="p-1.5 rounded-lg bg-cream-100 text-brand-800 hover:bg-gold-500/20 hover:text-gold-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move Left / Make Earlier"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        onClick={() => handleMoveItem(idx, "right")}
                        className="p-1.5 rounded-lg bg-cream-100 text-brand-800 hover:bg-gold-500/20 hover:text-gold-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move Right / Make Later"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 text-gold-700 hover:text-gold-800 hover:bg-gold-50 rounded-lg transition-colors"
                        title="Edit Title & Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToDelete(item)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Upload New Showcase Photos Box */}
      <div className="p-6 rounded-3xl bg-cream-50/70 border border-gold-300/40 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-cream-200">
          <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-700 flex items-center justify-center shrink-0">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-brand-900">
              Upload New Showcase Photos
            </h2>
            <p className="text-xs text-brand-600">
              Photos will be automatically optimized to lightweight WebP format and added to your showcase.
            </p>
          </div>
        </div>

        {/* Pending Previews Strip */}
        {pendingPreviews.length > 0 && (
          <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-400/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold-800 uppercase tracking-wider">
                Photos Ready for Upload ({pendingPreviews.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  setPendingFiles([]);
                  setPendingPreviews([]);
                }}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {pendingPreviews.map((url, idx) => (
                <div
                  key={idx}
                  className="relative h-28 rounded-xl overflow-hidden border border-gold-400 bg-brand-950 group"
                >
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePending(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={handleUploadPendingFiles}
                isLoading={isUploadingNew}
                leftIcon={<UploadCloud className="w-4 h-4" />}
              >
                {uploadProgress || `Upload ${pendingFiles.length} Photo(s) to Showcase`}
              </Button>
            </div>
          </div>
        )}

        {/* File Dropzone */}
        <label className="border-2 border-dashed border-gold-400/60 hover:border-gold-500 bg-white hover:bg-gold-500/5 rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
            <Plus className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-brand-900 block">
              Select Photos from Device
            </span>
            <span className="text-[11px] text-brand-600 block">
              Supports high-res JPG, PNG, WEBP.
            </span>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      </div>

      {/* 6. Edit Slide Details Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-brand-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-gold-300/40 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-800 flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-900">
                  Edit Showcase Slide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 text-brand-600 hover:text-brand-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-36 rounded-2xl overflow-hidden bg-brand-950 flex items-center justify-center">
              <img
                src={editingItem.image_url}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <form onSubmit={handleSaveEditItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  name="title_en"
                  required
                  defaultValue={editingItem.title_en || editingItem.title}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-1">
                  Title (Kannada)
                </label>
                <input
                  type="text"
                  name="title_kn"
                  defaultValue={editingItem.title_kn || ""}
                  placeholder="e.g. ವಧುವಿನ ಮೆಹೆಂದಿ ಕಲೆ"
                  className="w-full px-4 py-2.5 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-1">
                  Category Tag (e.g. Bridal Mehendi / Rental Jewellery)
                </label>
                <input
                  type="text"
                  name="category"
                  defaultValue={editingItem.category}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <input
                type="hidden"
                name="active"
                value={editingItem.active ? "true" : "false"}
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-cream-100 text-brand-800 font-semibold text-xs hover:bg-cream-200 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  isLoading={isUpdatingDetails}
                >
                  Save Slide Details
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Delete Slide Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-brand-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-gold-300/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 pb-3 border-b border-cream-200">
              <div className="p-2.5 rounded-xl bg-red-100 shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-900">
                  Remove Photo from Showcase?
                </h3>
                <p className="text-xs text-brand-600">
                  This photo will no longer appear in the homepage slider.
                </p>
              </div>
            </div>

            <div className="h-36 rounded-2xl overflow-hidden bg-brand-950 flex items-center justify-center">
              <img
                src={itemToDelete.image_url}
                alt="To Delete"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-200">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-cream-100 text-brand-800 font-semibold text-xs hover:bg-cream-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md transition-colors"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirm Remove</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Media Library Selector Modal */}
      <MediaSelectorModal
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelectImages={handleSelectMediaItems}
        alreadyAttachedUrls={items.map((i) => i.image_url)}
        title="Add Photos to Homepage Showcase"
      />
    </div>
  );
}
