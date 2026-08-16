import React from "react";
import Link from "next/link";
import { MessageSquareQuote, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Testimonial } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { TestimonialsTable } from "./TestimonialsTable";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();

  const { data: testimonialsData } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const testimonials: Testimonial[] = (testimonialsData as any[]) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-cream-100 p-8 rounded-3xl border border-gold-500/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Customer Testimonials CMS</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">
            Client Testimonials Management
          </h1>
          <p className="text-sm text-cream-200 mt-1">
            Add real customer reviews, star ratings, and event tags displayed on your homepage.
          </p>
        </div>

        <Link href="/admin/testimonials/new">
          <Button variant="gold" size="lg" leftIcon={<Plus className="w-5 h-5" />}>
            Add Testimonial
          </Button>
        </Link>
      </div>

      <TestimonialsTable initialTestimonials={testimonials} />
    </div>
  );
}
