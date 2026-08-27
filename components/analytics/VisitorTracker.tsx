"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { trackEvent, getOrCreateSessionId } from "@/lib/analytics/track";

export function VisitorTracker() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const lastTrackedPathRef = useRef<string>("");

  // 1. Initial Visitor Session Tracking + Page Views
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ignore admin portal activity
    if (pathname && pathname.startsWith("/admin")) return;

    // Ensure session ID is initialized
    const sessionId = getOrCreateSessionId();

    // Check if initial 'visit' has been logged for this browser session
    try {
      const visitLogged = sessionStorage.getItem("mh_visit_recorded");
      if (!visitLogged) {
        trackEvent("visit", {
          pagePath: pathname,
          language: locale,
          details: "Initial Website Session Landing",
        });
        sessionStorage.setItem("mh_visit_recorded", "true");
      }
    } catch {
      // Fallback
    }

    // Deduplicate rapid re-renders for same page path
    if (lastTrackedPathRef.current === pathname) return;
    lastTrackedPathRef.current = pathname;

    // Log Page View
    trackEvent("page_view", {
      pagePath: pathname,
      language: locale,
    });
  }, [pathname, locale]);

  // 2. Global Catch-All Delegated Click Listener for Tel and WhatsApp Links
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const link = target.closest("a, button");
      if (!link) return;

      const href = (link.getAttribute("href") || "").trim();
      const ariaLabel = (link.getAttribute("aria-label") || "").toLowerCase();
      const textContent = (link.textContent || "").toLowerCase();

      // Check WhatsApp
      const isWhatsApp =
        href.includes("wa.me") ||
        href.includes("whatsapp.com") ||
        ariaLabel.includes("whatsapp") ||
        textContent.includes("whatsapp");

      // Check Call
      const isCall =
        href.startsWith("tel:") ||
        ariaLabel.includes("call") ||
        textContent.includes("call now") ||
        textContent.includes("call studio");

      if (isWhatsApp) {
        trackEvent("whatsapp_click", {
          pagePath: window.location.pathname,
          details: `Global WhatsApp click: ${href || textContent.substring(0, 50)}`,
        });
      } else if (isCall) {
        trackEvent("call_click", {
          pagePath: window.location.pathname,
          details: `Global Call click: ${href || textContent.substring(0, 50)}`,
        });
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, []);

  return null;
}
