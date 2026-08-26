"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import { Service, BusinessSettings } from "@/types/database";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";
import { buildServiceWhatsAppMsg } from "@/lib/whatsapp";
import { Locale } from "@/lib/i18n/config";
import { getLocalizedField } from "@/lib/i18n/getLocalizedField";

interface ServicesCatalogFilterProps {
  services: Service[];
  settings: BusinessSettings;
  locale: Locale;
  dictionary: any;
}

export function ServicesCatalogFilter({
  services,
  settings,
  locale,
  dictionary,
}: ServicesCatalogFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract unique categories dynamically from database services
  const uniqueCategories = [
    "All",
    ...Array.from(new Set(services.map((s) => s.category).filter(Boolean))),
  ];

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter Pills Bar */}
      {uniqueCategories.length > 2 && (
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
          {uniqueCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-brand-900 text-gold-300 border border-gold-400/50 shadow-md scale-105"
                    : "bg-white text-brand-800 border border-gold-300/30 hover:bg-cream-200/60"
                }`}
              >
                {cat === "All" ? dictionary.common.all || "All Services" : cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gold-300/30 p-8 space-y-3">
          <Sparkles className="w-10 h-10 text-gold-600 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-brand-900">
            No services in this category yet.
          </h3>
          <p className="text-xs text-brand-600">
            Please select another category or contact studio directly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const name = getLocalizedField(service, "name", locale);
            const shortDesc = getLocalizedField(service, "short_description", locale);
            const visibleImgs = (service.service_images || [])
              .filter((img) => !img.alt_text?.startsWith("[hidden]"))
              .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

            const mainImg = visibleImgs.length > 0 ? visibleImgs[0].image_url : null;
            const whatsappMsg = buildServiceWhatsAppMsg(name, settings.business_name, locale);

            return (
              <Card key={service.id} hoverEffect glass className="flex flex-col justify-between group border-gold-300/40">
                <div>
                  {/* Full image display with ambient blur backdrop */}
                  <div className="h-52 sm:h-56 bg-brand-950 flex items-center justify-center text-gold-300 relative overflow-hidden group/img">
                    {mainImg ? (
                      <>
                        <img
                          src={mainImg}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110"
                        />
                        <img
                          src={mainImg}
                          alt={name}
                          className="relative z-10 w-full h-full object-contain p-2 group-hover/img:scale-105 transition-transform duration-500"
                        />
                      </>
                    ) : (
                      <Heart className="w-12 h-12 stroke-1 opacity-80" />
                    )}
                    <span className="absolute top-4 right-4 z-20 bg-gold-500 text-brand-950 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {service.category}
                    </span>
                  </div>

                  <CardHeader>
                    <h2 className="font-serif text-2xl font-bold text-brand-900 hover:text-gold-700 transition-colors">
                      <Link href={`/${locale}/services/${service.slug}`}>{name}</Link>
                    </h2>
                  </CardHeader>

                  <CardBody>
                    <p className="text-sm text-brand-700 leading-relaxed mb-4">
                      {shortDesc}
                    </p>
                    <div className="space-y-1 text-xs text-brand-600 border-t border-cream-200 pt-3">
                      {service.duration && (
                        <div>
                          <span className="font-semibold">{dictionary.common.duration}:</span>{" "}
                          {service.duration}
                        </div>
                      )}
                      <div className="text-sm font-semibold text-brand-900 pt-1">
                        {dictionary.common.startingFrom}:{" "}
                        <span className="text-gold-700 font-bold">
                          {service.price || dictionary.common.contactForPrice}
                        </span>
                      </div>
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
                  <CallButton
                    fullWidth
                    size="sm"
                    phoneNumber={settings.phone}
                    label={dictionary.common.callNow}
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
