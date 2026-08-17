"use client";

import React from "react";
import { Phone, MessageSquare } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { getWhatsAppUrl, buildGeneralWhatsAppMsg } from "@/lib/whatsapp";
import { getCallUrl } from "@/lib/call";
import { BusinessSettings } from "@/types/database";

interface MobileBottomBarProps {
  settings?: BusinessSettings;
}

export function MobileBottomBar({ settings }: MobileBottomBarProps) {
  const { locale } = useLanguage();

  const phone = settings?.phone || process.env.NEXT_PUBLIC_DEFAULT_PHONE || "+919876543210";
  const whatsappNumber = settings?.whatsapp || process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "919876543210";
  const businessName = settings?.business_name || "MHendi by Mamatha";

  const whatsappUrl = getWhatsAppUrl(whatsappNumber, buildGeneralWhatsAppMsg(businessName, locale));
  const callUrl = getCallUrl(phone);

  const callLabel = locale === "kn" ? "ಕರೆ ಮಾಡಿ" : "Call Now";

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-950/95 backdrop-blur-md border-t border-gold-500/30 p-2.5 sm:p-3 shadow-2xl pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))]">
      <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
        <a
          href={callUrl}
          className="flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl bg-brand-900 border border-gold-400/40 text-gold-300 font-semibold text-xs sm:text-sm min-h-[48px] shadow-md active:scale-95 transition-all text-center"
        >
          <Phone className="w-4 h-4 text-gold-400 shrink-0" />
          <span className="truncate">{callLabel}</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm min-h-[48px] shadow-md active:scale-95 transition-all text-center"
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span className="truncate">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
