import React from "react";
import { Settings, ShieldCheck, HardDrive, Database as DatabaseIcon } from "lucide-react";
import { fetchBusinessSettings, fetchStorageStats } from "@/lib/supabase/helper";
import { SettingsForm } from "@/app/admin/settings/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await fetchBusinessSettings();
  const storageStats = await fetchStorageStats();

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-cream-100 p-6 sm:p-8 rounded-3xl border border-gold-500/30 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time Business Settings CMS</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Business &amp; Communication Settings
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-cream-200 mt-2 max-w-2xl">
          Configure your business name, contact phone, WhatsApp number, studio address, default language, social media links, hero text, and brand story without modifying any code.
        </p>
      </div>

      {/* Admin Storage & Database Usage Widget */}
      <div className="bg-white p-5 rounded-2xl border border-gold-300/40 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center shrink-0">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-base font-bold text-brand-900">
                Supabase Storage Usage (Admin Only)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                {storageStats.usedStorageMb} MB / 1,000 MB Used
              </span>
            </div>
            <p className="text-xs text-brand-600">
              {storageStats.freeStorageMb} MB Free ({storageStats.totalUploadedFiles} Image Files, {storageStats.dbRecordsCount} Database Records)
            </p>
          </div>
        </div>

        <div className="w-full sm:w-48 bg-cream-100 rounded-full h-3 overflow-hidden border border-gold-300/40">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all"
            style={{ width: `${Math.max(3, storageStats.usagePercentage)}%` }}
          />
        </div>
      </div>

      {/* Interactive Settings Form */}
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
