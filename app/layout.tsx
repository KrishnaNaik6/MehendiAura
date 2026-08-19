import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { getLocalBusinessSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { LanguageProvider } from "@/lib/i18n/context";
import { PublicLayoutWrapper } from "@/components/layout/PublicLayoutWrapper";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mehendiaura.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MHendi by Mamatha | Sagara Mehendi & Rental Jewellary | Mamatha Sagara",
    template: "%s | MHendi by Mamatha (Sagara)",
  },
  description:
    "MHendi by Mamatha (Mamatha Sagara / Mamatha Sagar) offers professional Bridal Mehendi Services and Premium Rental Jewellary in Sagara. Book exquisite Henna designs & Kundan / Temple jewellery sets in Sagara.",
  keywords: [
    // Direct requested keywords & exact cases
    "sagara mehendi",
    "Sagara Mehendi",
    "SAGARA MEHENDI",
    "mamatha sagara",
    "Mamatha Sagara",
    "MAMATHA SAGARA",
    "mamatha sagar",
    "Mamatha Sagar",
    "MAMATHA SAGAR",
    "rental jewellary",
    "Rental Jewellary",
    "RENTAL JEWELLARY",
    "rental jewellery",
    "Rental Jewellery",
    "RENTAL JEWELLERY",
    "mehendi",
    "Mehendi",
    "MEHENDI",
    "mehndi",
    "Mehndi",
    "MHendi",
    "jewellary",
    "Jewellary",
    "JEWELLARY",
    "jewellery",
    "Jewellery",
    "JEWELLERY",
    "jewelry",
    "Jewelry",
    "sagara",
    "Sagara",
    "SAGARA",
    "sagar",
    "Sagar",
    
    // Key Intent Combinations for Search Engine Optimization
    "MHendi by Mamatha",
    "MHendi by Mamatha Sagara",
    "Mamatha Sagara Mehendi Artist",
    "Mamatha Sagar Mehendi Artist",
    "Sagara Mehendi Artist",
    "Sagara Rental Jewellary",
    "Sagara Rental Jewellery",
    "Mamatha Sagara Rental Jewellary",
    "Mamatha Sagar Rental Jewellery",
    "Bridal Mehendi Sagara",
    "Wedding Jewellary Rental Sagara",
    "Kundan Jewellery Rental Sagara",
    "Temple Jewellary Sagara",
    "Best Mehendi Artist in Sagara",
    "Top Rental Jewellary in Sagara",
    "Sagara Bridal Henna",
    
    // Kannada Translations & Local Script Search Terms
    "ಸಾಗರ ಮೆಹೆಂದಿ",
    "ಮಮತಾ ಸಾಗರ",
    "ಮಮತಾ ಸಾಗರ ಮೆಹೆಂದಿ",
    "ಬಾಡಿಗೆ ಆಭರಣಗಳು ಸಾಗರ",
    "ಸಾಗರ ಮೆಹೆಂದಿ ಕಲಾವಿದರು",
  ],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  authors: [{ name: "Mamatha Sagara" }, { name: "MHendi by Mamatha" }],
  openGraph: {
    title: "MHendi by Mamatha | Sagara Mehendi & Rental Jewellary | Mamatha Sagara",
    description:
      "MHendi by Mamatha (Mamatha Sagara / Mamatha Sagar) - Premier Bridal Mehendi & Rental Jewellary Studio in Sagara.",
    type: "website",
    locale: "en_IN",
    siteName: "MHendi by Mamatha Sagara",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "MHendi by Mamatha | Sagara Mehendi & Rental Jewellary | Mamatha Sagara",
    description: "Bridal Mehendi Services & Premium Rental Jewellary by Mamatha Sagara in Sagara.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1B3B2B",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchBusinessSettings();
  const localBusinessSchema = getLocalBusinessSchema(settings);

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <JsonLd data={localBusinessSchema} />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="min-h-screen bg-cream-100 text-brand-800 antialiased flex flex-col selection:bg-gold-500 selection:text-white">
        <LanguageProvider>
          <Toaster position="top-right" richColors />
          <PublicLayoutWrapper settings={settings}>{children}</PublicLayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
