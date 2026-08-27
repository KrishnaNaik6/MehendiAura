"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Gem, Images, PhoneCall, MessageSquare, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { BusinessSettings } from "@/types/database";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { getCallUrl } from "@/lib/call";
import { trackEvent } from "@/lib/analytics/track";

interface MobileBottomBarProps {
  settings?: BusinessSettings;
}

export function MobileBottomBar({ settings }: MobileBottomBarProps) {
  const rawPathname = usePathname();
  const { locale, dictionary } = useLanguage();

  const pathname = (rawPathname || "/").toLowerCase().replace(/\/$/, "");

  const defaultWhatsapp = process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "919876543210";
  const defaultPhone = process.env.NEXT_PUBLIC_DEFAULT_PHONE || "+919876543210";
  const whatsappNumber = settings?.whatsapp || defaultWhatsapp;
  const phoneNumber = settings?.phone || defaultPhone;

  const whatsappUrl = getWhatsAppUrl(
    whatsappNumber,
    `Hi ${settings?.business_name || "Mamatha"}, I am interested in your Mehendi services and Rental Jewellery. Could you please share availability?`
  );
  const callUrl = getCallUrl(phoneNumber);

  const handleWhatsAppClick = () => {
    trackEvent("whatsapp_click", {
      pagePath: typeof window !== "undefined" ? window.location.pathname : "/",
      details: "Mobile Bottom Quick WhatsApp Button",
      phoneNumber: whatsappNumber,
    });
  };

  const handleCallClick = () => {
    trackEvent("call_click", {
      pagePath: typeof window !== "undefined" ? window.location.pathname : "/",
      details: "Mobile Bottom Quick Call Button",
      phoneNumber,
    });
  };

  const navItems = [
    {
      key: "home",
      label: dictionary.nav.home,
      href: `/${locale}`,
      icon: Home,
    },
    {
      key: "services",
      label: dictionary.nav.services,
      href: `/${locale}/services`,
      icon: Sparkles,
    },
    {
      key: "jewellery",
      label: dictionary.nav.jewellery,
      href: `/${locale}/jewellery`,
      icon: Gem,
    },
    {
      key: "gallery",
      label: dictionary.nav.gallery,
      href: `/${locale}/gallery`,
      icon: Images,
    },
    {
      key: "contact",
      label: dictionary.nav.contact,
      href: `/${locale}/contact`,
      icon: PhoneCall,
    },
  ];

  const checkIsActive = (key: string) => {
    if (key === "home") {
      return (
        pathname === "" ||
        pathname === "/" ||
        pathname === "/en" ||
        pathname === "/kn" ||
        pathname === `/${locale}`
      );
    }
    if (key === "services") {
      return pathname.includes("/services");
    }
    if (key === "jewellery") {
      return pathname.includes("/jewellery");
    }
    if (key === "gallery") {
      return pathname.includes("/gallery");
    }
    if (key === "contact") {
      return pathname.includes("/contact");
    }
    return false;
  };

  return (
    <>
      {/* Fixed Mobile Floating Quick CTA Actions (Direct Call & WhatsApp) */}
      <div className="lg:hidden fixed bottom-[72px] right-3.5 z-40 flex flex-col gap-2.5 items-end pointer-events-auto">
        {/* Floating Call Button */}
        <a
          href={callUrl}
          onClick={handleCallClick}
          className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-brand-950 shadow-xl border border-gold-300 flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Call Mamatha Now"
          title="Call Mamatha Now"
        >
          <Phone className="w-5 h-5 text-brand-950 fill-brand-950/20" />
        </a>

        {/* Floating WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="w-11 h-11 rounded-full bg-[#25D366] text-white shadow-xl border border-white/20 flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Enquire on WhatsApp"
          title="Enquire on WhatsApp"
        >
          <MessageSquare className="w-5 h-5 text-white fill-white/20" />
        </a>
      </div>

      {/* Android 5-Item Primary Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full z-50 bg-[#0F241A] border-t border-gold-500/40 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] pt-1.5 pb-2 pb-[env(safe-area-inset-bottom,0px)]">
        <nav className="grid grid-cols-5 items-center justify-between w-full max-w-md mx-auto px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = checkIsActive(item.key);

            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`w-full flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 rounded-xl transition-all min-h-[46px] active:scale-95 overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-brand-950 font-bold shadow-md scale-102 border border-gold-300"
                    : "text-cream-200 hover:text-gold-300 hover:bg-brand-900/60 font-medium"
                }`}
              >
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-transform ${
                    isActive ? "text-brand-950 stroke-[2.5]" : "text-cream-200 stroke-[1.8]"
                  }`}
                />
                <span
                  className={`text-[9px] sm:text-[10px] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-center leading-none ${
                    isActive ? "text-brand-950 font-bold" : "text-cream-200 font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
