import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "./AdminSidebar";

const MEHENDI_PRESETS = [
  "Bridal",
  "Engagement",
  "Arabic",
  "Traditional",
  "Minimal",
  "Party",
  "Custom",
  "Mehendi",
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Query distinct service categories to populate dynamic navbar links
  const { data: categoriesData } = await supabase.from("services").select("category");

  const allCategories = Array.from(
    new Set((categoriesData || []).map((c) => c.category).filter(Boolean))
  );

  // Extract additional non-mehendi service categories created by Admin
  const customCategories = allCategories.filter(
    (cat) => !MEHENDI_PRESETS.includes(cat)
  );

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col md:flex-row font-sans text-brand-900 selection:bg-gold-500 selection:text-white">
      {/* Dynamic Admin Sidebar Navigation */}
      <AdminSidebar customCategories={customCategories} />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Control Bar */}
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

        {/* Page Children Content */}
        <main className="p-4 sm:p-8 flex-1 bg-cream-100/60 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
