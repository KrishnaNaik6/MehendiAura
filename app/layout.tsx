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
    default: "Mehendi by Mamatha | Sagara & Shivamogga Mehendi & Jewellery Rental | Mamatha Sagara",
    template: "%s | Mehendi by Mamatha (Sagara & Shivamogga)",
  },
  description:
    "Mehendi by Mamatha (Mamatha Sagara / Mamatha Sagar) offers premier Bridal Mehendi Services & Jewellery Rental in Sagara and Shivamogga. Book organic henna designs & Kundan / Temple rental jewellery sets in Sagara & Shivamogga.",
  keywords: [
    // 1. Direct Requested Target Keywords & Letter Case Variations
    "mehendi by mamatha",
    "Mehendi by Mamatha",
    "MEHENDI BY MAMATHA",
    "MHendi by Mamatha",
    "mahendi in sagara",
    "Mahendi in Sagara",
    "MAHENDI IN SAGARA",
    "mehendi in sagara",
    "Mehendi in Sagara",
    "MEHENDI IN SAGARA",
    "mehendi",
    "Mehendi",
    "MEHENDI",
    "mahendi",
    "Mahendi",
    "jewellary rental in sagara",
    "Jewellary Rental in Sagara",
    "JEWELLARY RENTAL IN SAGARA",
    "jewellery rental in sagara",
    "Jewellery Rental in Sagara",
    "JEWELLERY RENTAL IN SAGARA",
    "jewellery",
    "Jewellery",
    "JEWELLERY",
    "jewellary",
    "Jewellary",
    "JEWELLARY",
    "mehendi in shivamogga",
    "Mehendi in Shivamogga",
    "MEHENDI IN SHIVAMOGGA",
    "mahendi in shivamogga",
    "Mahendi in Shivamogga",
    "MAHENDI IN SHIVAMOGGA",
    "jewellery rental in shivamogga",
    "Jewellery Rental in Shivamogga",
    "JEWELLERY RENTAL IN SHIVAMOGGA",
    "jewellary rental in shivamogga",
    "Jewellary Rental in Shivamogga",
    "JEWELLARY RENTAL IN SHIVAMOGGA",
    "mehendi in shimoga",
    "Mehendi in Shimoga",
    "jewellery rental in shimoga",
    "Jewellery Rental in Shimoga",
    "sagara",
    "Sagara",
    "SAGARA",
    "shivamogga",
    "Shivamogga",
    "SHIVAMOGGA",
    "shimoga",
    "Shimoga",

    // 2. Artist & Brand Combinations
    "mamatha sagara",
    "Mamatha Sagara",
    "MAMATHA SAGARA",
    "mamatha sagar",
    "Mamatha Sagar",
    "MAMATHA SAGAR",
    "mamatha sagara mehendi",
    "Mamatha Sagara Mehendi Artist",
    "sagara mehendi",
    "Sagara Mehendi",
    "SAGARA MEHENDI",
    "sagara mehendi artist",
    "mehendi artist in shivamogga",
    "mehendi artist in sagara",
    "bridal mehendi shivamogga",
    "bridal mehendi sagara",
    "rental jewellery shivamogga",
    "rental jewellery sagara",
    "kundan jewellery rental sagara",
    "temple jewellery rental shivamogga",

    // 3. Kannada Local Script Keywords
    "ಸಾಗರ ಮೆಹೆಂದಿ",
    "ಶಿವಮೊಗ್ಗ ಮೆಹೆಂದಿ",
    "ಮಮತಾ ಸಾಗರ",
    "ಮಮತಾ ಸಾಗರ ಮೆಹೆಂದಿ",
    "ಸಾಗರ ಬಾಡಿಗೆ ಆಭರಣಗಳು",
    "ಶಿವಮೊಗ್ಗ ಬಾಡಿಗೆ ಆಭರಣಗಳು",
  ],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  authors: [{ name: "Mamatha Sagara" }, { name: "Mehendi by Mamatha" }],
  openGraph: {
    title: "Mehendi by Mamatha | Sagara & Shivamogga Mehendi & Jewellery Rental",
    description:
      "Mehendi by Mamatha (Mamatha Sagara) - Premier Bridal Mehendi Services & Rental Jewellery in Sagara and Shivamogga.",
    type: "website",
    locale: "en_IN",
    siteName: "Mehendi by Mamatha Sagara",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehendi by Mamatha | Sagara & Shivamogga Mehendi & Jewellery Rental",
    description: "Bridal Mehendi Services & Premium Rental Jewellery by Mamatha Sagara in Sagara & Shivamogga.",
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
