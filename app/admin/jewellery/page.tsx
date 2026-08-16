import React from "react";
import Link from "next/link";
import { Gem, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Jewellery } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { JewelleryTable } from "./JewelleryTable";

export default async function AdminJewelleryPage() {
  const supabase = await createClient();

  const { data: jewelleryData } = await supabase
    .from("jewellery")
    .select("*, jewellery_images(*)")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const jewelleryList: Jewellery[] = (jewelleryData as any[]) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-earth-900 via-earth-800 to-brand-950 text-cream-100 p-8 rounded-3xl border border-gold-500/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Gem className="w-3.5 h-3.5" />
            <span>Rental Jewellery Inventory</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">
            Rental Jewellery Catalog Management
          </h1>
          <p className="text-sm text-cream-200 mt-1">
            Manage rental rates, security deposits, availability status, and included items.
          </p>
        </div>

        <Link href="/admin/jewellery/new">
          <Button variant="gold" size="lg" leftIcon={<Plus className="w-5 h-5" />}>
            Add Rental Item
          </Button>
        </Link>
      </div>

      {/* Jewellery Table Component */}
      <JewelleryTable initialJewellery={jewelleryList} />
    </div>
  );
}
