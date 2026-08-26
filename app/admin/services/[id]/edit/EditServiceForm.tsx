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
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Service, ServiceImage } from "@/types/database";
import {
  updateService,
  addServiceImages,
  deleteServiceImage,
  reorderServiceImages,
  updateServiceImageAltText,
} from "../../actions";
import { MediaSelectorModal, MediaItem } from "@/components/ui/MediaSelectorModal";
import { uploadImageToSupabase } from "@/lib/supabase/storage";
import { convertToWebP } from "@/lib/utils/imageCompressor";

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

  // Category state
  const isInitiallyPreset = PRESET_CATEGORIES.includes(service.category);
  const [selectedCategory, setSelectedCategory] = useState(
    isInitiallyPreset ? service.category : "Custom"
  );
  const [customCategory, setCustomCategory] = useState(
    isInitiallyPreset ? "" : service.category
  );

  const isCustomSelected = selectedCategory === "Custom";
  const finalCategory = isCustomSelected ? customCategory : selectedCategory;

  // Images state
  const initialImages: ServiceImage[] = (service.service_images || []).sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );
  const [images, setImages] = useState<ServiceImage[]>(initialImages);
  const [imageToDelete, setImageToDelete] = useState<ServiceImage | null>(null);
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
    formData.set("category", finalCategory || "General Service");

    try {
      const res = await updateService(service.id, formData);
      if (res.error) {
        toast.error("Update Failed", { description: res.error });
      } else {
        toast.success("Service Details Saved Successfully!");
        router.push("/admin/services");
        router.refresh();
      }
    } catch {
      toast.error("Failed to update service");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Image Handler
  const handleConfirmDeleteImage = async () => {
    if (!imageToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteServiceImage(imageToDelete.id, service.id);
      if (res.success) {
        setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id));
        toast.success("Image removed from service.");
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

    // Update display_order property locally
    const reordered = newImages.map((img, idx) => ({
      ...img,
      display_order: idx + 1,
    }));

    setImages(reordered);

    // Call server action to persist order
    try {
      const res = await reorderServiceImages(
        service.id,
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
      // 1. Convert to WebP in parallel
      const webpFiles = await Promise.all(
        pendingFiles.map((f) => convertToWebP(f, 0.85))
      );

      setUploadProgress(`Uploading ${webpFiles.length} WebP photo(s)...`);

      // 2. Upload to storage in parallel
      const uploadResults = await Promise.all(
        webpFiles.map((file) => uploadImageToSupabase(file, "services"))
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
            alt_text: service.name,
          });
        }
      });

      if (itemsToAdd.length > 0) {
        const res = await addServiceImages(service.id, itemsToAdd);
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
        alt_text: m.title || service.name,
      }));

      const res = await addServiceImages(service.id, itemsToAdd);
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

  const attachedUrls = images.map((img) => img.image_url);

  return (
    <div className="space-y-10">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: SERVICE IMAGES MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 rounded-3xl bg-cream-50/70 border border-gold-300/40 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-700 flex items-center justify-center shrink-0">
              <Images className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-900 leading-tight">
                Service Photos &amp; Media Attachments
              </h2>
              <p className="text-xs text-brand-600">
                View, reorder, delete, or add new and existing photos for this service. Image #1 is marked as <span className="font-bold text-gold-700">PRIMARY</span>.
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

        {/* Existing Service Images Grid */}
        {images.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gold-300/60 p-6 space-y-2">
            <Images className="w-10 h-10 text-gold-400 mx-auto opacity-60" />
            <p className="text-sm font-bold text-brand-900">No images attached to this service</p>
            <p className="text-xs text-brand-600">
              Upload new photos or pick existing photos from your central library below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, idx) => {
              const isPrimary = idx === 0;

              return (
                <div
                  key={img.id}
                  className={`relative rounded-2xl overflow-hidden border-2 bg-white flex flex-col justify-between shadow-xs transition-all ${
                    isPrimary ? "border-gold-500 ring-2 ring-gold-400/40" : "border-gold-300/40"
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative h-44 bg-brand-950 overflow-hidden group">
                    <img
                      src={img.image_url}
                      alt={img.alt_text || `Service Photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-brand-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImageToDelete(img)}
                        className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md flex items-center gap-1 text-xs font-semibold"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-950/80 text-cream-100 text-[10px] font-bold shadow-md">
                        #{idx + 1}
                      </span>

                      {isPrimary && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold-500 text-brand-950 font-bold text-[10px] uppercase tracking-wider shadow-md">
                          <Star className="w-3 h-3 fill-brand-950" />
                          PRIMARY
                        </span>
                      )}
                    </div>
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
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploadingNew}
            />
          </label>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: MAIN SERVICE INFORMATION FORM */}
      {/* ------------------------------------------------------------- */}
      <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-cream-200">
        <h3 className="font-serif text-lg font-bold text-brand-900 pb-2 border-b border-cream-200">
          Service Details &amp; Pricing
        </h3>

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
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-semibold"
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

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: MEDIA SELECTOR MODAL (CHOOSE EXISTING) */}
      {/* ------------------------------------------------------------- */}
      <MediaSelectorModal
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelectImages={handleSelectMediaItems}
        alreadyAttachedUrls={attachedUrls}
        title="Select Existing Images for Service"
      />

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: DELETE CONFIRMATION DIALOG */}
      {/* ------------------------------------------------------------- */}
      {imageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gold-300/40 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif text-xl font-bold text-brand-900">
                Remove this image?
              </h3>
              <p className="text-xs text-brand-600 leading-relaxed">
                This image will be removed from this service. If it is not used anywhere else, the physical file will also be deleted from storage.
              </p>
            </div>

            <div className="relative h-32 rounded-xl overflow-hidden border border-cream-300 bg-brand-950 mx-auto max-w-xs">
              <img src={imageToDelete.image_url} alt="To Delete" className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-cream-200">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setImageToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleConfirmDeleteImage}
                isLoading={isDeleting}
              >
                Remove Image
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
