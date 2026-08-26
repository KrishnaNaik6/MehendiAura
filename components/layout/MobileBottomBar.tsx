"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Gem, Images, PhoneCall } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { BusinessSettings } from "@/types/database";

interface MobileBottomBarProps {
  settings?: BusinessSettings;
}

export function MobileBottomBar({ settings }: MobileBottomBarProps) {
  const rawPathname = usePathname();
  const { locale, dictionary } = useLanguage();

  const pathname = (rawPathname || "/").toLowerCase().replace(/\/$/, "");

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
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0F241A] border-t-2 border-gold-500/50 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] pb-[env(safe-area-inset-bottom,0px)]">
      {/* Android 5-Item Primary Bottom Navigation Bar */}
      <nav className="grid grid-cols-5 items-center justify-between max-w-md mx-auto px-1 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = checkIsActive(item.key);

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition-all min-h-[48px] min-w-[44px] active:scale-95 ${
                isActive
                  ? "bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-brand-950 font-bold shadow-lg scale-105 border border-gold-300"
                  : "text-cream-200 hover:text-gold-300 hover:bg-brand-900/60 font-medium"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? "text-brand-950 stroke-[2.5] scale-110" : "text-cream-200 stroke-[1.8]"
                }`}
              />
              <span
                className={`text-[10px] tracking-tight truncate leading-none ${
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
  );
}
