"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
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

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div className="h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-brand-950 via-brand-900 to-brand-800 border border-gold-500/30 overflow-hidden shadow-2xl relative">
        <img
          src={activeImage.image_url}
          alt={activeImage.alt_text || serviceName}
          className="w-full h-full object-cover transition-all duration-300"
        />
        {sortedImages.length > 1 && (
          <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-brand-950/80 text-cream-100 text-xs font-semibold backdrop-blur-md shadow-md">
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
                  ? "border-gold-500 ring-2 ring-gold-400/50 scale-105"
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
    </div>
  );
}
