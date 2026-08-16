"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Container } from "@/components/ui/Container";
import { BusinessSettings } from "@/types/database";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Mehendi Services", href: "/services" },
  { label: "Rental Jewellery", href: "/jewellery" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface HeaderProps {
  settings?: BusinessSettings;
}

export function Header({ settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const businessName = settings?.business_name || "MehendiAura";
  const whatsappNumber = settings?.whatsapp || process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "919876543210";

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
          ? "bg-brand-900/95 backdrop-blur-md shadow-lg border-b border-gold-500/20 py-3"
          : "bg-brand-900 text-cream-100 py-4 border-b border-brand-800"
      }`}
    >
      <Container size="lg">
        <div className="flex items-center justify-between">
          {/* Business Logo / Title */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-gold-400 rounded-lg"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-brand-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-wide text-gold-300 font-bold leading-none">
                {businessName}
              </span>
              <span className="text-[10px] text-cream-300 tracking-widest uppercase font-sans mt-0.5">
                Artistry &amp; Rental Jewellery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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

          {/* Desktop Primary Action CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <WhatsAppButton phoneNumber={whatsappNumber} size="sm" label="Enquire Now" />
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-gold-300 hover:text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-colors"
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
      </Container>

      {/* Mobile Navigation Drawer / Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-brand-950/98 backdrop-blur-xl border-b border-gold-500/30 shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-200 z-50">
          <div className="px-4 py-6 space-y-3 max-h-[calc(100vh-80px)] overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
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
            <div className="pt-4 border-t border-brand-800/80 space-y-3">
              <WhatsAppButton phoneNumber={whatsappNumber} fullWidth size="lg" label="Enquire on WhatsApp" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
