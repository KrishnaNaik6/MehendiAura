import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import "./globals.css";

export const metadata: Metadata = {
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
    "Indian Wedding Beauty",
  ],
  authors: [{ name: "MehendiAura" }],
  openGraph: {
    title: "MehendiAura | Professional Mehendi Artist & Rental Jewellery",
    description:
      "Exquisite Bridal & Event Mehendi Services and Premium Rental Jewellery for Special Occasions.",
    type: "website",
    locale: "en_IN",
    siteName: "MehendiAura",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1B3B2B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
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
