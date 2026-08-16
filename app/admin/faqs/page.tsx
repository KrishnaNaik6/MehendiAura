import React from "react";
import Link from "next/link";
import { HelpCircle, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FAQ } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { FaqsTable } from "./FaqsTable";

export default async function AdminFaqsPage() {
  const supabase = await createClient();

  const { data: faqsData } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const faqs: FAQ[] = (faqsData as any[]) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-cream-100 p-8 rounded-3xl border border-gold-500/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ CMS</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">
            Frequently Asked Questions Management
          </h1>
          <p className="text-sm text-cream-200 mt-1">
            Manage question and answer accordions displayed on your website homepage.
          </p>
        </div>

        <Link href="/admin/faqs/new">
          <Button variant="gold" size="lg" leftIcon={<Plus className="w-5 h-5" />}>
            Add Question &amp; Answer
          </Button>
        </Link>
      </div>

      <FaqsTable initialFaqs={faqs} />
    </div>
  );
}
