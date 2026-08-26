"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Plus,
  UploadCloud,
  Images,
  Star,
  Loader2,
  AlertTriangle,
  Sparkle,
  X,
  EyeOff,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Jewellery, JewelleryImage } from "@/types/database";
import {
  updateJewellery,
  addJewelleryImages,
  deleteJewelleryImage,
  reorderJewelleryImages,
  toggleJewelleryImageVisibility,
  toggleAllJewelleryImagesVisibility,
  setJewelleryImageAsPrimary,
} from "../../actions";
import { MediaSelectorModal, MediaItem } from "@/components/ui/MediaSelectorModal";
import { uploadImageToSupabase } from "@/lib/supabase/storage";
import { convertToWebP } from "@/lib/utils/imageCompressor";

interface EditJewelleryFormProps {
  item: Jewellery;
}

const PRESET_CATEGORIES = [
  "Bridal Sets",
  "Necklace Sets",
  "Temple Jewellery",
  "Choker Sets",
  "Earrings",
  "Bangles",
  "Maang Tikka",
  "Vaddanam",
  "Hair Accessories",
];

export function EditJewelleryForm({ item }: EditJewelleryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Images state
  const initialImages: JewelleryImage[] = (item.jewellery_images || []).sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );
  const [images, setImages] = useState<JewelleryImage[]>(initialImages);
  const [imageToDelete, setImageToDelete] = useState<JewelleryImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New Upload state
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // Media Library Selector Modal state
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [isAddingExisting, setIsAddingExisting] = useState(false);

  // Form Submit (Save Details)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateJewellery(item.id, formData);
      if (res.error) {
        toast.error("Update Failed", { description: res.error });
      } else {
        toast.success("Jewellery Item Updated Successfully!");
        router.push("/admin/jewellery");
        router.refresh();
      }
    } catch {
      toast.error("Failed to update item");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Visibility for Public Display
  const handleToggleVisibility = async (img: JewelleryImage) => {
    const isCurrentlyHidden = img.alt_text?.startsWith("[hidden]");
    const cleanAlt = (img.alt_text || "").replace("[hidden]", "").trim() || "Jewellery Photo";
    const updatedAlt = isCurrentlyHidden ? cleanAlt : `[hidden] ${cleanAlt}`;

    setImages((prev) =>
      prev.map((i) => (i.id === img.id ? { ...i, alt_text: updatedAlt } : i))
    );

    try {
      const res = await toggleJewelleryImageVisibility(img.id, img.alt_text, item.id);
      if (res.success) {
        toast.success(
          isCurrentlyHidden
            ? "Image enabled for public showcase!"
            : "Image hidden from public showcase."
        );
      } else {
        toast.error("Failed to update visibility.");
      }
    } catch {
      toast.error("An error occurred while updating visibility.");
    }
  };

  // Toggle All Images Visibility (Select All / Deselect All)
  const [isTogglingAll, setIsTogglingAll] = useState(false);
  const handleToggleAllVisibility = async (visible: boolean) => {
    if (images.length === 0) return;
    setIsTogglingAll(true);

    const updated = images.map((img) => {
      const clean = (img.alt_text || "").replace("[hidden]", "").trim() || "Jewellery Photo";
      return {
        ...img,
        alt_text: visible ? clean : `[hidden] ${clean}`,
      };
    });
    setImages(updated);

    try {
      const res = await toggleAllJewelleryImagesVisibility(item.id, visible);
      if (res.success) {
        toast.success(
          visible
            ? "All photos enabled for public showcase!"
            : "All photos deselected / hidden from public showcase."
        );
      } else {
        toast.error("Failed to update all photos.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsTogglingAll(false);
    }
  };

  // Set as Primary Image
  const handleSetPrimary = async (img: JewelleryImage) => {
    const remaining = images.filter((i) => i.id !== img.id);
    const newOrder = [img, ...remaining].map((i, idx) => ({
      ...i,
      display_order: idx + 1,
      alt_text: (i.alt_text || "").replace("[hidden]", "").trim() || "Jewellery Photo",
    }));

    setImages(newOrder);

    try {
      const res = await setJewelleryImageAsPrimary(img.id, item.id);
      if (res.success) {
        toast.success("Primary cover image updated!");
      } else {
        toast.error("Failed to set primary image.");
      }
    } catch {
      toast.error("An error occurred while updating primary image.");
    }
  };

  // Delete Image Handler
  const handleConfirmDeleteImage = async () => {
    if (!imageToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteJewelleryImage(imageToDelete.id, item.id);
      if (res.success) {
        setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id));
        toast.success("Image removed from jewellery set.");
      } else {
        toast.error("Failed to remove image.", { description: res.error });
      }
    } catch {
      toast.error("An error occurred while deleting the image.");
    } finally {
      setIsDeleting(false);
      setImageToDelete(null);
    }
  };

  // Reorder Images (Move Left / Move Right)
  const handleMoveImage = async (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    const reordered = newImages.map((img, idx) => ({
      ...img,
      display_order: idx + 1,
    }));

    setImages(reordered);

    try {
      const res = await reorderJewelleryImages(
        item.id,
        reordered.map((img) => img.id)
      );
      if (res.success) {
        toast.success("Image order updated!");
      }
    } catch {
      toast.error("Failed to save image order.");
    }
  };

  // Handle Pending File Selection for Upload
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

  // Upload Pending Files to Supabase Storage and Attach
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
        webpFiles.map((file) => uploadImageToSupabase(file, "jewellery"))
      );

      const itemsToAdd: { url: string; storage_path?: string; alt_text?: string }[] = [];
      uploadResults.forEach((res) => {
        if (res.url) {
          let storage_path = res.url.includes("mehendiaura-images/")
            ? res.url.split("mehendiaura-images/")[1]
            : undefined;
          itemsToAdd.push({
            url: res.url,
            storage_path,
            alt_text: item.name,
          });
        }
      });

      if (itemsToAdd.length > 0) {
        const res = await addJewelleryImages(item.id, itemsToAdd);
        if (res.success) {
          toast.success(`Successfully uploaded ${itemsToAdd.length} photo(s)!`);
          setPendingFiles([]);
          setPendingPreviews([]);
          router.refresh();
        } else {
          toast.error("Failed to attach uploaded photos.", { description: res.error });
        }
      }
    } catch {
      toast.error("An error occurred during image upload.");
    } finally {
      setIsUploadingNew(false);
      setUploadProgress("");
    }
  };

  // Handle Selected Images from Media Selector Modal
  const handleSelectMediaItems = async (selectedMedia: MediaItem[]) => {
    if (selectedMedia.length === 0) return;

    setIsAddingExisting(true);
    try {
      const itemsToAdd = selectedMedia.map((m) => ({
        url: m.url,
        storage_path: m.storage_path,
        alt_text: m.title || item.name,
      }));

      const res = await addJewelleryImages(item.id, itemsToAdd);
      if (res.success) {
        toast.success(`Attached ${selectedMedia.length} existing photo(s)!`);
        router.refresh();
      } else {
        toast.error("Failed to attach existing images.", { description: res.error });
      }
    } catch {
      toast.error("An error occurred while attaching existing images.");
    } finally {
      setIsAddingExisting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* SECTION 1: JEWELLERY IMAGES MANAGEMENT */}
      <div className="p-6 rounded-3xl bg-cream-50/70 border border-gold-300/40 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-700 flex items-center justify-center shrink-0">
              <Images className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-900 leading-tight">
                Jewellery Set Photos &amp; Showcase
              </h2>
              <p className="text-xs text-brand-600">
                Select which images are displayed publicly, set primary cover, reorder, or upload new photos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMediaSelectorOpen(true)}
              isLoading={isAddingExisting}
              leftIcon={<Sparkle className="w-4 h-4 text-gold-600" />}
            >
              Choose Existing Image
            </Button>
          </div>
        </div>

        {/* Existing Jewellery Images Grid */}
        {images.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gold-300/60 p-6 space-y-2">
            <Images className="w-10 h-10 text-gold-400 mx-auto opacity-60" />
            <p className="text-sm font-bold text-brand-900">No images attached to this jewellery set</p>
            <p className="text-xs text-brand-600">
              Upload new photos or pick existing photos from your central library below.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-900">
                Attached Images ({images.length} Total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleAllVisibility(true)}
                  disabled={isTogglingAll}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300/60 text-xs font-bold transition-all disabled:opacity-50"
                  title="Enable all images for public showcase"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Select All</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleAllVisibility(false)}
                  disabled={isTogglingAll}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cream-100 text-brand-800 hover:bg-cream-200 border border-gold-300/40 text-xs font-bold transition-all disabled:opacity-50"
                  title="Hide all images from public showcase"
                >
                  <Square className="w-3.5 h-3.5 text-brand-500" />
                  <span>Deselect All</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, idx) => {
              const isPrimary = idx === 0;
              const isHidden = img.alt_text?.startsWith("[hidden]");

              return (
                <div
                  key={img.id}
                  className={`relative rounded-2xl overflow-hidden border-2 bg-white flex flex-col justify-between shadow-xs transition-all ${
                    isPrimary
                      ? "border-gold-500 ring-2 ring-gold-400/40"
                      : isHidden
                      ? "border-cream-300 opacity-60 hover:opacity-100"
                      : "border-gold-300/40"
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative h-44 bg-brand-950 overflow-hidden group">
                    <img
                      src={img.image_url}
                      alt={img.alt_text || `Jewellery Photo ${idx + 1}`}
                      className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-950/80 text-cream-100 text-[10px] font-bold shadow-md">
                        #{idx + 1}
                      </span>

                      {isPrimary ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold-500 text-brand-950 font-bold text-[10px] uppercase tracking-wider shadow-md">
                          <Star className="w-3 h-3 fill-brand-950" />
                          PRIMARY COVER
                        </span>
                      ) : isHidden ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cream-300 text-brand-800 font-bold text-[10px] uppercase tracking-wider shadow-md">
                          <EyeOff className="w-3 h-3" />
                          HIDDEN
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Public Display Toggle & Make Primary Bar */}
                  <div className="px-3 py-2 bg-cream-50 border-t border-cream-200 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(img)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-brand-900 hover:text-gold-700"
                      title={isHidden ? "Click to display publicly" : "Click to hide from public"}
                    >
                      {isHidden ? (
                        <>
                          <Square className="w-4 h-4 text-brand-400" />
                          <span className="text-brand-500 line-through">Public Display</span>
                        </>
                      ) : (
                        <>
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-800 font-bold">Public Display</span>
                        </>
                      )}
                    </button>

                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gold-500/20 text-gold-800 hover:bg-gold-500/30 text-[11px] font-bold transition-colors border border-gold-400/40"
                        title="Set as Primary Cover Image"
                      >
                        <Star className="w-3 h-3" />
                        <span>Make Cover</span>
                      </button>
                    )}
                  </div>

                  {/* Card Controls & Reordering */}
                  <div className="p-3 bg-white border-t border-cream-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveImage(idx, "left")}
                        className="p-1.5 rounded-lg bg-cream-100 text-brand-800 hover:bg-gold-500/20 hover:text-gold-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move Left / Make Earlier"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === images.length - 1}
                        onClick={() => handleMoveImage(idx, "right")}
                        className="p-1.5 rounded-lg bg-cream-100 text-brand-800 hover:bg-gold-500/20 hover:text-gold-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move Right / Make Later"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setImageToDelete(img)}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* Pending Upload Previews */}
        {pendingPreviews.length > 0 && (
          <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-400/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold-800 uppercase tracking-wider">
                New Photos Selected for Upload ({pendingPreviews.length})
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
                <div key={idx} className="relative h-28 rounded-xl overflow-hidden border border-gold-400 bg-brand-950 group">
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
                {uploadProgress || `Upload ${pendingFiles.length} New Photo(s)`}
              </Button>
            </div>
          </div>
        )}

        {/* Upload Controls */}
        <div className="pt-2">
          <label className="border-2 border-dashed border-gold-400/60 hover:border-gold-500 bg-white hover:bg-gold-500/5 rounded-2xl p-5 text-center cursor-pointer flex flex-col items-center justify-center gap-2 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
              <Plus className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-brand-900 block">
                Select &amp; Add New Photos from Device
              </span>
              <span className="text-[11px] text-brand-600 block">
                Supports JPG, PNG, WEBP. Converted automatically to optimized WebP.
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
      </div>

      {/* SECTION 2: JEWELLERY DETAILS FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-900">
            Jewellery Set Details &amp; Translations
          </h2>
          <span className="text-xs text-brand-600">English (EN) &amp; Kannada (KN)</span>
        </div>

        {/* English & Kannada Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Jewellery Set Name (English)
            </label>
            <input
              type="text"
              name="name_en"
              required
              defaultValue={item.name_en || item.name}
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Jewellery Set Name (Kannada)
            </label>
            <input
              type="text"
              name="name_kn"
              defaultValue={item.name_kn || ""}
              placeholder="e.g. ಕುಂದನ್ ಬ್ರೈಡಲ್ ಸೆಟ್"
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        {/* Category, Pricing, Deposit, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
              {PRESET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
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
              Security Deposit (₹)
            </label>
            <input
              type="number"
              name="security_deposit"
              step="100"
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
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>

        {/* Included Items in Set */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Included Items in Set (English, one item per line)
            </label>
            <textarea
              name="included_items_en"
              rows={4}
              defaultValue={(item.included_items_en || item.included_items || []).join("\n")}
              placeholder="Choker Necklace&#10;Matching Earrings&#10;Maang Tikka"
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Included Items in Set (Kannada, one item per line)
            </label>
            <textarea
              name="included_items_kn"
              rows={4}
              defaultValue={(item.included_items_kn || []).join("\n")}
              placeholder="ಚೋಕರ್ ಹಾರ&#10;ಓಲೆಗಳು&#10;ಮಾಂಗ್ ಟಿಕ್ಕಾ"
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        {/* Short Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Short Description (English)
            </label>
            <textarea
              name="short_description_en"
              required
              rows={2}
              defaultValue={item.short_description_en || item.short_description}
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Short Description (Kannada)
            </label>
            <textarea
              name="short_description_kn"
              rows={2}
              defaultValue={item.short_description_kn || ""}
              placeholder="ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ..."
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        {/* Full Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Detailed Description (English)
            </label>
            <textarea
              name="description_en"
              required
              rows={4}
              defaultValue={item.description_en || item.description || ""}
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Detailed Description (Kannada)
            </label>
            <textarea
              name="description_kn"
              rows={4}
              defaultValue={item.description_kn || ""}
              placeholder="ಸಂಪೂರ್ಣ ವಿವರಣೆ..."
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        {/* Legacy Fields */}
        <input type="hidden" name="name" value={item.name} />
        <input type="hidden" name="slug" value={item.slug} />
        <input type="hidden" name="short_description" value={item.short_description} />
        <input type="hidden" name="description" value={item.description || ""} />

        {/* Status Toggles */}
        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-brand-900 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              value="true"
              defaultChecked={item.featured}
              className="w-4 h-4 text-gold-600 rounded focus:ring-gold-500 accent-gold-600"
            />
            <span>Featured Set (Shown on Homepage)</span>
          </label>

          <label className="flex items-center gap-2 text-sm font-semibold text-brand-900 cursor-pointer">
            <input
              type="checkbox"
              name="active"
              value="true"
              defaultChecked={item.active}
              className="w-4 h-4 text-gold-600 rounded focus:ring-gold-500 accent-gold-600"
            />
            <span>Active Listing (Visible to Public)</span>
          </label>
        </div>

        {/* Save Details Button */}
        <div className="flex justify-end gap-3 pt-6 border-t border-cream-200">
          <Link href="/admin/jewellery">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="gold" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
            Save All Jewellery Changes
          </Button>
        </div>
      </form>

      {/* Confirmation Modal to Delete Single Image */}
      {imageToDelete && (
        <div className="fixed inset-0 z-50 bg-brand-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-gold-300/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 pb-3 border-b border-cream-200">
              <div className="p-2.5 rounded-xl bg-red-100 shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-900">
                  Remove Photo from Jewellery Set?
                </h3>
                <p className="text-xs text-brand-600">
                  This photo will be detached from this jewellery listing.
                </p>
              </div>
            </div>

            <div className="h-36 rounded-2xl overflow-hidden bg-brand-950 flex items-center justify-center">
              <img src={imageToDelete.image_url} alt="To Delete" className="max-h-full max-w-full object-contain" />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-200">
              <button
                type="button"
                onClick={() => setImageToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-cream-100 text-brand-800 font-semibold text-xs hover:bg-cream-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteImage}
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

      {/* Media Selector Modal */}
      <MediaSelectorModal
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelectImages={handleSelectMediaItems}
        alreadyAttachedUrls={images.map((img) => img.image_url)}
      />
    </div>
  );
}
