import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Save, Sparkle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Service } from "@/types/database";
import { EditServiceForm } from "./EditServiceForm";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: service, error } = await supabase
    .from("services")
    .select("*, service_images(*)")
    .eq("id", id)
    .single();

  if (error || !service) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-gold-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Services List</span>
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-gold-300/30 shadow-soft space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
          <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
            <Sparkle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-900">
              Edit Service Package
            </h1>
            <p className="text-xs text-brand-600">
              Editing service: <span className="font-semibold text-gold-700">{service.name}</span> ({service.category})
            </p>
          </div>
        </div>

        <EditServiceForm service={service as Service} />
      </div>
    </div>
  );
}
