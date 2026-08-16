"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, MessageSquare, Sparkles } from "lucide-react";
import { GalleryItem } from "@/types/database";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";

interface GalleryLightboxModalProps {
  items: GalleryItem[];
  whatsappNumber?: string;
  businessName?: string;
}

export function GalleryLightboxModal({
  items,
  whatsappNumber = "919876543210",
  businessName = "MehendiAura",
}: GalleryLightboxModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems = activeCategory === "All"
    ? items
    : items.filter((i) => i.category === activeCategory);

  const activeItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSelectedIndex(null);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? "bg-gold-500 text-brand-950 shadow-md font-bold"
                : "bg-cream-200 text-brand-800 hover:bg-gold-500/20 hover:text-gold-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setSelectedIndex(idx)}
            className="group relative rounded-2xl overflow-hidden bg-brand-900 border border-gold-300/30 shadow-soft cursor-pointer aspect-4/5 transition-all duration-300 hover:shadow-gold-glow hover:-translate-y-1"
          >
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-cream-100">
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold mb-1">
                {item.category}
              </span>
              <h3 className="font-serif text-lg font-bold text-white line-clamp-1">
                {item.title}
              </h3>
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-gold-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Click to Expand Lightbox</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeItem && selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-brand-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Close Button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-brand-900 text-gold-300 hover:text-white hover:bg-brand-800 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-brand-900/80 text-gold-300 hover:text-white hover:bg-brand-800 transition-colors z-50"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-brand-900/80 text-gold-300 hover:text-white hover:bg-brand-800 transition-colors z-50"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Content Container */}
          <div className="max-w-4xl w-full bg-brand-900 border border-gold-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            <div className="md:w-2/3 bg-black flex items-center justify-center p-4 min-h-[300px]">
              <img
                src={activeItem.image_url}
                alt={activeItem.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="md:w-1/3 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-cream-100 bg-brand-900">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-400/40 text-xs font-semibold uppercase tracking-wider">
                  {activeItem.category}
                </span>

                <h2 className="font-serif text-2xl font-bold text-white">
                  {activeItem.title}
                </h2>

                {activeItem.description && (
                  <p className="text-xs sm:text-sm text-cream-200 leading-relaxed">
                    {activeItem.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-brand-800 space-y-3">
                <a
                  href={getWhatsAppUrl(
                    whatsappNumber,
                    `Hi ${businessName}, I am interested in this design from your gallery: "${activeItem.title}" (${activeItem.category}). Could you please share details and availability?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enquire Design on WhatsApp</span>
                </a>

                <div className="text-center text-[11px] text-cream-400">
                  Image {selectedIndex + 1} of {filteredItems.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
