import React from "react";
import Link from "next/link";
import { Sparkle, Clock, ArrowRight, Heart, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Service } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { buildServiceWhatsAppMsg } from "@/lib/whatsapp";
import { fetchBusinessSettings } from "@/lib/supabase/helper";

export const metadata = {
  title: "Mehendi Services | Bridal, Arabic, Engagement & Party Henna Art",
  description: "Browse our collection of luxury Indian bridal mehendi, arabic floral patterns, guest party henna packages, and custom traditional designs.",
};

export default async function PublicServicesPage() {
  const supabase = await createClient();
  const settings = await fetchBusinessSettings();

  const { data: servicesData } = await supabase
    .from("services")
    .select("*, service_images(*)")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const services: Service[] = (servicesData as any[]) || [
    {
      id: "sample-1",
      name: "Royal Bridal Mehendi",
      slug: "royal-bridal-mehendi",
      category: "Bridal",
      short_description: "Intricate full-arm and leg bridal henna art featuring custom dulha-dulhan portrait motifs and wedding rituals.",
      description: "Our signature Royal Bridal Mehendi package offers bespoke, highly detailed bridal henna patterns crafted with 100% natural organic henna.",
      price: "Contact for Custom Quote",
      duration: "4 - 6 Hours",
      featured: true,
      active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "sample-2",
      name: "Arabic & Contemporary Mehendi",
      slug: "arabic-contemporary-mehendi",
      category: "Arabic",
      short_description: "Elegant flowing floral vines, shaded mandalas, and modern geometric patterns with rich natural stain contrast.",
      description: "Designed for engagement ceremonies, sangeet, and bridesmaids wanting bold, flowing floral patterns.",
      price: "Starting from ₹2,500",
      duration: "2 - 3 Hours",
      featured: true,
      active: true,
      display_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "sample-3",
      name: "Guest & Party Henna Package",
      slug: "guest-party-henna-package",
      category: "Party",
      short_description: "Fast, exquisite palm and wrist henna patterns for wedding guests and family members.",
      description: "Dedicated speed artist team for group guest henna application during mehendi ceremonies.",
      price: "Starting from ₹500 / person",
      duration: "15 Mins / Person",
      featured: false,
      active: true,
      display_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return (
    <div className="py-12 sm:py-16 space-y-12">
      {/* Hero Heading Banner */}
      <Container size="lg">
        <SectionHeading
          badge="Exquisite Henna Artistry"
          title="Bridal & Festive Mehendi Services"
          subtitle="Handcrafted organic henna designs tailored for brides, engagements, sangeet celebrations, and festive occasions."
        />

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const mainImg = service.service_images && service.service_images.length > 0
              ? service.service_images[0].image_url
              : null;

            const whatsappMsg = buildServiceWhatsAppMsg(service.name, settings.business_name);

            return (
              <Card key={service.id} hoverEffect glass className="flex flex-col justify-between">
                <div>
                  <div className="h-52 bg-gradient-to-tr from-brand-900 to-brand-800 flex items-center justify-center text-gold-300 p-6 relative overflow-hidden">
                    {mainImg ? (
                      <img
                        src={mainImg}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Heart className="w-12 h-12 stroke-1 opacity-80" />
                        <span className="font-serif text-sm tracking-wider uppercase text-gold-400">
                          {service.category} Mehendi
                        </span>
                      </div>
                    )}
                    {service.featured && (
                      <span className="absolute top-4 right-4 bg-gold-500 text-brand-950 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        Featured
                      </span>
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex items-center justify-between text-xs text-gold-700 font-semibold mb-1">
                      <span className="uppercase tracking-wider">{service.category} Collection</span>
                      {service.duration && (
                        <span className="flex items-center gap-1 text-brand-600">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-brand-900 hover:text-gold-700 transition-colors">
                      <Link href={`/services/${service.slug}`}>{service.name}</Link>
                    </h3>
                  </CardHeader>

                  <CardBody>
                    <p className="text-sm text-brand-700 leading-relaxed mb-4">
                      {service.short_description}
                    </p>
                    <div className="text-sm font-semibold text-brand-900 border-t border-cream-200 pt-3">
                      Price: <span className="text-gold-700 font-bold">{service.price || "Contact for Price"}</span>
                    </div>
                  </CardBody>
                </div>

                <CardFooter className="flex-col gap-2.5 pt-4 bg-cream-50/80">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <WhatsAppButton
                      fullWidth
                      size="sm"
                      label="WhatsApp"
                      phoneNumber={settings.whatsapp}
                      message={whatsappMsg}
                    />
                    <CallButton fullWidth size="sm" phoneNumber={settings.phone} label="Call Now" />
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-brand-800 hover:text-gold-700 transition-colors"
                  >
                    <span>View Full Package Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
