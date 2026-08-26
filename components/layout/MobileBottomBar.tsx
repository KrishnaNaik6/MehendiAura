"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Gem, Images, PhoneCall, MessageSquare, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { getWhatsAppUrl, buildGeneralWhatsAppMsg } from "@/lib/whatsapp";
import { getCallUrl } from "@/lib/call";
import { BusinessSettings } from "@/types/database";

interface MobileBottomBarProps {
  settings?: BusinessSettings;
}

export function MobileBottomBar({ settings }: MobileBottomBarProps) {
  const pathname = usePathname();
  const { locale, dictionary } = useLanguage();

  const phone = settings?.phone || process.env.NEXT_PUBLIC_DEFAULT_PHONE || "+919876543210";
  const whatsappNumber = settings?.whatsapp || process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "919876543210";
  const businessName = settings?.business_name || "MHendi by Mamatha";

  const whatsappUrl = getWhatsAppUrl(whatsappNumber, buildGeneralWhatsAppMsg(businessName, locale));
  const callUrl = getCallUrl(phone);

  const navItems = [
    {
      label: dictionary.nav.home,
      href: `/${locale}`,
      icon: Home,
      exact: true,
    },
    {
      label: dictionary.nav.services,
      href: `/${locale}/services`,
      icon: Sparkles,
      exact: false,
    },
    {
      label: dictionary.nav.jewellery,
      href: `/${locale}/jewellery`,
      icon: Gem,
      exact: false,
    },
    {
      label: dictionary.nav.gallery,
      href: `/${locale}/gallery`,
      icon: Images,
      exact: false,
    },
    {
      label: dictionary.nav.contact,
      href: `/${locale}/contact`,
      icon: PhoneCall,
      exact: false,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-950/98 backdrop-blur-xl border-t border-gold-500/30 shadow-2xl pb-[env(safe-area-inset-bottom,0px)]">
      {/* Quick Action Floating Buttons (Call & WhatsApp) */}
      <div className="px-3 pt-2 pb-1 flex items-center justify-between gap-2 max-w-md mx-auto border-b border-brand-900/80">
        <a
          href={callUrl}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-brand-900 border border-gold-400/30 text-gold-300 font-semibold text-xs min-h-[38px] active:scale-95 transition-all text-center shadow-xs"
        >
          <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span className="truncate">{dictionary.common.callNow}</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs min-h-[38px] active:scale-95 transition-all text-center shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{dictionary.common.whatsapp}</span>
        </a>
      </div>

      {/* Android 5-Item Bottom Navigation Bar */}
      <nav className="grid grid-cols-5 items-center justify-between max-w-md mx-auto px-1 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all min-h-[46px] active:scale-95 ${
                isActive
                  ? "text-gold-300 font-bold bg-gold-500/15 border border-gold-400/30 shadow-xs"
                  : "text-cream-300 hover:text-gold-300 hover:bg-brand-900/50"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? "scale-110 text-gold-400" : "text-cream-300"
                }`}
              />
              <span className="text-[10px] tracking-tight truncate leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
