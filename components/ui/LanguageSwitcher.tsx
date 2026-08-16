"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { Locale, LOCALE_LABELS } from "@/lib/i18n/config";

interface LanguageSwitcherProps {
  variant?: "header" | "mobile" | "footer";
}

export function LanguageSwitcher({ variant = "header" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  if (variant === "mobile") {
    return (
      <div className="p-4 rounded-2xl bg-cream-200/60 border border-gold-300/40 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-900 uppercase tracking-wider">
          <Globe className="w-4 h-4 text-gold-600" />
          <span>Language / ಭಾಷೆ</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(["en", "kn"] as Locale[]).map((loc) => (
            <button
              key={loc}
              onClick={() => setLocale(loc)}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                locale === loc
                  ? "bg-brand-900 text-gold-300 shadow-md font-bold"
                  : "bg-white text-brand-800 border border-gold-300/30 hover:bg-gold-500/10"
              }`}
            >
              <span>{LOCALE_LABELS[loc].flag}</span>
              <span>{LOCALE_LABELS[loc].nativeName}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center bg-cream-200/80 border border-gold-300/40 p-1 rounded-full text-xs font-semibold">
      {(["en", "kn"] as Locale[]).map((loc, idx) => (
        <React.Fragment key={loc}>
          <button
            onClick={() => setLocale(loc)}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
              locale === loc
                ? "bg-brand-900 text-gold-300 font-bold shadow-xs"
                : "text-brand-800 hover:text-gold-700"
            }`}
            title={`Switch to ${LOCALE_LABELS[loc].name}`}
          >
            <span className="text-xs">{LOCALE_LABELS[loc].nativeName}</span>
          </button>
          {idx === 0 && <span className="text-gold-400 font-normal px-0.5">|</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
