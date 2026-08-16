import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Sparkle,
  Gem,
  Image as ImageIcon,
  Settings,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { fetchBusinessSettings } from "@/lib/supabase/helper";

export default async function AdminDashboardPage() {
  const settings = await fetchBusinessSettings();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-cream-100 p-8 rounded-3xl border border-gold-500/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure Admin Session Active</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Welcome to {settings.business_name} CMS
          </h1>
          <p className="text-sm text-cream-200 max-w-xl">
            Manage your Mehendi service offerings, rental jewellery inventory, photo gallery, testimonials, and contact details in real-time.
          </p>
        </div>

        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-brand-950 font-bold text-sm shadow-md transition-all shrink-0"
        >
          <Settings className="w-4 h-4" />
          <span>Business Settings</span>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hoverEffect className="border-gold-300/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-gold-700 uppercase tracking-wider">
              Mehendi Services
            </span>
            <Sparkle className="w-5 h-5 text-brand-800" />
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold font-serif text-brand-900">CMS Ready</div>
            <p className="text-xs text-brand-600 mt-1">Manage categories, prices &amp; images</p>
          </CardBody>
        </Card>

        <Card hoverEffect className="border-gold-300/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-gold-700 uppercase tracking-wider">
              Rental Jewellery
            </span>
            <Gem className="w-5 h-5 text-brand-800" />
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold font-serif text-brand-900">CMS Ready</div>
            <p className="text-xs text-brand-600 mt-1">Manage rental rates &amp; deposits</p>
          </CardBody>
        </Card>

        <Card hoverEffect className="border-gold-300/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-gold-700 uppercase tracking-wider">
              Showcase Gallery
            </span>
            <ImageIcon className="w-5 h-5 text-brand-800" />
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold font-serif text-brand-900">CMS Ready</div>
            <p className="text-xs text-brand-600 mt-1">Upload &amp; organize event photos</p>
          </CardBody>
        </Card>

        <Card hoverEffect className="border-gold-300/40 bg-brand-900 text-cream-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-gold-300 uppercase tracking-wider">
              Database Sync
            </span>
            <Sparkles className="w-5 h-5 text-gold-400" />
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold font-serif text-gold-300">Supabase</div>
            <p className="text-xs text-cream-300 mt-1">RLS Policies &amp; Storage Active</p>
          </CardBody>
        </Card>
      </div>

      {/* Quick CMS Action Shortcuts */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold-300/30 shadow-soft space-y-6">
        <h2 className="font-serif text-2xl font-bold text-brand-900 border-b border-cream-200 pb-4">
          CMS Quick Shortcuts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/services"
            className="p-6 rounded-2xl bg-cream-50 border border-gold-300/30 hover:border-gold-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
                <Sparkle className="w-5 h-5" />
              </div>
              <PlusCircle className="w-5 h-5 text-gold-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-serif font-bold text-lg text-brand-900 mb-1">
              Manage Mehendi Services
            </h3>
            <p className="text-xs text-brand-700 leading-relaxed mb-4">
              Add new service packages, update pricing info, duration, and upload high-res images.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-700 group-hover:text-brand-900">
              <span>Open Services Manager</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/admin/jewellery"
            className="p-6 rounded-2xl bg-cream-50 border border-gold-300/30 hover:border-gold-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
                <Gem className="w-5 h-5" />
              </div>
              <PlusCircle className="w-5 h-5 text-gold-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-serif font-bold text-lg text-brand-900 mb-1">
              Manage Rental Jewellery
            </h3>
            <p className="text-xs text-brand-700 leading-relaxed mb-4">
              Create rental jewellery listings, set rental rates, security deposits, and set availability.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-700 group-hover:text-brand-900">
              <span>Open Jewellery Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="p-6 rounded-2xl bg-cream-50 border border-gold-300/30 hover:border-gold-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <ArrowRight className="w-5 h-5 text-gold-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-serif font-bold text-lg text-brand-900 mb-1">
              Update Business Settings
            </h3>
            <p className="text-xs text-brand-700 leading-relaxed mb-4">
              Update phone number, WhatsApp contact, studio address, business hours, and social media handles.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-700 group-hover:text-brand-900">
              <span>Edit Business Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
