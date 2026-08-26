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
  const pathname = usePathname();
  const { locale, dictionary } = useLanguage();

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
      {/* Android 5-Item Primary Bottom Navigation Bar */}
      <nav className="grid grid-cols-5 items-center justify-between max-w-md mx-auto px-1 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href || pathname === `/${locale}`
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all min-h-[46px] min-w-[44px] active:scale-95 ${
                isActive
                  ? "text-gold-300 font-bold bg-gold-500/20 border border-gold-400/40 shadow-xs"
                  : "text-cream-300 hover:text-gold-300 hover:bg-brand-900/50 font-normal"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? "scale-110 text-gold-400 stroke-[2.5]" : "text-cream-300 stroke-[1.75]"
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
