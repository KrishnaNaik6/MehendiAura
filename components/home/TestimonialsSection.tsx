"use client";

import React, { useState } from "react";
import {
  Star,
  Quote,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Testimonial } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Locale } from "@/lib/i18n/config";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  locale: Locale;
  dictionary: {
    badge: string;
    title: string;
    subtitle: string;
  };
}

export function TestimonialsSection({
  testimonials,
  locale,
  dictionary,
}: TestimonialsSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="relative bg-gradient-to-b from-brand-950 via-[#1a0709] to-brand-950 py-12 sm:py-20 text-cream-100 rounded-3xl mx-2 sm:mx-6 lg:mx-8 border border-gold-500/25 shadow-2xl overflow-hidden">
      {/* Decorative Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <Container size="lg" className="relative z-10 space-y-8 sm:space-y-12">
        {/* Section Heading */}
        <AnimatedSection direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-bold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" />
              <span>{dictionary.badge}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              {dictionary.title}
            </h2>

            <p className="text-xs sm:text-base text-cream-200/90 font-light leading-relaxed max-w-2xl mx-auto">
              {dictionary.subtitle}
            </p>

            {/* Trust & Quality Indicators Ribbon */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-gold-300/90">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-900/90 border border-gold-500/20">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-white">5.0 Star Rating</span>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-900/90 border border-gold-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Organic Henna</span>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-900/90 border border-gold-500/20">
                <Award className="w-3.5 h-3.5 text-gold-400" />
                <span>Deep Dark Stain Guaranteed</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonials Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((item, idx) => {
            const clientName = item.customer_name || "Client";
            const role = item.event_type || (locale === "kn" ? "ಮೆಹೆಂದಿ ಕ್ಲೈಂಟ್" : "Bridal Client");
            const content = (locale === "kn" ? item.testimonial_kn : item.testimonial_en) || item.testimonial;
            const initial = clientName.trim().charAt(0).toUpperCase() || "M";

            return (
              <AnimatedSection key={item.id} direction="up" delay={idx * 120}>
                <div className="group relative bg-gradient-to-b from-brand-900/90 via-brand-900/60 to-brand-950/95 p-6 sm:p-7 rounded-3xl border border-gold-500/20 hover:border-gold-400/50 flex flex-col justify-between h-full shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-gold-500/10">
                  {/* Subtle Top Gold Highlight Bar */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-gold-400/40 to-transparent group-hover:via-gold-400 transition-all" />

                  {/* Watermark Quote Icon */}
                  <Quote className="w-10 h-10 text-gold-500/10 absolute top-5 right-5 pointer-events-none group-hover:text-gold-500/20 transition-colors" />

                  <div className="space-y-4">
                    {/* Stars & Event Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-1 text-amber-400">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 drop-shadow-sm" />
                        ))}
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                        {role}
                      </span>
                    </div>

                    {/* Review Quote Body */}
                    <p className="text-xs sm:text-sm text-cream-100 font-normal leading-relaxed italic">
                      &ldquo;{content}&rdquo;
                    </p>
                  </div>

                  {/* Client Info Footer */}
                  <div className="pt-5 mt-4 border-t border-gold-500/15 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar with Initials / Photo */}
                      {item.image_url ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-400 shrink-0">
                          <img
                            src={item.image_url}
                            alt={clientName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center text-brand-950 font-serif font-bold text-sm shadow-md shrink-0 ring-2 ring-gold-400/30">
                          {initial}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="font-serif font-bold text-white text-sm truncate group-hover:text-gold-300 transition-colors">
                          {clientName}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>
                            {locale === "kn" ? "ದೃಢೀಕರಿಸಿದ ಗ್ರಾಹಕರು" : "Verified Client"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Date / Location Tag */}
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-cream-300/70 font-medium block">
                        Sagara, Karnataka
                      </span>
                      {item.created_at && (
                        <span className="text-[9px] text-gold-400/80 block">
                          {new Date(item.created_at).toLocaleDateString(
                            locale === "kn" ? "kn-IN" : "en-IN",
                            { month: "short", year: "numeric" }
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Mobile Swipe / Comfort Helper */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-gold-300/60 italic">
            {locale === "kn"
              ? "★ ನೂರಾರು ವಧುಗಳು ಮೆಚ್ಚಿದ ವಿಶ್ವಾಸಾರ್ಹ ಮೆಹೆಂದಿ ಮತ್ತು ಆಭರಣ ಸೇವೆ."
              : "★ Trusted by brides for bespoke bridal henna & royal jewellery rentals across Malenadu."}
          </p>
        </div>
      </Container>
    </section>
  );
}
