"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, Maximize2, ChevronLeft, ChevronRight, Images, X, MessageSquare } from "lucide-react";
import { GalleryItem } from "@/types/database";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics/track";
import { Locale } from "@/lib/i18n/config";

interface HomeImageShowcaseProps {
  items: GalleryItem[];
  locale?: Locale;
  whatsappNumber?: string;
  businessName?: string;
}

export function HomeImageShowcase({
  items = [],
  locale = "en",
  whatsappNumber = "919876543210",
  businessName = "MHendi by Mamatha",
}: HomeImageShowcaseProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Touch Swipe State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 40;

  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter valid showcase items and exclude any hidden images
  const validItems = items.filter(
    (i) => i.image_url && !i.alt_text?.startsWith("[hidden]")
  );

  // Auto-Slide Effect (4.5s interval)
  useEffect(() => {
    if (validItems.length <= 1 || isPaused || isLightboxOpen) return;

    autoSlideTimerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % validItems.length);
    }, 4500);

    return () => {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
      }
    };
  }, [validItems.length, isPaused, isLightboxOpen]);

  if (validItems.length === 0) {
    return null;
  }

  const activeItem = validItems[activeIdx] || validItems[0];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % validItems.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + validItems.length) % validItems.length);
  };

  // Touch swipe handlers for Android
  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
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

    setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <div className="space-y-3 max-w-5xl mx-auto px-1 sm:px-4">
      {/* Header Badge */}
      <div className="flex items-center justify-between px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-spin-slow shrink-0" />
          <span>Featured Showcase</span>
        </div>
        <Link
          href={`/${locale}/gallery`}
          className="inline-flex items-center gap-1 text-xs font-bold text-gold-700 hover:text-gold-800 transition-colors"
        >
          <Images className="w-3.5 h-3.5" />
          <span>View Images</span>
        </Link>
      </div>

      {/* Main Image Stage - Complete Image Presentation (No Aggressive Cropping) */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => setIsLightboxOpen(true)}
        className="relative h-64 sm:h-80 md:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden bg-brand-950 border border-gold-500/30 shadow-2xl cursor-pointer group select-none touch-pan-y"
      >
        {/* Ambient Blur Backdrop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={activeItem.image_url}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover blur-xl opacity-40 scale-110"
          />
        </div>

        {/* Foreground Complete Full Image */}
        <img
          src={activeItem.image_url}
          alt={activeItem.title || "Showcase Photo"}
          className="relative z-10 w-full h-full object-contain p-2 sm:p-4 transition-all duration-700 group-hover:scale-102 drop-shadow-2xl"
        />

        {/* Ambient Gradient Overlay with Captions */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-brand-950/90 via-transparent to-transparent p-4 sm:p-6 flex flex-col justify-end text-white pointer-events-none">
          <div className="flex items-end justify-between gap-4">
            <div>
              {activeItem.category && (
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gold-400 block mb-1">
                  {activeItem.category}
                </span>
              )}
              <h3 className="font-serif text-base sm:text-2xl font-bold text-white leading-tight">
                {activeItem.title || "Bridal Artistry Showcase"}
              </h3>
            </div>

            <div className="pointer-events-auto">
              <Link
                href={`/${locale}/gallery`}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gold-500 text-brand-950 font-bold text-xs shadow-lg hover:bg-gold-400 transition-all shrink-0 flex items-center gap-1.5"
              >
                <Images className="w-3.5 h-3.5" />
                <span>View Images</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Photo Counter Badge (e.g. 1 / 8) */}
        <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-brand-950/85 border border-gold-500/30 text-cream-100 text-xs font-bold shadow-md backdrop-blur-md">
          {activeIdx + 1} / {validItems.length}
        </div>

        {/* Desktop Prev / Next Buttons */}
        {validItems.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-brand-950/70 border border-gold-500/30 text-gold-300 hover:text-white hover:bg-brand-900 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center shadow-lg"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-brand-950/70 border border-gold-500/30 text-gold-300 hover:text-white hover:bg-brand-900 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center shadow-lg"
              aria-label="Next Image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dot Indicators (● ○ ○ ○) */}
      {validItems.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {validItems.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`h-2 rounded-full transition-all ${
                activeIdx === idx
                  ? "w-6 bg-gold-500 shadow-sm"
                  : "w-2 bg-cream-300/80 hover:bg-gold-400/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
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

          {validItems.length > 1 && (
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
                src={activeItem.image_url}
                alt={activeItem.title || "Showcase Photo"}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="pt-4 text-center space-y-2">
              <h3 className="font-serif text-lg font-bold text-white">
                {activeItem.title || "Artistry Showcase"}
              </h3>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href={`/${locale}/gallery`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-500 text-brand-950 font-bold text-xs hover:bg-gold-400 transition-colors"
                >
                  <Images className="w-3.5 h-3.5" />
                  <span>Go to Full Gallery Page</span>
                </Link>
                <a
                  href={getWhatsAppUrl(
                    whatsappNumber,
                    `Hi ${businessName}, I am interested in this design from your showcase: "${activeItem.title || "Showcase Photo"}".`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("whatsapp_click", {
                      details: `Showcase Lightbox: ${activeItem.title || "Design"}`,
                      phoneNumber: whatsappNumber,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Enquire Design</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
