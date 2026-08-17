"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { recordVisitorActivity } from "@/app/actions/analytics";

export function VisitorTracker() {
  const pathname = usePathname();
  const { locale } = useLanguage();

  useEffect(() => {
    // 1. Get or create anonymous session ID for visitor tracking
    let sessionId = "";
    try {
      sessionId = localStorage.getItem("mh_visitor_session_id") || "";
      if (!sessionId) {
        sessionId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("mh_visitor_session_id", sessionId);
      }
    } catch {
      sessionId = `vis_temp_${Date.now()}`;
    }

    // 2. Detect device type
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const device = isMobile ? "mobile" : "desktop";

    // 3. Record page view on path change
    if (pathname && !pathname.startsWith("/admin")) {
      recordVisitorActivity({
        sessionId,
        pagePath: pathname,
        action: "page_view",
        language: locale,
        device,
      });
    }

    // 4. Global Event Delegation to catch WhatsApp & Call button clicks
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
          device,
        });
      } else if (href.startsWith("tel:") || textContent.toLowerCase().includes("call")) {
        recordVisitorActivity({
          sessionId,
          pagePath: pathname,
          action: "call_click",
          details: `Call Click on ${pathname}`,
          language: locale,
          device,
        });
      }
    };

    window.addEventListener("click", handleGlobalClick, { capture: true });
    return () => window.removeEventListener("click", handleGlobalClick, { capture: true });
  }, [pathname, locale]);

  return null;
}
