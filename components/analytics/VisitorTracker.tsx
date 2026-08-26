"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { recordVisitorActivity } from "@/app/actions/analytics";

function detectOS(ua: string): string {
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/win/i.test(ua)) return "Windows";
  if (/mac/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Other";
}

function detectBrowser(ua: string): string {
  if (/edg/i.test(ua)) return "Edge";
  if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua) && !/chrome|crios|edg/i.test(ua)) return "Safari";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  return "Other";
}

function isBot(ua: string): boolean {
  return /bot|crawler|spider|slurp|lighthouse|headless|facebookexternalhit|whatsapp/i.test(ua);
}

export function VisitorTracker() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const lastTrackedRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent || "";
    if (isBot(ua)) return;

    // Ignore admin portal activity
    if (pathname && pathname.startsWith("/admin")) return;

    // Deduplicate rapid React re-renders for same page path
    const trackKey = `${pathname}_${locale}`;
    if (lastTrackedRef.current === trackKey) return;
    lastTrackedRef.current = trackKey;

    // 1. Get or create anonymous session ID
    let sessionId = "";
    try {
      sessionId = sessionStorage.getItem("mh_visitor_session_id") || "";
      if (!sessionId) {
        sessionId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem("mh_visitor_session_id", sessionId);
      }
    } catch {
      sessionId = `vis_temp_${Date.now()}`;
    }

    // 2. Parse device info reliably
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const device_type = isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop";

    const operating_system = detectOS(ua);
    const browser = detectBrowser(ua);

    // Reliable device name extraction (never guess exact model)
    let device_name = `${operating_system} • ${browser} • ${device_type}`;
    if ((navigator as any).userAgentData?.mobile) {
      device_name = `Mobile (${operating_system} • ${browser})`;
    }

    const referrer = document.referrer ? document.referrer.substring(0, 255) : null;

    // 3. Record page view activity
    recordVisitorActivity({
      sessionId,
      pagePath: pathname,
      action: "page_view",
      language: locale,
      device: device_type,
      operatingSystem: operating_system,
      browser,
      deviceName: device_name,
      viewportWidth: width,
      viewportHeight: height,
      referrer,
    });

    // 4. Track WhatsApp & Call button clicks globally
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const link = target.closest("a, button");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const textContent = link.textContent?.trim() || "";

      if (href.includes("wa.me") || href.includes("whatsapp.com") || textContent.toLowerCase().includes("whatsapp")) {
        recordVisitorActivity({
          sessionId,
          pagePath: pathname,
          action: "whatsapp_click",
          details: `WhatsApp Click on ${pathname}`,
          language: locale,
          device: device_type,
          operatingSystem: operating_system,
          browser,
          deviceName: device_name,
          viewportWidth: width,
          viewportHeight: height,
          referrer,
        });
      } else if (href.startsWith("tel:") || textContent.toLowerCase().includes("call")) {
        recordVisitorActivity({
          sessionId,
          pagePath: pathname,
          action: "call_click",
          details: `Call Click on ${pathname}`,
          language: locale,
          device: device_type,
          operatingSystem: operating_system,
          browser,
          deviceName: device_name,
          viewportWidth: width,
          viewportHeight: height,
          referrer,
        });
      }
    };

    window.addEventListener("click", handleGlobalClick, { capture: true });
    return () => window.removeEventListener("click", handleGlobalClick, { capture: true });
  }, [pathname, locale]);

  return null;
}
