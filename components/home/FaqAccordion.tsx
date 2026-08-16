"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ } from "@/types/database";
import { Locale } from "@/lib/i18n/config";
import { getLocalizedField } from "@/lib/i18n/getLocalizedField";

interface FaqAccordionProps {
  faqs: FAQ[];
  locale?: Locale;
}

export function FaqAccordion({ faqs, locale = "en" }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        const question = getLocalizedField(faq, "question", locale);
        const answer = getLocalizedField(faq, "answer", locale);

        return (
          <div
            key={faq.id || idx}
            className="rounded-2xl bg-white border border-gold-300/30 overflow-hidden shadow-soft transition-all"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-lg text-brand-900 hover:text-gold-700 transition-colors focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gold-600 shrink-0" />
                <span>{question}</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gold-600 shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 text-sm text-brand-700 leading-relaxed border-t border-cream-200 pt-3 animate-in fade-in duration-200">
                {answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
