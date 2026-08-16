import React from "react";
import Link from "next/link";
import { Sparkles, Gem, Image as ImageIcon, Settings, MessageSquareQuote, HelpCircle, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardOverview() {
  const supabase = await createClient();

  const [{ count: servicesCount }, { count: jewelleryCount }, { count: galleryCount }] = await Promise.all([
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("jewellery").select("*", { count: "exact", head: true }),
    supabase.from("gallery").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-cream-100 p-8 rounded-3xl border border-gold-500/30 shadow-md">
        <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
          Control Panel Overview
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
          Welcome to MehendiAura CMS
        </h1>
        <p className="text-sm text-cream-200 mt-2 max-w-2xl">
          Manage your business information, mehendi service catalog, rental jewellery inventory, showcase gallery, customer reviews, and FAQs.
        </p>
      </div>

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
