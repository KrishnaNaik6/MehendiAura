"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Container } from "@/components/ui/Container";
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

  const businessName = settings?.business_name || "MehendiAura";
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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-brand-900/95 backdrop-blur-md shadow-lg border-b border-gold-500/20 py-2.5 sm:py-3"
          : "bg-brand-900 text-cream-100 py-3 sm:py-4 border-b border-brand-800"
      }`}
    >
      <Container size="lg">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Business Logo / Title */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-gold-400 rounded-lg shrink min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-brand-950" />
            </div>
            <div className="flex flex-col min-w-0 truncate">
              <span className="font-serif text-xl sm:text-2xl tracking-wide text-gold-300 font-bold leading-none truncate">
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
                      ? "bg-gold-500/20 text-gold-300 border border-gold-400/40"
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
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
            <div className="hidden sm:inline-flex">
              <LanguageSwitcher variant="header" />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl text-gold-300 hover:text-white hover:bg-brand-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Drawer / Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] sm:top-[65px] bg-brand-950/98 backdrop-blur-xl border-b border-gold-500/30 shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-200 z-50">
          <div className="px-4 py-5 space-y-2.5 max-h-[calc(100vh-80px)] overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all min-h-[44px] flex items-center ${
                    isActive
                      ? "bg-gold-500/20 text-gold-300 border border-gold-400/30 font-semibold"
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
      )}
    </header>
  );
}
