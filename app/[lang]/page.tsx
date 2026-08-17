import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Gem,
  ArrowRight,
  Star,
  Quote,
  Sparkle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Service, Jewellery, Testimonial, FAQ } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { buildServiceWhatsAppMsg, buildJewelleryWhatsAppMsg, buildGeneralWhatsAppMsg } from "@/lib/whatsapp";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getLocalizedField } from "@/lib/i18n/getLocalizedField";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const locale: Locale = (lang === "kn" ? "kn" : "en") as Locale;
  const dictionary = getDictionary(locale);

  const supabase = await createClient();
  const settings = await fetchBusinessSettings();

  // 1. Fetch Featured Services
  const { data: servicesData } = await supabase
    .from("services")
    .select("*, service_images(*)")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("display_order", { ascending: true })
    .limit(3);

  const services: Service[] = (servicesData as any[]) || [];

  // 2. Fetch Featured Rental Jewellery
  const { data: jewelleryData } = await supabase
    .from("jewellery")
    .select("*, jewellery_images(*)")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("display_order", { ascending: true })
    .limit(3);

  const jewelleryItems: Jewellery[] = (jewelleryData as any[]) || [];

  // 3. Fetch Testimonials
  const { data: testimonialsData } = await supabase
    .from("testimonials")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  const testimonials: Testimonial[] = (testimonialsData as any[]) || [];

  // 4. Fetch FAQs
  const { data: faqsData } = await supabase
    .from("faqs")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  const faqs: FAQ[] = (faqsData as any[]) || [];

  const generalWhatsappMsg = buildGeneralWhatsAppMsg(settings.business_name, locale);
  const heroTitle = getLocalizedField(settings, "hero_title", locale) || dictionary.hero.defaultTitle;
  const heroDescription = getLocalizedField(settings, "hero_description", locale) || dictionary.hero.defaultSubtitle;
  const aboutContent = getLocalizedField(settings, "about_content", locale);

  return (
    <div className="space-y-14 sm:space-y-28 py-4 sm:py-6 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-800 to-brand-950 text-cream-100 py-12 sm:py-24 px-4 sm:px-8 rounded-2xl sm:rounded-3xl mx-2 sm:mx-8 border border-gold-500/30 shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />

        <Container size="md" className="relative z-10 text-center px-2 sm:px-6">
          <AnimatedSection direction="down" delay={100}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4 sm:mb-6 shadow-sm animate-float">
              <Sparkles className="w-4 h-4 text-gold-400 animate-spin-slow shrink-0" />
              <span className="truncate">{dictionary.hero.badge}</span>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={200}>
            <h1 className="font-serif text-2xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-tight">
              {heroTitle}
            </h1>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={350}>
            <p className="font-sans text-sm sm:text-xl text-cream-200 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal">
              {heroDescription}
            </p>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={500}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
              <WhatsAppButton
                fullWidth
                size="lg"
                phoneNumber={settings.whatsapp}
                message={generalWhatsappMsg}
                label={dictionary.common.enquireWhatsapp}
              />
              <CallButton fullWidth size="lg" phoneNumber={settings.phone} label={dictionary.common.callNow} />
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* 2. BUSINESS INTRODUCTION */}
      <section>
        <Container size="lg">
          <AnimatedSection direction="up" delay={150}>
            <div className="bg-white p-5 sm:p-12 rounded-2xl sm:rounded-3xl border border-gold-300/30 shadow-soft grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-semibold uppercase tracking-wider">
                  <Sparkle className="w-3.5 h-3.5 shrink-0" />
                  <span>{dictionary.home.heritageBadge}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-900 leading-tight">
                  {dictionary.home.heritageTitle}
                </h2>
                <p className="text-xs sm:text-base text-brand-700 leading-relaxed">
                  {aboutContent}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                <div className="p-4 sm:p-6 rounded-2xl bg-cream-50 border border-gold-300/30 text-center space-y-1 hover-lift transition-all">
                  <div className="font-serif font-bold text-2xl sm:text-3xl text-gold-700">100%</div>
                  <div className="text-[10px] sm:text-xs font-semibold text-brand-900 uppercase tracking-wider">
                    {locale === "kn" ? "ನೈಸರ್ಗಿಕ ಮೆಹೆಂದಿ" : "Organic Henna Stain"}
                  </div>
                </div>
                <div className="p-4 sm:p-6 rounded-2xl bg-cream-50 border border-gold-300/30 text-center space-y-1 hover-lift transition-all">
                  <div className="font-serif font-bold text-2xl sm:text-3xl text-emerald-700 truncate">
                    {locale === "kn" ? "ಶುಚಿಗೊಳಿಸಿದ" : "Sanitized"}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-brand-900 uppercase tracking-wider">
                    {dictionary.common.rentalPrice}
                  </div>
                </div>
                <div className="p-4 sm:p-6 rounded-2xl bg-cream-50 border border-gold-300/30 text-center space-y-1 hover-lift transition-all">
                  <div className="font-serif font-bold text-2xl sm:text-3xl text-gold-700 truncate">
                    {locale === "kn" ? "ಮನೆಬಾಗಿಲ" : "Doorstep"}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-brand-900 uppercase tracking-wider">
                    {locale === "kn" ? "ವಧುವಿನ ಸೇವೆ" : "Bridal Service"}
                  </div>
                </div>
                <div className="p-4 sm:p-6 rounded-2xl bg-cream-50 border border-gold-300/30 text-center space-y-1 hover-lift transition-all">
                  <div className="font-serif font-bold text-2xl sm:text-3xl text-brand-900">
                    {locale === "kn" ? "ನೇರ" : "Direct"}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-brand-900 uppercase tracking-wider truncate">
                    {dictionary.common.callNow} / WhatsApp
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* 3. FEATURED SERVICES */}
      {services.length > 0 && (
        <section>
          <Container size="lg">
            <AnimatedSection direction="up">
              <SectionHeading
                badge={dictionary.home.featuredServicesBadge}
                title={dictionary.home.featuredServicesTitle}
                subtitle={dictionary.home.featuredServicesSubtitle}
              />
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, idx) => {
                const name = getLocalizedField(service, "name", locale);
                const shortDesc = getLocalizedField(service, "short_description", locale);
                const mainImg = service.service_images && service.service_images.length > 0
                  ? service.service_images[0].image_url
                  : null;
                const whatsappMsg = buildServiceWhatsAppMsg(name, settings.business_name, locale);

                return (
                  <AnimatedSection key={service.id} direction="up" delay={idx * 150}>
                    <Card hoverEffect glass className="flex flex-col justify-between h-full group">
                      <div>
                        <div className="h-44 sm:h-48 bg-gradient-to-tr from-brand-900 to-brand-800 flex items-center justify-center text-gold-300 p-4 sm:p-6 relative overflow-hidden">
                          {mainImg ? (
                            <img
                              src={mainImg}
                              alt={name}
                              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                            />
                          ) : (
                            <Heart className="w-12 h-12 stroke-1 opacity-80" />
                          )}
                          <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gold-500 text-brand-950 font-semibold text-[10px] sm:text-xs px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            {service.category}
                          </span>
                        </div>

                        <CardHeader>
                          <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-900 group-hover:text-gold-700 transition-colors">
                            <Link href={`/${locale}/services/${service.slug}`}>{name}</Link>
                          </h3>
                        </CardHeader>

                        <CardBody>
                          <p className="text-xs sm:text-sm text-brand-700 leading-relaxed mb-4">
                            {shortDesc}
                          </p>
                          <div className="text-xs sm:text-sm font-semibold text-brand-900 border-t border-cream-200 pt-3">
                            {dictionary.common.startingFrom}: <span className="text-gold-700 font-bold">{service.price || dictionary.common.contactForPrice}</span>
                          </div>
                        </CardBody>
                      </div>

                      <CardFooter className="flex-col sm:flex-row gap-2">
                        <WhatsAppButton
                          fullWidth
                          size="sm"
                          label={dictionary.common.whatsapp}
                          phoneNumber={settings.whatsapp}
                          message={whatsappMsg}
                        />
                        <CallButton fullWidth size="sm" phoneNumber={settings.phone} label={dictionary.common.callNow} />
                      </CardFooter>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>

            <div className="mt-8 sm:mt-10 text-center">
              <Link href={`/${locale}/services`}>
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-800 text-gold-300 hover:bg-brand-900 font-semibold text-xs sm:text-sm shadow-md transition-all hover-lift">
                  <span>{dictionary.home.viewAllServices}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* 4. FEATURED RENTAL JEWELLERY */}
      {jewelleryItems.length > 0 && (
        <section>
          <Container size="lg">
            <AnimatedSection direction="up">
              <SectionHeading
                badge={dictionary.home.featuredJewelleryBadge}
                title={dictionary.home.featuredJewelleryTitle}
                subtitle={dictionary.home.featuredJewellerySubtitle}
              />
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {jewelleryItems.map((item, idx) => {
                const name = getLocalizedField(item, "name", locale);
                const shortDesc = getLocalizedField(item, "short_description", locale);
                const mainImg = item.jewellery_images && item.jewellery_images.length > 0
                  ? item.jewellery_images[0].image_url
                  : null;
                const whatsappMsg = buildJewelleryWhatsAppMsg(name, settings.business_name, locale);

                return (
                  <AnimatedSection key={item.id} direction="up" delay={idx * 150}>
                    <Card hoverEffect className="flex flex-col justify-between h-full group">
                      <div>
                        <div className="h-44 sm:h-48 bg-gradient-to-tr from-earth-900 to-earth-800 flex items-center justify-center text-gold-300 p-4 sm:p-6 relative overflow-hidden">
                          {mainImg ? (
                            <img
                              src={mainImg}
                              alt={name}
                              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                            />
                          ) : (
                            <Gem className="w-12 h-12 stroke-1 opacity-80" />
                          )}
                          <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-emerald-700 text-white font-semibold text-[10px] sm:text-xs px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            {item.availability_status === "available"
                              ? dictionary.common.available
                              : item.availability_status === "booked"
                              ? dictionary.common.booked
                              : dictionary.common.maintenance}
                          </span>
                        </div>

                        <CardHeader>
                          <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-900 group-hover:text-gold-700 transition-colors">
                            <Link href={`/${locale}/jewellery/${item.slug}`}>{name}</Link>
                          </h3>
                        </CardHeader>

                        <CardBody>
                          <p className="text-xs sm:text-sm text-brand-700 leading-relaxed mb-4">
                            {shortDesc}
                          </p>
                          <div className="text-xs sm:text-sm font-semibold text-brand-900 border-t border-cream-200 pt-3">
                            {dictionary.common.rentalPrice}: <span className="text-emerald-700 font-bold">{item.rental_price ? `₹${item.rental_price} ${dictionary.common.perDay}` : dictionary.common.contactForPrice}</span>
                          </div>
                        </CardBody>
                      </div>

                      <CardFooter className="flex-col sm:flex-row gap-2">
                        <WhatsAppButton
                          fullWidth
                          size="sm"
                          label={dictionary.common.enquireWhatsapp}
                          phoneNumber={settings.whatsapp}
                          message={whatsappMsg}
                        />
                        <CallButton fullWidth size="sm" phoneNumber={settings.phone} label={dictionary.common.callNow} />
                      </CardFooter>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>

            <div className="mt-8 sm:mt-10 text-center">
              <Link href={`/${locale}/jewellery`}>
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-800 text-gold-300 hover:bg-brand-900 font-semibold text-xs sm:text-sm shadow-md transition-all hover-lift">
                  <span>{dictionary.home.viewAllJewellery}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* 5. PROCESS TIMELINE */}
      <section className="bg-cream-200/50 py-12 sm:py-16">
        <Container size="lg">
          <AnimatedSection direction="up">
            <SectionHeading
              badge={dictionary.home.processBadge}
              title={dictionary.home.processTitle}
              subtitle={dictionary.home.processSubtitle}
            />
            <ProcessTimeline locale={locale} />
          </AnimatedSection>
        </Container>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      {testimonials.length > 0 && (
        <section>
          <Container size="lg">
            <AnimatedSection direction="up">
              <SectionHeading
                badge={dictionary.home.testimonialsBadge}
                title={dictionary.home.testimonialsTitle}
                subtitle={dictionary.home.testimonialsSubtitle}
              />
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {testimonials.map((testi, idx) => {
                const text = getLocalizedField(testi, "testimonial", locale);
                return (
                  <AnimatedSection key={testi.id} direction="up" delay={idx * 150}>
                    <Card hoverEffect className="p-5 sm:p-6 bg-white border-gold-300/30 flex flex-col justify-between h-full">
                      <div className="space-y-3 sm:space-y-4">
                        <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-gold-500/40" />
                        <p className="text-xs sm:text-sm text-brand-800 leading-relaxed italic">
                          "{text}"
                        </p>
                      </div>
                      <div className="pt-4 border-t border-cream-200 flex items-center justify-between mt-4 text-xs font-semibold text-brand-900">
                        <div>
                          <div>{testi.customer_name}</div>
                          {testi.event_type && (
                            <div className="text-[10px] text-gold-700 uppercase tracking-wider font-normal">
                              {testi.event_type} Client
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 text-gold-500">
                          {Array.from({ length: testi.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-gold-500" />
                          ))}
                        </div>
                      </div>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      {faqs.length > 0 && (
        <section className="bg-cream-50 py-12 sm:py-16 border-y border-gold-300/20">
          <Container size="lg">
            <AnimatedSection direction="up">
              <SectionHeading
                badge={dictionary.home.faqsBadge}
                title={dictionary.home.faqsTitle}
                subtitle={dictionary.home.faqsSubtitle}
              />
              <FaqAccordion faqs={faqs} locale={locale} />
            </AnimatedSection>
          </Container>
        </section>
      )}

      {/* 8. CONTACT CTA BANNER */}
      <section>
        <Container size="lg">
          <AnimatedSection direction="up">
            <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 text-cream-100 p-6 sm:p-12 rounded-2xl sm:rounded-3xl border border-gold-500/40 text-center shadow-2xl space-y-4 sm:space-y-6 relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider animate-float">
                <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>{dictionary.home.ctaBadge}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white max-w-xl mx-auto leading-tight">
                {dictionary.home.ctaTitle}
              </h2>

              <p className="text-xs sm:text-base text-cream-200 max-w-lg mx-auto leading-relaxed">
                {dictionary.home.ctaSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto pt-2">
                <WhatsAppButton
                  fullWidth
                  size="lg"
                  phoneNumber={settings.whatsapp}
                  message={generalWhatsappMsg}
                  label={dictionary.common.enquireWhatsapp}
                />
                <CallButton fullWidth size="lg" phoneNumber={settings.phone} label={dictionary.common.callNow} />
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </div>
  );
}
