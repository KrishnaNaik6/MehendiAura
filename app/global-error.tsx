"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FDFBF7] text-[#1B3B2B] flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md space-y-6 bg-white p-8 rounded-3xl border border-[#C5A059]/30 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center mx-auto text-2xl font-serif font-bold">
            MA
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-[#1B3B2B]">
              Application Error
            </h1>
            <p className="text-xs text-[#4A3525] leading-relaxed">
              A critical error occurred while rendering the page layout.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="w-full py-3 px-6 rounded-xl bg-[#C5A059] hover:bg-[#b08d47] text-[#1B3B2B] font-bold text-sm shadow-md transition-colors"
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
