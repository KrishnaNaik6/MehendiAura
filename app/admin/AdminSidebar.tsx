"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Activity,
  Sparkle,
  Gem,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Layers,
} from "lucide-react";
import { signOutAdmin } from "@/app/admin/actions";

interface AdminSidebarProps {
  customCategories: string[];
}

export function AdminSidebar({ customCategories }: AdminSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategoryParam = searchParams.get("category");

  const primaryNav = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Featured Showcase", href: "/admin/showcase", icon: Sparkles, badge: "Homepage" },
    { label: "Analytics & Traffic", href: "/admin/analytics", icon: Activity },
    { label: "Mehendi Services", href: "/admin/services", icon: Sparkle, isBaseServices: true },
    { label: "Rental Jewellery", href: "/admin/jewellery", icon: Gem },
  ];

  const secondaryNav = [
    { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    { label: "Business Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Admin Header Bar */}
      <div className="md:hidden bg-brand-950 text-cream-100 p-4 border-b border-gold-500/20 flex items-center justify-between sticky top-0 z-50">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-brand-950" />
          </div>
          <span className="font-serif text-lg text-gold-300 font-bold truncate">
            MHendi by Mamatha CMS
          </span>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="min-w-[44px] min-h-[44px] p-2 rounded-xl text-gold-300 hover:text-white hover:bg-brand-900 transition-colors flex items-center justify-center shrink-0"
          aria-label="Toggle Admin Navigation"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Drawer Navigation */}
      <aside
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-brand-950 text-cream-100 border-r border-gold-500/20 flex-shrink-0 flex flex-col justify-between z-40 min-h-screen`}
      >
        <div>
          {/* Admin Header Logo (Desktop) */}
          <div className="hidden md:flex p-6 border-b border-brand-800 items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-brand-950" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif text-base tracking-wide text-gold-300 font-bold leading-none truncate">
                  MHendi by Mamatha
                </span>
                <span className="text-[10px] text-cream-300 uppercase tracking-widest mt-0.5 truncate">
                  CMS Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {/* Primary Core Sections */}
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.isBaseServices
                  ? pathname === "/admin/services" && !activeCategoryParam
                  : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                    isActive
                      ? "bg-gold-500/20 text-gold-300 border border-gold-400/30 font-semibold"
                      : "text-cream-200 hover:bg-brand-900 hover:text-gold-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Dynamic Custom Service Categories Added By Admin */}
            {customCategories.length > 0 && (
              <div className="pt-3 pb-1">
                <div className="px-4 text-[10px] font-bold text-gold-400/80 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-gold-400" />
                  <span>Additional Services</span>
                </div>
                <div className="space-y-1">
                  {customCategories.map((catName) => {
                    const href = `/admin/services?category=${encodeURIComponent(catName)}`;
                    const isActive = pathname === "/admin/services" && activeCategoryParam === catName;

                    return (
                      <Link
                        key={catName}
                        href={href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[40px] pl-6 ${
                          isActive
                            ? "bg-gold-500/25 text-gold-300 border border-gold-400/40 font-bold"
                            : "text-cream-300 hover:bg-brand-900 hover:text-gold-300"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                        <span className="truncate">{catName}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Secondary Standard Sections */}
            <div className="pt-2 border-t border-brand-800/60">
              {secondaryNav.map((item) => {
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
            </div>
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
    </>
  );
}
