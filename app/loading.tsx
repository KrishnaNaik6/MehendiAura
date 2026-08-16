import React from "react";

export default function Loading() {
  return (
    <div className="py-20 sm:py-32 min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gold-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-gold-500 border-t-transparent animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <span className="font-serif font-bold text-xl text-brand-900 block">
          Loading MehendiAura...
        </span>
        <span className="text-xs text-brand-600 uppercase tracking-widest block font-semibold">
          Bridal Artistry &amp; Jewellery Catalog
        </span>
      </div>
    </div>
  );
}
