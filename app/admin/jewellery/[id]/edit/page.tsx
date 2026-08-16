import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Gem } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Jewellery } from "@/types/database";
import { EditJewelleryForm } from "./EditJewelleryForm";

interface EditJewelleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJewelleryPage({ params }: EditJewelleryPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from("jewellery")
    .select("*, jewellery_images(*)")
    .eq("id", id)
    .single();

  if (error || !item) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <Link
        href="/admin/jewellery"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-gold-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Jewellery Inventory</span>
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-gold-300/30 shadow-soft space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
          <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
            <Gem className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-900">
              Edit Rental Jewellery Item
            </h1>
            <p className="text-xs text-brand-600">
              Editing listing: <span className="font-semibold text-gold-700">{item.name}</span>
            </p>
          </div>
        </div>

        <EditJewelleryForm item={item as Jewellery} />
      </div>
    </div>
  );
}
