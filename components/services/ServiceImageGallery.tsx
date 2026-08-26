"use client";

import React, { useState } from "react";
import { Heart, X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from "lucide-react";
import { ServiceImage } from "@/types/database";

interface ServiceImageGalleryProps {
  images?: ServiceImage[];
  serviceName: string;
}

export function ServiceImageGallery({ images = [], serviceName }: ServiceImageGalleryProps) {
  const sortedImages = [...images].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
      {/* Main Image Stage */}
      <div
        onClick={() => setIsLightboxOpen(true)}
        className="h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-brand-950 via-brand-900 to-brand-800 border border-gold-500/30 overflow-hidden shadow-2xl relative cursor-pointer group"
      >
        <img
          src={activeImage.image_url}
          alt={activeImage.alt_text || serviceName}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />

        {/* Hover / Touch Expand Hint */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end justify-between text-white pointer-events-none">
          <span className="text-xs font-semibold flex items-center gap-1.5 text-gold-300">
            <Sparkles className="w-4 h-4" />
            <span>Click to View Fullscreen</span>
          </span>
          <div className="p-2 rounded-full bg-brand-900/80 text-gold-300 border border-gold-500/30">
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>

        {/* Photo Counter Badge */}
        {sortedImages.length > 1 && (
          <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-brand-950/80 text-cream-100 text-xs font-semibold backdrop-blur-md shadow-md border border-gold-500/20">
            Photo {activeIdx + 1} of {sortedImages.length}
          </span>
        )}
      </div>

      {/* Thumbnail Bar */}
      {sortedImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {sortedImages.map((img, idx) => (
            <button
              type="button"
              key={img.id || idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                activeIdx === idx
                  ? "border-gold-500 ring-2 ring-gold-400/50 scale-105 shadow-md"
                  : "border-gold-300/30 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img.image_url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-brand-950/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-8 animate-in fade-in duration-200">
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-brand-900/90 border border-gold-500/30 text-gold-300 hover:text-white hover:bg-brand-800 transition-colors z-50 flex items-center justify-center shadow-lg"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          {sortedImages.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-brand-900/80 border border-gold-500/20 text-gold-300 hover:text-white hover:bg-brand-800 transition-colors z-50 flex items-center justify-center shadow-lg"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {sortedImages.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-brand-900/80 border border-gold-500/20 text-gold-300 hover:text-white hover:bg-brand-800 transition-colors z-50 flex items-center justify-center shadow-lg"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Modal Container */}
          <div className="max-w-4xl w-full bg-brand-900 border border-gold-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-4 max-h-[92vh] my-auto">
            <div className="w-full bg-black flex items-center justify-center p-2 rounded-2xl overflow-hidden max-h-[75vh]">
              <img
                src={activeImage.image_url}
                alt={activeImage.alt_text || serviceName}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="pt-4 text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-white">
                {serviceName}
              </h3>
              <span className="text-xs text-gold-400 font-semibold block">
                Photo {activeIdx + 1} of {sortedImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
