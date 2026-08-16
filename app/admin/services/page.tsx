import React from "react";
import Link from "next/link";
import { Sparkle, Plus, Star, Edit, Trash2, Eye, EyeOff, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Service } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { ServicesTable } from "./ServicesTable";

export default async function AdminServicesPage() {
  const supabase = await createClient();

  const { data: services, error } = await supabase
    .from("services")
    .select("*, service_images(*)")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const serviceList: Service[] = (services as any[]) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-cream-100 p-8 rounded-3xl border border-gold-500/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkle className="w-3.5 h-3.5" />
            <span>Service Catalog CMS</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">
            Mehendi Services Management
          </h1>
          <p className="text-sm text-cream-200 mt-1">
            Add, edit, reorder, feature, or toggle Mehendi services offered to your customers.
          </p>
        </div>

        <Link href="/admin/services/new">
          <Button variant="gold" size="lg" leftIcon={<Plus className="w-5 h-5" />}>
            Add New Service
          </Button>
        </Link>
      </div>

      {/* Services Table Component */}
      <ServicesTable initialServices={serviceList} />
    </div>
  );
}
