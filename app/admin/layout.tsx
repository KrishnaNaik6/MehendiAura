"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Sparkle,
  Gem,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { signOutAdmin } from "@/app/admin/actions";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Mehendi Services", href: "/admin/services", icon: Sparkle },
  { label: "Rental Jewellery", href: "/admin/jewellery", icon: Gem },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Business Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col md:flex-row font-sans text-brand-900 selection:bg-gold-500 selection:text-white">
      {/* Mobile Admin Header Bar */}
      <div className="md:hidden bg-brand-950 text-cream-100 p-4 border-b border-gold-500/20 flex items-center justify-between sticky top-0 z-50">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-brand-950" />
          </div>
          <span className="font-serif text-lg text-gold-300 font-bold">
            MehendiAura CMS
          </span>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="min-w-[44px] min-h-[44px] p-2 rounded-xl text-gold-300 hover:text-white hover:bg-brand-900 transition-colors flex items-center justify-center"
          aria-label="Toggle Admin Navigation"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Drawer Navigation */}
      <aside
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-brand-950 text-cream-100 border-r border-gold-500/20 flex-shrink-0 flex flex-col justify-between z-40`}
      >
        <div>
          {/* Admin Header Logo (Desktop) */}
          <div className="hidden md:flex p-6 border-b border-brand-800 items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-950" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-wide text-gold-300 font-bold leading-none">
                  MehendiAura
                </span>
                <span className="text-[10px] text-cream-300 uppercase tracking-widest mt-0.5">
                  CMS Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                    isActive
                      ? "bg-gold-500/20 text-gold-300 border border-gold-400/30 font-semibold"
                      : "text-cream-200 hover:bg-brand-900 hover:text-gold-300"
                  }`}
                >
                  <Icon className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="p-4 border-t border-brand-800 space-y-3">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-brand-900/60 border border-gold-500/20 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="truncate">
              <div className="font-semibold text-gold-300 truncate">
                Admin Operator
              </div>
              <div className="text-[10px] text-cream-400">Authenticated</div>
            </div>
          </div>

          <form action={signOutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold min-h-[44px] transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-cream-300 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg sm:text-xl text-brand-900">
              Control Panel
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-800 text-gold-300 hover:bg-brand-900 transition-colors min-h-[36px]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </Link>
        </header>

        {/* Main Content Container */}
        <main className="p-4 sm:p-8 flex-1 bg-cream-100/60 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
