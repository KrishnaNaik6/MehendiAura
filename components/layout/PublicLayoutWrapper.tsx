"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { BusinessSettings } from "@/types/database";

interface PublicLayoutWrapperProps {
  settings: BusinessSettings;
  children: React.ReactNode;
}

export function PublicLayoutWrapper({
  settings,
  children,
}: PublicLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <VisitorTracker />
      <Header settings={settings} />
      <main className="flex-1 pb-24 lg:pb-0">{children}</main>
      <Footer settings={settings} />
      <MobileBottomBar settings={settings} />
    </>
  );
}
