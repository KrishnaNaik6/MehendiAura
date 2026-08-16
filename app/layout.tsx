import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { fetchBusinessSettings } from "@/lib/supabase/helper";
import { getLocalBusinessSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mehendiaura.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MehendiAura | Professional Mehendi Artist & Rental Jewellery",
    template: "%s | MehendiAura",
  },
  description:
    "Exquisite Bridal & Event Mehendi Services and Premium Rental Jewellery for Weddings, Engagements & Special Occasions.",
  keywords: [
    "Mehendi Artist",
    "Bridal Mehendi",
    "Rental Jewellery",
    "Wedding Jewellery Rental",
    "Kundan Jewellery Rental",
    "Indian Wedding Beauty",
    "Henna Artist",
  ],
  authors: [{ name: "MehendiAura" }],
  openGraph: {
    title: "MehendiAura | Professional Mehendi Artist & Rental Jewellery",
    description:
      "Exquisite Bridal & Event Mehendi Services and Premium Rental Jewellery for Special Occasions.",
    type: "website",
    locale: "en_IN",
    siteName: "MehendiAura",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "MehendiAura | Professional Mehendi Artist & Rental Jewellery",
    description: "Exquisite Bridal & Event Mehendi Services and Premium Rental Jewellery.",
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
      </head>
      <body className="min-h-screen bg-cream-100 text-brand-800 antialiased flex flex-col selection:bg-gold-500 selection:text-white">
        <Toaster position="top-right" richColors />
        <Header />
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        <Footer />
        <MobileBottomBar />
      </body>
    </html>
  );
}
