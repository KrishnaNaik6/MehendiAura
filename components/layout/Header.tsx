"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/context";
import { buildGeneralWhatsAppMsg } from "@/lib/whatsapp";
import { BusinessSettings } from "@/types/database";

interface HeaderProps {
  settings?: BusinessSettings;
}

export function Header({ settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { locale, dictionary } = useLanguage();

  const businessName = settings?.business_name || "MHendi by Mamatha";
  const whatsappNumber = settings?.whatsapp || process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "919876543210";
  const whatsappMsg = buildGeneralWhatsAppMsg(businessName, locale);

  const navItems = [
    { label: dictionary.nav.home, href: `/${locale}` },
    { label: dictionary.nav.services, href: `/${locale}/services` },
    { label: dictionary.nav.jewellery, href: `/${locale}/jewellery` },
    { label: dictionary.nav.gallery, href: `/${locale}/gallery` },
    { label: dictionary.nav.about, href: `/${locale}/about` },
    { label: dictionary.nav.contact, href: `/${locale}/contact` },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile navigation menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="sticky top-0 sm:top-2.5 z-50 w-full px-2 sm:px-6 lg:px-8 max-w-7xl mx-auto py-1.5 sm:py-0 transition-all duration-300">
      <header
        className={`w-full rounded-2xl transition-all duration-300 border shadow-2xl backdrop-blur-xl ${
          isScrolled || isMobileMenuOpen
            ? "bg-brand-950/95 border-gold-400/50 shadow-[0_8px_30px_rgb(197,160,89,0.25)] py-2 sm:py-2.5 px-3 sm:px-6"
            : "bg-brand-950/90 border-gold-500/30 py-2.5 sm:py-3.5 px-3.5 sm:px-6"
        }`}
      >
        <div className="flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Business Logo / Title */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-gold-400 rounded-lg shrink min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-brand-950" />
            </div>
            <div className="flex flex-col min-w-0 truncate">
              <span className="font-serif text-base sm:text-2xl tracking-wide text-gold-300 font-bold leading-none truncate gold-text-glow">
                {businessName}
              </span>
              <span className="text-[9px] sm:text-[10px] text-cream-300 tracking-widest uppercase font-sans mt-0.5 truncate">
                {dictionary.common.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== `/${locale}` && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gold-500/25 text-gold-300 border border-gold-400/50 shadow-xs font-semibold"
                      : "text-cream-200 hover:text-gold-300 hover:bg-brand-800/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions (Language Switcher + WhatsApp CTA) */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher variant="header" />
            <WhatsAppButton
              phoneNumber={whatsappNumber}
              message={whatsappMsg}
              size="sm"
              label={dictionary.common.whatsapp}
            />
          </div>

          {/* Mobile Actions: Language Switcher & Hamburger Button */}
          <div className="flex items-center gap-1 sm:gap-2 lg:hidden shrink-0">
            <LanguageSwitcher variant="header" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="min-w-[40px] min-h-[40px] p-2 rounded-xl text-gold-300 hover:text-white hover:bg-brand-900 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all flex items-center justify-center border border-gold-500/20 bg-brand-900/50"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Backdrop & Floating Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Dimmed backdrop blur overlay covering page behind drawer */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-brand-950/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Floating Navigation Drawer */}
          <div className="lg:hidden fixed inset-x-2 sm:inset-x-6 top-[62px] sm:top-[68px] z-50 bg-brand-950/98 backdrop-blur-2xl border border-gold-500/40 rounded-2xl shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="px-4 py-5 space-y-2.5 max-h-[calc(100vh-80px)] overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all min-h-[44px] flex items-center ${
                      isActive
                        ? "bg-gold-500/20 text-gold-300 border border-gold-400/40 font-semibold"
                        : "text-cream-100 hover:bg-brand-900 hover:text-gold-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile Actions in Drawer */}
              <div className="pt-4 border-t border-brand-800/80 space-y-4">
                <LanguageSwitcher variant="mobile" />
                <WhatsAppButton
                  phoneNumber={whatsappNumber}
                  message={whatsappMsg}
                  fullWidth
                  size="lg"
                  label={dictionary.common.enquireWhatsapp}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
