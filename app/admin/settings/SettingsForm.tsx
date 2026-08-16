"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Building,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { BusinessSettings } from "@/types/database";
import { updateBusinessSettings } from "@/app/admin/settings/actions";

interface SettingsFormProps {
  initialSettings: BusinessSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateBusinessSettings(formData);
      if (res?.error) {
        toast.error("Save Failed", { description: res.error });
      } else {
        toast.success("Settings Updated", {
          description: "Your business configuration has been saved successfully.",
        });
        router.refresh();
      }
    } catch {
      toast.error("Save Error", {
        description: "An unexpected error occurred while saving settings.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Basic Business Identity */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold-300/30 shadow-soft space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
          <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-brand-900">
              Business Identity &amp; Contact Info
            </h2>
            <p className="text-xs text-brand-600">
              Primary brand name, phone, WhatsApp number, and address displayed across the website.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Business Name
            </label>
            <input
              type="text"
              name="business_name"
              required
              defaultValue={initialSettings.business_name}
              placeholder="MehendiAura"
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Phone Number (For Call Button)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="phone"
                required
                defaultValue={initialSettings.phone}
                placeholder="+919876543210"
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              WhatsApp Number (With Country Code)
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="whatsapp"
                required
                defaultValue={initialSettings.whatsapp}
                placeholder="919876543210"
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                defaultValue={initialSettings.email || ""}
                placeholder="info@mehendiaura.com"
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Studio &amp; Store Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-brand-600 absolute left-3.5 top-3" />
              <input
                type="text"
                name="address"
                required
                defaultValue={initialSettings.address}
                placeholder="Studio #12, Wedding Boulevard, MG Road, City Center"
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Google Maps URL
            </label>
            <input
              type="url"
              name="google_maps_url"
              defaultValue={initialSettings.google_maps_url || ""}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Business Hours
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="business_hours"
                required
                defaultValue={initialSettings.business_hours}
                placeholder="Mon - Sun: 9:00 AM - 9:00 PM"
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Social Media Links */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold-300/30 shadow-soft space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
          <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
            <Instagram className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-brand-900">
              Social Media Connections
            </h2>
            <p className="text-xs text-brand-600">
              Direct social media handles displayed on the website and contact page.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Instagram Profile URL
            </label>
            <div className="relative">
              <Instagram className="w-4 h-4 text-pink-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="instagram_url"
                defaultValue={initialSettings.instagram_url || ""}
                placeholder="https://instagram.com/mehendiaura"
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Facebook Page URL
            </label>
            <div className="relative">
              <Facebook className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="facebook_url"
                defaultValue={initialSettings.facebook_url || ""}
                placeholder="https://facebook.com/mehendiaura"
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              YouTube Channel URL
            </label>
            <div className="relative">
              <Youtube className="w-4 h-4 text-red-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="youtube_url"
                defaultValue={initialSettings.youtube_url || ""}
                placeholder="https://youtube.com/@mehendiaura"
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hero & About Story Content */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold-300/30 shadow-soft space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
          <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-brand-900">
              Hero Section &amp; Brand Story
            </h2>
            <p className="text-xs text-brand-600">
              Custom headline text and brand story for the landing hero &amp; about page.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Hero Title Headline
            </label>
            <input
              type="text"
              name="hero_title"
              required
              defaultValue={initialSettings.hero_title}
              placeholder="Exquisite Mehendi Artistry & Premium Rental Jewellery"
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-serif font-bold text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              Hero Subtitle / Description
            </label>
            <textarea
              name="hero_description"
              required
              rows={3}
              defaultValue={initialSettings.hero_description}
              placeholder="Crafting unforgettable bridal mehendi designs..."
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-900 uppercase tracking-wider mb-2">
              About Artist &amp; Business Narrative
            </label>
            <textarea
              name="about_content"
              required
              rows={5}
              defaultValue={initialSettings.about_content}
              placeholder="MehendiAura is a premier bridal studio..."
              className="w-full px-4 py-3 bg-cream-50 border border-gold-300/40 rounded-xl text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>
      </div>

      {/* Form Submission Sticky Bar */}
      <div className="sticky bottom-6 bg-brand-900 text-cream-100 p-4 rounded-2xl border border-gold-500/30 shadow-2xl flex items-center justify-between gap-4">
        <p className="text-xs text-cream-300 hidden sm:block">
          Changes will instantly update your live website header, contact info, and footer.
        </p>
        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={isLoading}
          leftIcon={<Save className="w-5 h-5" />}
          className="ml-auto min-w-[200px]"
        >
          Save Settings
        </Button>
      </div>
    </form>
  );
}
