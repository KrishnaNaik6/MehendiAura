import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gem, ArrowLeft, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Jewellery } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { buildJewelleryWhatsAppMsg } from "@/lib/whatsapp";
import { fetchBusinessSettings } from "@/lib/supabase/helper";

interface JewelleryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: JewelleryDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("jewellery")
    .select("name, short_description")
    .eq("slug", slug)
    .single();

  if (!item) {
    return { title: "Rental Jewellery | MehendiAura" };
  }

  return {
    title: `${item.name} | Rental Jewellery Catalog`,
    description: item.short_description,
  };
}

export default async function JewelleryDetailPage({ params }: JewelleryDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const settings = await fetchBusinessSettings();

  const { data: itemData } = await supabase
    .from("jewellery")
    .select("*, jewellery_images(*)")
    .eq("slug", slug)
    .single();

  if (!itemData) {
    if (slug !== "kundu-polki-royal-bridal-set" && slug !== "south-indian-temple-heritage-set") {
      notFound();
    }
  }

  const item: Jewellery = itemData || {
    id: "sample-jdetail",
    name: slug === "kundu-polki-royal-bridal-set" ? "Kundu & Polki Royal Bridal Set" : "South Indian Temple Heritage Set",
    slug: slug,
    category: "Bridal Sets",
    short_description: "Regal Kundan necklace set with matching long haram, matha patti, jhumkas, and waist belt.",
    description: "Handcrafted premium Kundan bridal rental set plated in 22K gold finish, designed to complement traditional bridal lehengas and Kanjeevaram silk sarees.",
    rental_price: 2500,
    security_deposit: 3000,
    availability_status: "available",
    included_items: ["Royal Choker Necklace", "Long Layered Haram", "Matha Patti", "Matching Jhumka Earrings", "Vaddanam Waist Belt", "Nath / Nose Ring"],
    featured: true,
    active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const whatsappMsg = buildJewelleryWhatsAppMsg(item.name, settings.business_name);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <Container size="lg">
        {/* Back Link */}
        <Link
          href="/jewellery"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-gold-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rental Jewellery Catalog</span>
        </Link>

        {/* Main Item Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Showcase */}
          <div className="space-y-4">
            <div className="h-96 rounded-3xl bg-gradient-to-tr from-earth-900 via-earth-800 to-brand-950 border border-gold-500/30 overflow-hidden shadow-2xl flex items-center justify-center relative">
              {item.jewellery_images && item.jewellery_images.length > 0 ? (
                <img
                  src={item.jewellery_images[0].image_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-gold-300">
                  <Gem className="w-16 h-16 stroke-1 opacity-80" />
                  <span className="font-serif text-lg tracking-wider text-gold-400">
                    {item.name}
                  </span>
                </div>
              )}
              <span
                className={`absolute top-4 left-4 text-white font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md ${
                  item.availability_status === "available"
                    ? "bg-emerald-700"
                    : item.availability_status === "booked"
                    ? "bg-gold-700"
                    : "bg-red-700"
                }`}
              >
                Status: {item.availability_status}
              </span>
            </div>
          </div>

          {/* Details & Rental Booking CTA */}
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-semibold uppercase tracking-wider">
                <Gem className="w-3.5 h-3.5" />
                <span>{item.category} Rental</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-900 leading-tight">
                {item.name}
              </h1>
            </div>

            {/* Rental Price & Deposit Box */}
            <div className="p-6 rounded-2xl bg-white border border-gold-300/40 shadow-soft space-y-3">
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div>
                  <span className="text-xs font-semibold text-gold-700 uppercase tracking-wider">
                    Daily Rental Rate
                  </span>
                  <div className="text-3xl font-serif font-bold text-emerald-700">
                    {item.rental_price ? `₹${item.rental_price}` : "Contact for Rate"}
                    <span className="text-sm font-normal text-brand-600"> / day</span>
                  </div>
                </div>

                {item.security_deposit && (
                  <div className="text-right">
                    <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                      Refundable Deposit
                    </span>
                    <div className="text-xl font-bold text-brand-900">
                      ₹{item.security_deposit}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-brand-600">
                Enquire via WhatsApp to reserve rental dates. Security deposit is 100% refunded upon safe return.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-brand-900 border-b border-cream-300 pb-2">
                Jewellery Set Overview
              </h2>
              <p className="text-base text-brand-700 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Included Items Checklist */}
            {item.included_items && item.included_items.length > 0 && (
              <div className="space-y-3 p-5 rounded-2xl bg-cream-50 border border-gold-300/30">
                <h3 className="font-serif font-bold text-brand-900 text-sm">Included Items in Set:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-700">
                  {item.included_items.map((piece, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{piece}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-cream-200">
              <WhatsAppButton
                fullWidth
                size="lg"
                label="Enquire on WhatsApp"
                phoneNumber={settings.whatsapp}
                message={whatsappMsg}
              />
              <CallButton fullWidth size="lg" phoneNumber={settings.phone} label="Call Now" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
