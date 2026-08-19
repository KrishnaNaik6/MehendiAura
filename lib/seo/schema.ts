import { BusinessSettings, Service, Jewellery, FAQ } from "@/types/database";

export function getLocalBusinessSchema(settings: BusinessSettings) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mehendiaura.com";

  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: settings.business_name || "MHendi by Mamatha",
    alternateName: [
      "Mamatha Sagara",
      "Mamatha Sagar",
      "Sagara Mehendi",
      "Mamatha Sagara Mehendi",
      "Sagara Rental Jewellary",
      "MHendi Sagara",
      "Mamatha Sagar Rental Jewellary",
    ],
    description:
      settings.hero_description ||
      "Professional Bridal Mehendi Services & Premium Rental Jewellary Studio by Mamatha Sagara in Sagara.",
    url: baseUrl,
    telephone: settings.phone,
    founder: {
      "@type": "Person",
      name: "Mamatha Sagara",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address || "Main Studio & Rental Store, Sagara",
      addressLocality: "Sagara",
      addressRegion: "Karnataka",
      postalCode: "577401",
      addressCountry: "IN",
    },
    keywords:
      "sagara mehendi, mamatha sagara, mamatha sagar, rental jewellary, rental jewellery, mehendi, jewellary, sagara, sagara mehendi artist, MHendi by Mamatha",
    openingHours: "Mo-Su 09:00-21:00",
    priceRange: "₹₹",
    sameAs: [
      settings.instagram_url,
      settings.facebook_url,
      settings.youtube_url,
    ].filter(Boolean),
  };
}

export function getServiceSchema(service: Service, settings: BusinessSettings) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mehendiaura.com";

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.name} in Sagara`,
    description: service.short_description || service.description,
    provider: {
      "@type": "LocalBusiness",
      name: settings.business_name || "MHendi by Mamatha (Mamatha Sagara)",
      telephone: settings.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Sagara",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
    },
    areaServed: [
      {
        "@type": "City",
        name: "Sagara",
      },
      {
        "@type": "Country",
        name: "India",
      },
    ],
    offers: {
      "@type": "Offer",
      price: service.price || "Contact for Price",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/services/${service.slug}`,
    },
  };
}

export function getJewellerySchema(item: Jewellery, settings: BusinessSettings) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mehendiaura.com";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${item.name} - Rental Jewellary Sagara`,
    description: item.short_description || item.description,
    category: item.category,
    brand: {
      "@type": "Brand",
      name: "MHendi by Mamatha Sagara",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: item.rental_price || 1500,
      highPrice: (item.rental_price || 1500) + (item.security_deposit || 2000),
      offerCount: "1",
      availability:
        item.availability_status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${baseUrl}/jewellery/${item.slug}`,
    },
  };
}

export function getFaqSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
