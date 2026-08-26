"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, X, ChevronLeft, ChevronRight, Maximize2, Sparkles, Images } from "lucide-react";
import { ServiceImage } from "@/types/database";

interface ServiceImageGalleryProps {
  images?: ServiceImage[];
  serviceName: string;
  locale?: string;
}

export function ServiceImageGallery({ images = [], serviceName, locale = "en" }: ServiceImageGalleryProps) {
  // Filter out any images marked as [hidden] by the admin
  const visibleImages = images.filter((img) => !img.alt_text?.startsWith("[hidden]"));

  const sortedImages = [...visibleImages].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Touch Swipe State for Android Phones
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (sortedImages.length === 0) {
    return (
      <div className="h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-brand-950 via-brand-900 to-brand-800 border border-gold-500/30 overflow-hidden shadow-2xl flex items-center justify-center relative p-6 text-center">
        <div className="flex flex-col items-center gap-3 text-gold-300">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 stroke-1 opacity-80" />
          <span className="font-serif text-base sm:text-lg tracking-wider text-gold-400">
            {serviceName}
          </span>
        </div>
      </div>
    );
  }

  const activeImage = sortedImages[activeIdx] || sortedImages[0];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % sortedImages.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Stage with Full Image Preservation */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => setIsLightboxOpen(true)}
        className="h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl bg-brand-950 border border-gold-500/30 overflow-hidden shadow-2xl relative cursor-pointer group select-none touch-pan-y"
      >
        {/* Ambient Blur Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={activeImage.image_url}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover blur-xl opacity-40 scale-110"
          />
        </div>

        {/* Complete Uncropped Foreground Image */}
        <img
          src={activeImage.image_url}
          alt={activeImage.alt_text?.replace("[hidden]", "").trim() || serviceName}
          className="relative z-10 w-full h-full object-contain p-2 transition-all duration-500 group-hover:scale-102 drop-shadow-xl"
        />

        {/* Hover / Touch Expand Hint */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end justify-between text-white pointer-events-none">
          <span className="text-xs font-semibold flex items-center gap-1.5 text-gold-300">
            <Sparkles className="w-4 h-4" />
            <span>Tap to View Fullscreen</span>
          </span>
          <div className="p-2 rounded-full bg-brand-900/80 text-gold-300 border border-gold-500/30">
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>

        {/* Photo Counter Badge */}
        {sortedImages.length > 1 && (
          <span className="absolute bottom-3 right-3 z-20 px-3 py-1 rounded-full bg-brand-950/85 text-cream-100 text-xs font-semibold backdrop-blur-md shadow-md border border-gold-500/20">
            Photo {activeIdx + 1} of {sortedImages.length}
          </span>
        )}

        {/* Previous / Next Arrow Buttons */}
        {sortedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-brand-950/70 border border-gold-500/30 text-gold-300 hover:text-white hover:bg-brand-900 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center shadow-lg"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-brand-950/70 border border-gold-500/30 text-gold-300 hover:text-white hover:bg-brand-900 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center shadow-lg"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* 3-4 Preview Thumbnail Strip & View More Button */}
      {sortedImages.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-900 uppercase tracking-wider">
              Photo Showcase ({sortedImages.length} Photos)
            </span>
            <Link
              href={`/${locale}/gallery`}
              className="inline-flex items-center gap-1 text-xs font-bold text-gold-700 hover:text-gold-800 transition-colors"
            >
              <Images className="w-3.5 h-3.5" />
              <span>View More Images</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {sortedImages.map((img, idx) => (
              <button
                type="button"
                key={img.id || idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all bg-brand-950 ${
                  activeIdx === idx
                    ? "border-gold-500 ring-2 ring-gold-400/50 scale-105 shadow-md"
                    : "border-gold-300/30 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img.image_url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-brand-950/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-8 animate-in fade-in duration-200">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-brand-900/90 border border-gold-500/30 text-gold-300 hover:text-white hover:bg-brand-800 transition-colors z-50 flex items-center justify-center shadow-lg"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {sortedImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-brand-900/80 border border-gold-500/20 text-gold-300 hover:text-white hover:bg-brand-800 transition-colors z-50 flex items-center justify-center shadow-lg"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-brand-900/80 border border-gold-500/20 text-gold-300 hover:text-white hover:bg-brand-800 transition-colors z-50 flex items-center justify-center shadow-lg"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-4xl w-full bg-brand-900 border border-gold-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-4 max-h-[92vh] my-auto">
            <div className="w-full bg-black flex items-center justify-center p-2 rounded-2xl overflow-hidden max-h-[75vh]">
              <img
                src={activeImage.image_url}
                alt={activeImage.alt_text?.replace("[hidden]", "").trim() || serviceName}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="pt-4 text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-white">
                {serviceName}
              </h3>
              <div className="flex items-center justify-center gap-3">
                <span className="text-xs text-gold-400 font-semibold block">
                  Photo {activeIdx + 1} of {sortedImages.length}
                </span>
                <Link
                  href={`/${locale}/gallery`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-gold-300 hover:text-gold-400"
                >
                  <Images className="w-3.5 h-3.5" />
                  <span>View Full Gallery</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
