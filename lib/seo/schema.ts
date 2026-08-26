import { BusinessSettings, Service, Jewellery, FAQ } from "@/types/database";

export function getLocalBusinessSchema(settings: BusinessSettings) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mehendiaura.com";

  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: settings.business_name || "Mehendi by Mamatha",
    alternateName: [
      "mehendi by mamatha",
      "MHendi by Mamatha",
      "Mamatha Sagara",
      "Mamatha Sagar",
      "Sagara Mehendi",
      "mahendi in sagara",
      "mehendi in sagara",
      "jewellary rental in sagara",
      "jewellery rental in sagara",
      "mehendi in shivamogga",
      "mahendi in shivamogga",
      "jewellery rental in shivamogga",
      "jewellary rental in shivamogga",
      "mehendi in shimoga",
      "jewellery rental in shimoga",
      "Mamatha Sagara Mehendi",
      "Sagara Rental Jewellary",
      "Shivamogga Mehendi Artist",
    ],
    description:
      settings.hero_description ||
      "Professional Bridal Mehendi Services & Premium Rental Jewellery Studio by Mamatha Sagara serving Sagara and Shivamogga.",
    url: baseUrl,
    telephone: settings.phone,
    founder: {
      "@type": "Person",
      name: "Mamatha Sagara",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address || "Main Studio & Rental Store, Sagara, Shivamogga District",
      addressLocality: "Sagara",
      addressRegion: "Karnataka",
      postalCode: "577401",
      addressCountry: "IN",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Sagara",
      },
      {
        "@type": "City",
        name: "Shivamogga",
      },
      {
        "@type": "City",
        name: "Shimoga",
      },
      {
        "@type": "AdministrativeArea",
        name: "Karnataka",
      },
    ],
    keywords:
      "mehendi by mamatha, mahendi in sagara, mehendi, jewellary rental in sagara, jewellery, mehendi in shivamogga, jewellery rental in shivamogga, sagara mehendi, mamatha sagara, mamatha sagar, rental jewellary, rental jewellery, sagara, shivamogga, shimoga",
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
    name: `${service.name} in Sagara & Shivamogga`,
    description: service.short_description || service.description,
    provider: {
      "@type": "LocalBusiness",
      name: settings.business_name || "Mehendi by Mamatha (Mamatha Sagara)",
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
        "@type": "City",
        name: "Shivamogga",
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
    name: `${item.name} - Rental Jewellery Sagara & Shivamogga`,
    description: item.short_description || item.description,
    category: item.category,
    brand: {
      "@type": "Brand",
      name: "Mehendi by Mamatha Sagara",
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
