import React from "react";
import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, Award, Clock, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { buildGeneralWhatsAppMsg } from "@/lib/whatsapp";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getLocalizedField } from "@/lib/i18n/getLocalizedField";

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { lang } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: `${dictionary.aboutPage.title} | MehendiAura`,
    description: dictionary.aboutPage.subtitle,
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  const settings = await fetchBusinessSettings();
  const whatsappMsg = buildGeneralWhatsAppMsg(settings.business_name, locale);
  const aboutContent = getLocalizedField(settings, "about_content", locale);

  return (
    <div className="py-12 sm:py-16 space-y-16 sm:space-y-20">
      {/* 1. Hero Header */}
      <Container size="lg">
        <SectionHeading
          badge={dictionary.aboutPage.badge}
          title={dictionary.aboutPage.title}
          subtitle={dictionary.aboutPage.subtitle}
        />

        {/* Story Banner Box */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gold-300/30 shadow-soft grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span>{dictionary.hero.badge}</span>
            </div>

            <h2 className="font-serif text-3xl font-bold text-brand-900 leading-tight">
              {dictionary.home.heritageTitle}
            </h2>

            <p className="text-base text-brand-700 leading-relaxed whitespace-pre-line">
              {aboutContent}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <WhatsAppButton
                size="md"
                phoneNumber={settings.whatsapp}
                message={whatsappMsg}
                label={dictionary.common.enquireWhatsapp}
              />
              <CallButton size="md" phoneNumber={settings.phone} label={dictionary.common.callStudio} />
            </div>
          </div>

          <div className="relative">
            <div className="h-96 rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-earth-900 border border-gold-500/30 overflow-hidden shadow-2xl p-8 flex flex-col justify-between text-cream-100 relative">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 space-y-2">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                  {dictionary.home.heritageBadge}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {dictionary.aboutPage.title}
                </h3>
              </div>

              <div className="relative z-10 space-y-3 bg-brand-950/70 backdrop-blur-md p-4 rounded-2xl border border-gold-500/20 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{dictionary.aboutPage.spec3Title} — {dictionary.aboutPage.spec3Desc}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{dictionary.aboutPage.spec2Title} — {dictionary.aboutPage.spec2Desc}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{dictionary.aboutPage.spec4Title}</span>
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
            badge={dictionary.aboutPage.specializationsBadge}
            title={dictionary.aboutPage.specializationsTitle}
            subtitle={dictionary.aboutPage.specializationsSubtitle}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-brand-900">
                {dictionary.aboutPage.spec1Title}
              </h3>
              <p className="text-xs text-brand-700 leading-relaxed">
                {dictionary.aboutPage.spec1Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-brand-900">
                {dictionary.aboutPage.spec2Title}
              </h3>
              <p className="text-xs text-brand-700 leading-relaxed">
                {dictionary.aboutPage.spec2Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-brand-900">
                {dictionary.aboutPage.spec3Title}
              </h3>
              <p className="text-xs text-brand-700 leading-relaxed">
                {dictionary.aboutPage.spec3Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold-300/30 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-brand-900">
                {dictionary.aboutPage.spec4Title}
              </h3>
              <p className="text-xs text-brand-700 leading-relaxed">
                {dictionary.aboutPage.spec4Desc}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
