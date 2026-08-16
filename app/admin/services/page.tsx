import React from "react";
import Link from "next/link";
import { Sparkle, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Service } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { ServicesTable } from "./ServicesTable";

interface AdminServicesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function AdminServicesPage({ searchParams }: AdminServicesPageProps) {
  const { category } = await searchParams;
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("*, service_images(*)")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const serviceList: Service[] = (services as any[]) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-cream-100 p-6 sm:p-8 rounded-3xl border border-gold-500/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkle className="w-3.5 h-3.5" />
            <span>Service Catalog CMS</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {category ? `Managing Category: ${category}` : "Services & Packages Management"}
          </h1>
          <p className="text-xs sm:text-sm text-cream-200 mt-1">
            {category
              ? `Viewing and managing all service offerings under category "${category}".`
              : "Add, edit, reorder, feature, or toggle Mehendi packages and any custom service categories offered to your clients."}
          </p>
        </div>

        <Link href="/admin/services/new" className="shrink-0">
          <Button variant="gold" size="lg" leftIcon={<Plus className="w-5 h-5" />}>
            Add New Service
          </Button>
        </Link>
      </div>

      {/* Services Table Component */}
      <ServicesTable initialServices={serviceList} selectedCategoryParam={category} />
    </div>
  );
}
