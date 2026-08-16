import React from "react";
import Link from "next/link";
import { Sparkles, Heart, Gem, ArrowRight, Star, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";

export default function Home() {
  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* Hero Section Showcase */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-800 to-brand-950 text-cream-100 py-16 sm:py-24 rounded-3xl mx-4 sm:mx-8 border border-gold-500/30 shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <Container size="md" className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
            <span>Phase 2 — Design System &amp; Luxury Aesthetics</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Exquisite <span className="text-gold-gradient">Mehendi Artistry</span> &amp; Premium Rental Jewellery
          </h1>

          <p className="font-sans text-base sm:text-xl text-cream-200 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Elevate your wedding and festive celebrations with handcrafted mehendi patterns and regal rental jewellery sets curated for brides &amp; festive guests.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <WhatsAppButton
              fullWidth
              size="lg"
              label="Enquire on WhatsApp"
              message="Hi MehendiAura, I am interested in your Mehendi & Jewellery rental services. Please share availability."
            />
            <CallButton fullWidth size="lg" label="Call Now" />
          </div>
        </Container>
      </section>

      {/* Button & UI Palette Showcase Section */}
      <section>
        <Container size="lg">
          <SectionHeading
            badge="UI System Tokens"
            title="Design System Components"
            subtitle="Custom typography, tailored color tokens, button variants, and conversion cards."
          />

          {/* Button Variants Grid */}
          <div className="bg-white p-8 rounded-2xl border border-gold-300/30 shadow-soft mb-12 space-y-6">
            <h3 className="font-serif text-xl font-bold text-brand-900 border-b border-cream-300 pb-3">
              Button Variants &amp; Touch Targets
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary Emerald</Button>
              <Button variant="gold">Royal Gold</Button>
              <Button variant="whatsapp">WhatsApp Button</Button>
              <Button variant="call">Call Button</Button>
              <Button variant="outline">Outline Border</Button>
              <Button variant="secondary">Secondary Cream</Button>
            </div>
          </div>

          {/* Featured Cards Grid Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mehendi Card Sample */}
            <Card hoverEffect glass className="flex flex-col justify-between">
              <div>
                <div className="h-48 bg-gradient-to-tr from-brand-900 to-brand-800 flex items-center justify-center text-gold-300 p-6 relative">
                  <Heart className="w-12 h-12 stroke-1 opacity-80" />
                  <span className="absolute top-4 right-4 bg-gold-500 text-brand-950 font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Popular
                  </span>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between text-xs text-gold-700 font-semibold mb-1">
                    <span>BRIDAL COLLECTION</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" /> 4.9</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-brand-900">Royal Bridal Mehendi</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-brand-700 leading-relaxed mb-4">
                    Intricate full-arm and leg bridal patterns featuring custom dulha-dulhan portraits, radha-krishna motifs, and custom story elements.
                  </p>
                  <div className="text-sm font-semibold text-brand-900">
                    Price: <span className="text-gold-700">Contact for Custom Quote</span>
                  </div>
                </CardBody>
              </div>
              <CardFooter className="flex-col sm:flex-row gap-2">
                <WhatsAppButton
                  fullWidth
                  size="sm"
                  label="WhatsApp"
                  message="Hi MehendiAura, I am interested in the Royal Bridal Mehendi service."
                />
                <CallButton fullWidth size="sm" label="Call Now" />
              </CardFooter>
            </Card>

            {/* Rental Jewellery Card Sample */}
            <Card hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="h-48 bg-gradient-to-tr from-earth-900 to-earth-800 flex items-center justify-center text-gold-300 p-6 relative">
                  <Gem className="w-12 h-12 stroke-1 opacity-80" />
                  <span className="absolute top-4 right-4 bg-emerald-700 text-white font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Available
                  </span>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between text-xs text-gold-700 font-semibold mb-1">
                    <span>TEMPLE JEWELLERY</span>
                    <span>Rental Set</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-brand-900">Kundu Bridal Set</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-brand-700 leading-relaxed mb-4">
                    Complete royal bridal necklace set including choker, long haram, matha patti, jhumkas, and matching vaddanam.
                  </p>
                  <div className="text-sm font-semibold text-brand-900">
                    Rental: <span className="text-emerald-700 font-bold">₹2,500 / day</span>
                  </div>
                </CardBody>
              </div>
              <CardFooter className="flex-col sm:flex-row gap-2">
                <WhatsAppButton
                  fullWidth
                  size="sm"
                  label="Enquire Set"
                  message="Hi MehendiAura, I am interested in renting the Kundu Bridal Set."
                />
                <CallButton fullWidth size="sm" label="Call Now" />
              </CardFooter>
            </Card>

            {/* Why Choose Us Highlight */}
            <Card hoverEffect className="bg-brand-900 text-cream-100 flex flex-col justify-between border-gold-500/40">
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gold-300">Why Choose MehendiAura?</h3>
              </CardHeader>
              <CardBody className="space-y-3 text-sm text-cream-200">
                <p className="leading-relaxed">
                  ✓ 100% Organic, Chemical-Free Natural Henna Cone Stains.
                </p>
                <p className="leading-relaxed">
                  ✓ Sanitized &amp; Pristine Condition Premium Rental Jewellery.
                </p>
                <p className="leading-relaxed">
                  ✓ Doorstep Bridal Service &amp; On-Time Dedicated Artists.
                </p>
              </CardBody>
              <CardFooter className="bg-brand-950/60 border-brand-800">
                <Link
                  href="/about"
                  className="w-full flex items-center justify-between text-xs font-semibold text-gold-300 hover:text-white"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
