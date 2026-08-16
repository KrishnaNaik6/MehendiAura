import React from "react";
import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, Award, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { buildGeneralWhatsAppMsg } from "@/lib/whatsapp";

export const metadata = {
  title: "About Us | Master Mehendi Artist & Heritage Rental Jewellery",
  description: "Learn about MehendiAura — our heritage in bridal henna artistry, 100% organic stain guarantee, and curated rental jewellery collections.",
};

export default async function AboutPage() {
  const settings = await fetchBusinessSettings();
  const whatsappMsg = buildGeneralWhatsAppMsg(settings.business_name);

  return (
    <div className="py-12 sm:py-16 space-y-16 sm:space-y-20">
      {/* 1. Hero Header */}
      <Container size="lg">
        <SectionHeading
          badge="Our Heritage & Story"
          title={`About ${settings.business_name}`}
          subtitle="Dedicated to preserving timeless Indian bridal traditions through handcrafted organic mehendi art and regal rental jewellery."
        />

        {/* Story Banner Box */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gold-300/30 shadow-soft grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span>Master Henna Artistry</span>
            </div>

            <h2 className="font-serif text-3xl font-bold text-brand-900 leading-tight">
              Passionate Craftsmanship for Every Bride
            </h2>

            <p className="text-base text-brand-700 leading-relaxed whitespace-pre-line">
              {settings.about_content}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <WhatsAppButton
                size="md"
                phoneNumber={settings.whatsapp}
                message={whatsappMsg}
                label="Enquire on WhatsApp"
              />
              <CallButton size="md" phoneNumber={settings.phone} label="Call Studio" />
            </div>
          </div>

          <div className="relative">
            <div className="h-96 rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-earth-900 border border-gold-500/30 overflow-hidden shadow-2xl p-8 flex flex-col justify-between text-cream-100 relative">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 space-y-2">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                  Why Brides Trust Us
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Purity, Elegance &amp; Timely Service
                </h3>
              </div>

              <div className="relative z-10 space-y-3 bg-brand-950/70 backdrop-blur-md p-4 rounded-2xl border border-gold-500/20 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Organic Henna Powder &amp; Essential Oils</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sanitized 22K Finish Rental Jewellery Sets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Doorstep Service across Wedding Venues</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* 2. Specializations Grid */}
      <section className="bg-cream-200/50 py-16 border-y border-gold-300/20">
        <Container size="lg">
          <SectionHeading
            badge="Our Specializations"
            title="Signature Offerings"
            subtitle="Explore what makes our mehendi designs and jewellery rental service stand out."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-brand-900">
                Bridal Henna Portraits
              </h3>
              <p className="text-xs text-brand-700 leading-relaxed">
                Custom dulha-dulhan portraits, radha-krishna motifs, and bespoke love story timelines.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-brand-900">
                Temple Jewellery Sets
              </h3>
              <p className="text-xs text-brand-700 leading-relaxed">
                Regal South Indian temple sets, Lakshmi harams, chokers, and matching waist belts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-brand-900">
                100% Organic Henna
              </h3>
              <p className="text-xs text-brand-700 leading-relaxed">
                Chemical-free natural henna cones ensuring deep, rich, long-lasting reddish-brown stain.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-brand-900">
                Punctual Doorstep Service
              </h3>
              <p className="text-xs text-brand-700 leading-relaxed">
                On-time artist team for home, hotel, or resort wedding venue applications.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
