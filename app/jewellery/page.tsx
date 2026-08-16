import React from "react";
import Link from "next/link";
import { Gem, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Jewellery } from "@/types/database";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { buildJewelleryWhatsAppMsg } from "@/lib/whatsapp";
import { fetchBusinessSettings } from "@/lib/supabase/helper";

export const metadata = {
  title: "Rental Jewellery Catalog | Royal Bridal & Temple Jewellery Sets",
  description: "Browse our premium rental jewellery catalog featuring Kundan bridal sets, Temple jewellery harams, chokers, bangles, and maang tikkas.",
};

export default async function PublicJewelleryPage() {
  const supabase = await createClient();
  const settings = await fetchBusinessSettings();

  const { data: jewelleryData } = await supabase
    .from("jewellery")
    .select("*, jewellery_images(*)")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const jewelleryItems: Jewellery[] = (jewelleryData as any[]) || [
    {
      id: "sample-j1",
      name: "Kundu & Polki Royal Bridal Set",
      slug: "kundu-polki-royal-bridal-set",
      category: "Bridal Sets",
      short_description: "Regal Kundan necklace set with matching long haram, matha patti, jhumkas, and waist belt.",
      description: "Handcrafted premium Kundan bridal rental set plated in 22K gold finish...",
      rental_price: 2500,
      security_deposit: 3000,
      availability_status: "available",
      included_items: ["Royal Choker Necklace", "Long Layered Haram", "Matha Patti", "Matching Jhumka Earrings", "Vaddanam Waist Belt"],
      featured: true,
      active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "sample-j2",
      name: "South Indian Temple Heritage Set",
      slug: "south-indian-temple-heritage-set",
      category: "Temple Jewellery",
      short_description: "Traditional matte gold temple jewellery set with Lakshmi motifs and ruby green stones.",
      description: "Authentic South Indian temple rental jewellery set featuring divine Lakshmi pendants...",
      rental_price: 1800,
      security_deposit: 2000,
      availability_status: "available",
      included_items: ["Short Temple Choker", "Long Mango Haram", "Temple Jhumkas", "Maang Tikka"],
      featured: true,
      active: true,
      display_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return (
    <div className="py-12 sm:py-16 space-y-12">
      {/* Hero Heading Banner */}
      <Container size="lg">
        <SectionHeading
          badge="Regal Bridal & Festive Ornaments"
          title="Rental Jewellery Catalog"
          subtitle="Sanitised, pristine condition premium bridal sets, temple jewellery, and festive accessories available for rent."
        />

        {/* Rental Jewellery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jewelleryItems.map((item) => {
            const mainImg = item.jewellery_images && item.jewellery_images.length > 0
              ? item.jewellery_images[0].image_url
              : null;

            const whatsappMsg = buildJewelleryWhatsAppMsg(item.name, settings.business_name);

            return (
              <Card key={item.id} hoverEffect className="flex flex-col justify-between">
                <div>
                  <div className="h-56 bg-gradient-to-tr from-earth-900 via-earth-800 to-brand-900 flex items-center justify-center text-gold-300 p-6 relative overflow-hidden">
                    {mainImg ? (
                      <img
                        src={mainImg}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Gem className="w-12 h-12 stroke-1 opacity-80" />
                        <span className="font-serif text-sm tracking-wider uppercase text-gold-400">
                          {item.category}
                        </span>
                      </div>
                    )}
                    <span
                      className={`absolute top-4 right-4 text-white font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md ${
                        item.availability_status === "available"
                          ? "bg-emerald-700"
                          : item.availability_status === "booked"
                          ? "bg-gold-700"
                          : "bg-red-700"
                      }`}
                    >
                      {item.availability_status}
                    </span>
                  </div>

                  <CardHeader>
                    <div className="flex items-center justify-between text-xs text-gold-700 font-semibold mb-1">
                      <span className="uppercase tracking-wider">{item.category}</span>
                      <span>Rental Collection</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-brand-900 hover:text-gold-700 transition-colors">
                      <Link href={`/jewellery/${item.slug}`}>{item.name}</Link>
                    </h3>
                  </CardHeader>

                  <CardBody>
                    <p className="text-sm text-brand-700 leading-relaxed mb-4">
                      {item.short_description}
                    </p>

                    <div className="space-y-1.5 border-t border-cream-200 pt-3 text-sm font-semibold">
                      <div className="flex items-center justify-between">
                        <span className="text-brand-700 text-xs uppercase tracking-wider">Rental Rate:</span>
                        <span className="text-emerald-700 font-bold text-base">
                          {item.rental_price ? `₹${item.rental_price} / day` : "Contact for Rate"}
                        </span>
                      </div>
                      {item.security_deposit && (
                        <div className="flex items-center justify-between text-xs text-brand-600 font-normal">
                          <span>Refundable Deposit:</span>
                          <span>₹{item.security_deposit}</span>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </div>

                <CardFooter className="flex-col gap-2.5 pt-4 bg-cream-50/80">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <WhatsAppButton
                      fullWidth
                      size="sm"
                      label="Enquire Set"
                      phoneNumber={settings.whatsapp}
                      message={whatsappMsg}
                    />
                    <CallButton fullWidth size="sm" phoneNumber={settings.phone} label="Call Now" />
                  </div>
                  <Link
                    href={`/jewellery/${item.slug}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-brand-800 hover:text-gold-700 transition-colors"
                  >
                    <span>View Included Items &amp; Deposit Policy</span>
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
