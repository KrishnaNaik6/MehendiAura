import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkle, Clock, ShieldCheck, ArrowLeft, Heart, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Service } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { buildServiceWhatsAppMsg } from "@/lib/whatsapp";
import { fetchBusinessSettings } from "@/lib/supabase/helper";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("name, short_description")
    .eq("slug", slug)
    .single();

  if (!service) {
    return { title: "Mehendi Service | MehendiAura" };
  }

  return {
    title: `${service.name} | Mehendi Services`,
    description: service.short_description,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const settings = await fetchBusinessSettings();

  const { data: serviceData } = await supabase
    .from("services")
    .select("*, service_images(*)")
    .eq("slug", slug)
    .single();

  if (!serviceData) {
    // If not found in database during dev, check sample fallback
    if (slug !== "royal-bridal-mehendi" && slug !== "arabic-contemporary-mehendi" && slug !== "guest-party-henna-package") {
      notFound();
    }
  }

  const service: Service = serviceData || {
    id: "sample-detail",
    name: slug === "royal-bridal-mehendi" ? "Royal Bridal Mehendi" : "Arabic & Contemporary Mehendi",
    slug: slug,
    category: "Bridal",
    short_description: "Intricate full-arm and leg bridal henna art featuring custom dulha-dulhan portrait motifs and wedding rituals.",
    description: "Our signature Royal Bridal Mehendi package offers bespoke, highly detailed bridal henna patterns crafted with 100% natural organic henna. Includes custom dulha-dulhan portraits, baraat motifs, and custom story elements.",
    price: "Contact for Custom Quote",
    duration: "4 - 6 Hours",
    featured: true,
    active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const whatsappMsg = buildServiceWhatsAppMsg(service.name, settings.business_name);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <Container size="lg">
        {/* Back Link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-gold-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Mehendi Services</span>
        </Link>

        {/* Main Service Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery Showcase */}
          <div className="space-y-4">
            <div className="h-96 rounded-3xl bg-gradient-to-tr from-brand-900 to-brand-800 border border-gold-500/30 overflow-hidden shadow-2xl flex items-center justify-center relative">
              {service.service_images && service.service_images.length > 0 ? (
                <img
                  src={service.service_images[0].image_url}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-gold-300">
                  <Heart className="w-16 h-16 stroke-1 opacity-80" />
                  <span className="font-serif text-lg tracking-wider text-gold-400">
                    {service.name}
                  </span>
                </div>
              )}
              <span className="absolute top-4 left-4 bg-brand-950/90 backdrop-blur-md text-gold-300 border border-gold-500/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                {service.category} Collection
              </span>
            </div>
          </div>

          {/* Details & Direct Booking CTA */}
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-semibold uppercase tracking-wider">
                <Sparkle className="w-3.5 h-3.5" />
                <span>{service.category} Package</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-900 leading-tight">
                {service.name}
              </h1>

              {service.duration && (
                <div className="flex items-center gap-2 text-sm text-brand-700 font-medium">
                  <Clock className="w-4 h-4 text-gold-600" />
                  <span>Application Time: {service.duration}</span>
                </div>
              )}
            </div>

            {/* Price Box */}
            <div className="p-6 rounded-2xl bg-white border border-gold-300/40 shadow-soft space-y-1">
              <span className="text-xs font-semibold text-gold-700 uppercase tracking-wider">
                Pricing &amp; Package Rate
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-brand-900">
                {service.price || "Contact for Custom Quote"}
              </div>
              <p className="text-xs text-brand-600">
                Direct booking via WhatsApp or Phone Call. No advance online payment required.
              </p>
            </div>

            {/* Description Narrative */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-brand-900 border-b border-cream-300 pb-2">
                Service Description &amp; Highlights
              </h2>
              <p className="text-base text-brand-700 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Highlights Checklist */}
            <div className="space-y-3 p-5 rounded-2xl bg-cream-50 border border-gold-300/30">
              <h3 className="font-serif font-bold text-brand-900 text-sm">What's Included:</h3>
              <ul className="space-y-2 text-xs text-brand-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Organic, Chemical-Free Triple-Sifted Natural Henna Stain</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bespoke Custom Motifs &amp; Dulha-Dulhan Bridal Elements</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Essential Oils Aftercare Instructions &amp; Stain Protection Sealant</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>On-Site Doorstep Bridal Service Available</span>
                </li>
              </ul>
            </div>

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
