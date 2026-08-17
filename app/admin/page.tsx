import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Gem,
  Image as ImageIcon,
  Settings,
  MessageSquareQuote,
  HelpCircle,
  ArrowRight,
  HardDrive,
  Database as DatabaseIcon,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchStorageStats } from "@/lib/supabase/helper";
import { fetchAnalyticsSummary } from "@/app/actions/analytics";
import { AdminAnalyticsWidget } from "@/components/admin/AdminAnalyticsWidget";

export default async function AdminDashboardOverview() {
  const supabase = await createClient();

  const [{ count: servicesCount }, { count: jewelleryCount }, { count: galleryCount }] = await Promise.all([
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("jewellery").select("*", { count: "exact", head: true }),
    supabase.from("gallery").select("*", { count: "exact", head: true }),
  ]);

  const storageStats = await fetchStorageStats();
  const analyticsData = await fetchAnalyticsSummary();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Admin Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-cream-100 p-6 sm:p-8 rounded-3xl border border-gold-500/30 shadow-md">
        <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
          Control Panel Overview
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
          Welcome to MHendi by Mamatha CMS
        </h1>
        <p className="text-xs sm:text-sm text-cream-200 mt-2 max-w-2xl">
          Manage your business information, mehendi service catalog, rental jewellery inventory, showcase gallery, customer reviews, and FAQs.
        </p>
      </div>

      {/* Live Visitor & Activity Analytics Widget */}
      <AdminAnalyticsWidget initialData={analyticsData} />

      {/* Admin Only Storage & Database Usage Widget */}
      <div className="bg-white p-6 rounded-3xl border border-gold-300/40 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-900 text-gold-300 flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-brand-900">
                  Supabase Storage &amp; System Health
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-brand-600">
                Live bucket storage consumption and database record metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-brand-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bucket: <code className="text-gold-700 font-mono">mehendiaura-images</code></span>
          </div>
        </div>

        {/* Progress Bar & Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-brand-900">
                Storage Used: <span className="text-gold-700 font-bold">{storageStats.usedStorageMb} MB</span> / {storageStats.totalStorageMb} MB
              </span>
              <span className="text-emerald-700 font-bold">
                {storageStats.freeStorageMb} MB Free Remaining
              </span>
            </div>

            {/* Custom Visual Meter Bar */}
            <div className="w-full h-3.5 bg-cream-200 rounded-full overflow-hidden p-0.5 border border-gold-300/40">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 via-gold-500 to-gold-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(2, storageStats.usagePercentage)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-brand-600">
              <span>{storageStats.usagePercentage}% of Supabase Free Tier Used</span>
              <span>{storageStats.totalUploadedFiles} Uploaded Photo Files</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 border border-gold-300/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider block">
                Database Records
              </span>
              <div className="text-2xl font-bold font-serif text-brand-900">
                {storageStats.dbRecordsCount}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium block">
                PostgreSQL Active Data
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-700 flex items-center justify-center border border-gold-400/40">
              <DatabaseIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Mehendi Services</span>
            <div className="text-3xl font-serif font-bold text-brand-900 mt-1">{servicesCount || 0}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-800 text-gold-300 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Rental Jewellery</span>
            <div className="text-3xl font-serif font-bold text-emerald-700 mt-1">{jewelleryCount || 0}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-earth-800 text-gold-300 flex items-center justify-center">
            <Gem className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Gallery Photos</span>
            <div className="text-3xl font-serif font-bold text-gold-700 mt-1">{galleryCount || 0}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold-600 text-brand-950 flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/services" className="group p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft hover:shadow-gold-glow transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowRight className="w-5 h-5 text-gold-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-serif font-bold text-lg text-brand-900 group-hover:text-gold-700 transition-colors">
            Manage Mehendi Services
          </h3>
          <p className="text-xs text-brand-600 mt-1">
            Add, edit, or remove bridal, engagement, and festival henna packages.
          </p>
        </Link>

        <Link href="/admin/jewellery" className="group p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft hover:shadow-gold-glow transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-earth-800 text-gold-300 flex items-center justify-center">
              <Gem className="w-5 h-5" />
            </div>
            <ArrowRight className="w-5 h-5 text-gold-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-serif font-bold text-lg text-brand-900 group-hover:text-gold-700 transition-colors">
            Manage Rental Jewellery
          </h3>
          <p className="text-xs text-brand-600 mt-1">
            Update Kundan, Temple, and Bridal sets, rates, deposits, and availability status.
          </p>
        </Link>

        <Link href="/admin/gallery" className="group p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft hover:shadow-gold-glow transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold-600 text-brand-950 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <ArrowRight className="w-5 h-5 text-gold-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-serif font-bold text-lg text-brand-900 group-hover:text-gold-700 transition-colors">
            Showcase Gallery CMS
          </h3>
          <p className="text-xs text-brand-600 mt-1">
            Upload device photos directly, reorder, and activate showcase gallery items.
          </p>
        </Link>

        <Link href="/admin/testimonials" className="group p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft hover:shadow-gold-glow transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-900 text-gold-300 flex items-center justify-center">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <ArrowRight className="w-5 h-5 text-gold-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-serif font-bold text-lg text-brand-900 group-hover:text-gold-700 transition-colors">
            Testimonials CMS
          </h3>
          <p className="text-xs text-brand-600 mt-1">
            Add real customer reviews, star ratings, and event tags for homepage display.
          </p>
        </Link>

        <Link href="/admin/faqs" className="group p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft hover:shadow-gold-glow transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-900 text-gold-300 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <ArrowRight className="w-5 h-5 text-gold-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-serif font-bold text-lg text-brand-900 group-hover:text-gold-700 transition-colors">
            FAQ CMS
          </h3>
          <p className="text-xs text-brand-600 mt-1">
            Manage question and answer accordions displayed on your homepage.
          </p>
        </Link>

        <Link href="/admin/settings" className="group p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft hover:shadow-gold-glow transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-900 text-gold-300 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <ArrowRight className="w-5 h-5 text-gold-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-serif font-bold text-lg text-brand-900 group-hover:text-gold-700 transition-colors">
            Business Settings
          </h3>
          <p className="text-xs text-brand-600 mt-1">
            Update phone numbers, WhatsApp, address, hero banner text, and social links.
          </p>
        </Link>
      </div>
    </div>
  );
}
