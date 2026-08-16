"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Phone, MessageSquare, MapPin, Clock, Lock, Instagram, Facebook, Youtube } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useLanguage } from "@/lib/i18n/context";
import { getWhatsAppUrl, buildGeneralWhatsAppMsg } from "@/lib/whatsapp";
import { getCallUrl } from "@/lib/call";
import { BusinessSettings } from "@/types/database";

interface FooterProps {
  settings?: BusinessSettings;
}

export function Footer({ settings }: FooterProps) {
  const { locale, dictionary } = useLanguage();

  const phone = settings?.phone || process.env.NEXT_PUBLIC_DEFAULT_PHONE || "+919876543210";
  const whatsappNumber = settings?.whatsapp || process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "919876543210";
  const businessName = settings?.business_name || "MehendiAura";
  const address = settings?.address || "Main Studio & Rental Store, City Center";
  const hours = settings?.business_hours || "Mon - Sun: 9:00 AM - 9:00 PM";

  const whatsappUrl = getWhatsAppUrl(whatsappNumber, buildGeneralWhatsAppMsg(businessName, locale));
  const callUrl = getCallUrl(phone);

  return (
    <footer className="bg-brand-950 text-cream-200 pt-16 pb-24 lg:pb-12 border-t border-gold-500/20">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-brand-800">
          {/* Brand Info Column */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-950" />
              </div>
              <span className="font-serif text-2xl tracking-wide text-gold-300 font-bold">
                {businessName}
              </span>
            </Link>
            <p className="text-sm text-cream-300 leading-relaxed">
              {dictionary.common.tagline}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={callUrl}
                className="w-9 h-9 rounded-full bg-brand-800 border border-gold-500/30 flex items-center justify-center text-gold-300 hover:bg-gold-500 hover:text-brand-950 transition-colors"
                aria-label="Call Business"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white hover:bg-emerald-500 transition-colors"
                aria-label="WhatsApp Business"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-brand-800 border border-gold-500/30 flex items-center justify-center text-pink-400 hover:bg-pink-600 hover:text-white transition-colors"
                  aria-label="Instagram Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-serif text-lg font-bold text-gold-300 mb-4 pb-2 border-b border-gold-500/20 inline-block">
              {dictionary.nav.home}
            </h3>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li>
                <Link href={`/${locale}`} className="hover:text-gold-300 transition-colors">
                  {dictionary.nav.home}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services`} className="hover:text-gold-300 transition-colors">
                  {dictionary.nav.services}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/jewellery`} className="hover:text-gold-300 transition-colors">
                  {dictionary.nav.jewellery}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/gallery`} className="hover:text-gold-300 transition-colors">
                  {dictionary.nav.gallery}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="hover:text-gold-300 transition-colors">
                  {dictionary.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-gold-300 transition-colors">
                  {dictionary.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Services Column */}
          <div>
            <h3 className="font-serif text-lg font-bold text-gold-300 mb-4 pb-2 border-b border-gold-500/20 inline-block">
              {dictionary.common.mehendi} &amp; {dictionary.common.jewellery}
            </h3>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li>{dictionary.common.bridal} {dictionary.common.mehendi}</li>
              <li>Arabic &amp; Contemporary Henna</li>
              <li>Guest &amp; Party Henna</li>
              <li>Bridal Jewellery Sets</li>
              <li>Temple &amp; Choker Sets</li>
              <li>Maang Tikka &amp; Vaddanam</li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-gold-300 mb-4 pb-2 border-b border-gold-500/20 inline-block">
              {dictionary.nav.contact}
            </h3>
            <div className="flex items-start gap-3 text-sm text-cream-300">
              <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
              <span>{phone}</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-cream-300">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
              <span>{dictionary.common.enquireWhatsapp}</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-cream-300">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
              <span>{address}</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-cream-300">
              <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
              <span>{hours}</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400">
          <p>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-cream-300 hover:text-gold-300 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{dictionary.nav.adminLogin}</span>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
