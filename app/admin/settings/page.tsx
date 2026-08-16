import React from "react";
import { Settings, ShieldCheck } from "lucide-react";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { SettingsForm } from "@/app/admin/settings/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await fetchBusinessSettings();

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-cream-100 p-8 rounded-3xl border border-gold-500/30 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time Business Settings CMS</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">
              Business &amp; Communication Settings
            </h1>
          </div>
        </div>
        <p className="text-sm text-cream-200 mt-2 max-w-2xl">
          Configure your business name, contact phone, WhatsApp number, studio address, social media links, hero text, and brand story without modifying any code.
        </p>
      </div>

      {/* Interactive Settings Form */}
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
