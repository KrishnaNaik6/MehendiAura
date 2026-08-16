import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Gem,
  ArrowRight,
  Star,
  ShieldCheck,
  Clock,
  MessageSquare,
  Phone,
  Quote,
  Sparkle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Service, Jewellery, GalleryItem, Testimonial, FAQ } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { buildServiceWhatsAppMsg, buildJewelleryWhatsAppMsg, buildGeneralWhatsAppMsg } from "@/lib/whatsapp";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { FaqAccordion } from "@/components/home/FaqAccordion";

export default async function Home() {
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

  const services: Service[] = (servicesData as any[]) || [
    {
      id: "s1",
      name: "Royal Bridal Mehendi",
      slug: "royal-bridal-mehendi",
      category: "Bridal",
      short_description: "Intricate full-arm and leg bridal henna art featuring custom dulha-dulhan portrait motifs.",
      description: "Bespoke bridal mehendi with 100% natural organic henna stain.",
      price: "Contact for Custom Quote",
      duration: "4 - 6 Hours",
      featured: true,
      active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "s2",
      name: "Arabic & Contemporary Mehendi",
      slug: "arabic-contemporary-mehendi",
      category: "Arabic",
      short_description: "Elegant flowing floral vines, shaded mandalas, and modern geometric patterns.",
      description: "Designed for engagements and sangeet functions.",
      price: "Starting from ₹2,500",
      duration: "2 - 3 Hours",
      featured: true,
      active: true,
      display_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // 2. Fetch Featured Rental Jewellery
  const { data: jewelleryData } = await supabase
    .from("jewellery")
    .select("*, jewellery_images(*)")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("display_order", { ascending: true })
    .limit(3);

  const jewelleryItems: Jewellery[] = (jewelleryData as any[]) || [
    {
      id: "j1",
      name: "Kundu & Polki Royal Bridal Set",
      slug: "kundu-polki-royal-bridal-set",
      category: "Bridal Sets",
      short_description: "Regal Kundan necklace set with matching long haram, matha patti, jhumkas, and waist belt.",
      description: "Handcrafted 22K gold finish bridal rental set.",
      rental_price: 2500,
      security_deposit: 3000,
      availability_status: "available",
      included_items: ["Choker", "Long Haram", "Matha Patti", "Jhumkas", "Vaddanam"],
      featured: true,
      active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // 3. Fetch Featured Gallery Highlights
  const { data: galleryData } = await supabase
    .from("gallery")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .limit(4);

  const galleryItems: GalleryItem[] = (galleryData as any[]) || [];

  // 4. Fetch Testimonials
  const { data: testimonialsData } = await supabase
    .from("testimonials")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  const testimonials: Testimonial[] = (testimonialsData as any[]) || [
    {
      id: "t1",
      customer_name: "Ananya Sharma",
      testimonial: "The bridal mehendi stain lasted so dark and rich for over two weeks! The rental jewellery set matched my lehenga perfectly.",
      rating: 5,
      event_type: "Wedding",
      image_url: null,
      active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "t2",
      customer_name: "Pooja Reddy",
      testimonial: "Punctual, hygienic, and extremely detailed artists. The temple jewellery rental was pristine and lightweight to wear all day.",
      rating: 5,
      event_type: "Engagement",
      image_url: null,
      active: true,
      display_order: 2,
      created_at: new Date().toISOString(),
    },
  ];

  // 5. Fetch FAQs
  const { data: faqsData } = await supabase
    .from("faqs")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  const faqs: FAQ[] = (faqsData as any[]) || [
    {
      id: "f1",
      question: "How far in advance should I book Bridal Mehendi?",
      answer: "We recommend booking 2 to 4 months in advance for peak wedding season to guarantee artist availability.",
      category: "General",
      active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "f2",
      question: "What is the security deposit policy for rental jewellery?",
      answer: "A refundable security deposit is collected upon collection and fully refunded when the set is returned in pristine condition.",
      category: "Jewellery",
      active: true,
      display_order: 2,
      created_at: new Date().toISOString(),
    },
  ];

  const generalWhatsappMsg = buildGeneralWhatsAppMsg(settings.business_name);

  return (
    <div className="space-y-20 sm:space-y-28 py-6">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-800 to-brand-950 text-cream-100 py-16 sm:py-24 rounded-3xl mx-4 sm:mx-8 border border-gold-500/30 shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />

        <Container size="md" className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
            <span>{settings.business_name} Artistry &amp; Rentals</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            {settings.hero_title}
          </h1>

          <p className="font-sans text-base sm:text-xl text-cream-200 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            {settings.hero_description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <WhatsAppButton
              fullWidth
              size="lg"
              phoneNumber={settings.whatsapp}
              message={generalWhatsappMsg}
              label="Enquire on WhatsApp"
            />
            <CallButton fullWidth size="lg" phoneNumber={settings.phone} label="Call Now" />
          </div>
        </Container>
      </section>

      {/* 2. BUSINESS INTRODUCTION */}
      <section>
        <Container size="lg">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gold-300/30 shadow-soft grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-semibold uppercase tracking-wider">
                <Sparkle className="w-3.5 h-3.5" />
                <span>Our Heritage &amp; Promise</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-brand-900 leading-tight">
                Crafting Timeless Indian Wedding Memories
              </h2>
              <p className="text-sm sm:text-base text-brand-700 leading-relaxed">
                {settings.about_content}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-cream-50 border border-gold-300/30 text-center space-y-1">
                <div className="font-serif font-bold text-3xl text-gold-700">100%</div>
                <div className="text-xs font-semibold text-brand-900 uppercase tracking-wider">
                  Organic Henna Stain
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-cream-50 border border-gold-300/30 text-center space-y-1">
                <div className="font-serif font-bold text-3xl text-emerald-700">Sanitized</div>
                <div className="text-xs font-semibold text-brand-900 uppercase tracking-wider">
                  Rental Jewellery
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-cream-50 border border-gold-300/30 text-center space-y-1">
                <div className="font-serif font-bold text-3xl text-gold-700">Doorstep</div>
                <div className="text-xs font-semibold text-brand-900 uppercase tracking-wider">
                  Bridal Service
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-cream-50 border border-gold-300/30 text-center space-y-1">
                <div className="font-serif font-bold text-3xl text-brand-900">Direct</div>
                <div className="text-xs font-semibold text-brand-900 uppercase tracking-wider">
                  Call / WhatsApp CTAs
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. FEATURED MEHENDI SERVICES */}
      <section>
        <Container size="lg">
          <SectionHeading
            badge="Featured Henna Packages"
            title="Popular Mehendi Offerings"
            subtitle="Explore our most requested bridal mehendi patterns, engagement vines, and guest henna collections."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const mainImg = service.service_images && service.service_images.length > 0
                ? service.service_images[0].image_url
                : null;
              const whatsappMsg = buildServiceWhatsAppMsg(service.name, settings.business_name);

              return (
                <Card key={service.id} hoverEffect glass className="flex flex-col justify-between">
                  <div>
                    <div className="h-48 bg-gradient-to-tr from-brand-900 to-brand-800 flex items-center justify-center text-gold-300 p-6 relative overflow-hidden">
                      {mainImg ? (
                        <img
                          src={mainImg}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Heart className="w-12 h-12 stroke-1 opacity-80" />
                      )}
                      <span className="absolute top-4 right-4 bg-gold-500 text-brand-950 font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                        {service.category}
                      </span>
                    </div>

                    <CardHeader>
                      <h3 className="font-serif text-2xl font-bold text-brand-900">
                        <Link href={`/services/${service.slug}`}>{service.name}</Link>
                      </h3>
                    </CardHeader>

                    <CardBody>
                      <p className="text-sm text-brand-700 leading-relaxed mb-4">
                        {service.short_description}
                      </p>
                      <div className="text-sm font-semibold text-brand-900 border-t border-cream-200 pt-3">
                        Price: <span className="text-gold-700">{service.price || "Contact for Price"}</span>
                      </div>
                    </CardBody>
                  </div>

                  <CardFooter className="flex-col sm:flex-row gap-2">
                    <WhatsAppButton
                      fullWidth
                      size="sm"
                      label="WhatsApp"
                      phoneNumber={settings.whatsapp}
                      message={whatsappMsg}
                    />
                    <CallButton fullWidth size="sm" phoneNumber={settings.phone} label="Call Now" />
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link href="/services">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-800 text-gold-300 hover:bg-brand-900 font-semibold text-sm shadow-md transition-all">
                <span>View All Mehendi Services</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. FEATURED RENTAL JEWELLERY */}
      <section>
        <Container size="lg">
          <SectionHeading
            badge="Regal Ornaments"
            title="Featured Rental Jewellery Sets"
            subtitle="Pristine Kundan bridal sets, traditional Temple jewellery, and festive chokers available for rent."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jewelleryItems.map((item) => {
              const mainImg = item.jewellery_images && item.jewellery_images.length > 0
                ? item.jewellery_images[0].image_url
                : null;
              const whatsappMsg = buildJewelleryWhatsAppMsg(item.name, settings.business_name);

              return (
                <Card key={item.id} hoverEffect className="flex flex-col justify-between">
                  <div>
                    <div className="h-48 bg-gradient-to-tr from-earth-900 to-earth-800 flex items-center justify-center text-gold-300 p-6 relative overflow-hidden">
                      {mainImg ? (
                        <img
                          src={mainImg}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Gem className="w-12 h-12 stroke-1 opacity-80" />
                      )}
                      <span className="absolute top-4 right-4 bg-emerald-700 text-white font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                        {item.availability_status}
                      </span>
                    </div>

                    <CardHeader>
                      <h3 className="font-serif text-2xl font-bold text-brand-900">
                        <Link href={`/jewellery/${item.slug}`}>{item.name}</Link>
                      </h3>
                    </CardHeader>

                    <CardBody>
                      <p className="text-sm text-brand-700 leading-relaxed mb-4">
                        {item.short_description}
                      </p>
                      <div className="text-sm font-semibold text-brand-900 border-t border-cream-200 pt-3">
                        Rental: <span className="text-emerald-700 font-bold">{item.rental_price ? `₹${item.rental_price} / day` : "Contact for Rate"}</span>
                      </div>
                    </CardBody>
                  </div>

                  <CardFooter className="flex-col sm:flex-row gap-2">
                    <WhatsAppButton
                      fullWidth
                      size="sm"
                      label="Enquire Set"
                      phoneNumber={settings.whatsapp}
                      message={whatsappMsg}
                    />
                    <CallButton fullWidth size="sm" phoneNumber={settings.phone} label="Call Now" />
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link href="/jewellery">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-800 text-gold-300 hover:bg-brand-900 font-semibold text-sm shadow-md transition-all">
                <span>View Full Rental Jewellery Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* 5. PROCESS TIMELINE */}
      <section className="bg-cream-200/50 py-16">
        <Container size="lg">
          <SectionHeading
            badge="Simple 4-Step Booking"
            title="How Booking &amp; Rental Works"
            subtitle="No online checkout or hidden fees. Simple direct WhatsApp or phone call reservation."
          />
          <ProcessTimeline />
        </Container>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      {testimonials.length > 0 && (
        <section>
          <Container size="lg">
            <SectionHeading
              badge="Client Words"
              title="Customer Reviews &amp; Experiences"
              subtitle="Hear from brides and festive clients who loved our mehendi stain quality and rental jewellery."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testi) => (
                <Card key={testi.id} hoverEffect className="p-6 bg-white border-gold-300/30 flex flex-col justify-between">
                  <div className="space-y-4">
                    <Quote className="w-8 h-8 text-gold-500/40" />
                    <p className="text-sm text-brand-800 leading-relaxed italic">
                      "{testi.testimonial}"
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
                    <div className="flex items-center gap-1 text-gold-500">
                      {Array.from({ length: testi.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold-500" />
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="bg-cream-50 py-16 border-y border-gold-300/20">
        <Container size="lg">
          <SectionHeading
            badge="Common Questions"
            title="Frequently Asked Questions"
            subtitle="Got questions about mehendi application time, natural henna stain instructions, or jewellery deposits?"
          />
          <FaqAccordion faqs={faqs} />
        </Container>
      </section>

      {/* 8. CONTACT CTA BANNER */}
      <section>
        <Container size="lg">
          <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 text-cream-100 p-8 sm:p-12 rounded-3xl border border-gold-500/40 text-center shadow-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-500/20 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Ready for Your Big Day?</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white max-w-xl mx-auto leading-tight">
              Book Your Mehendi Artist &amp; Reserve Rental Jewellery Today
            </h2>

            <p className="text-sm sm:text-base text-cream-200 max-w-lg mx-auto leading-relaxed">
              Contact us on WhatsApp or call our studio directly to verify availability and lock in your wedding dates.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-2">
              <WhatsAppButton
                fullWidth
                size="lg"
                phoneNumber={settings.whatsapp}
                message={generalWhatsappMsg}
                label="Enquire on WhatsApp"
              />
              <CallButton fullWidth size="lg" phoneNumber={settings.phone} label="Call Now" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
