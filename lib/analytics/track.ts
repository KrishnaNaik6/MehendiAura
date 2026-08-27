/**
 * Centralized, Privacy-Conscious Analytics Tracker.
 * Accurately tracks Real Visitors ('visit'), Page Views ('page_view'), Call Clicks ('call_click'),
 * and WhatsApp Clicks ('whatsapp_click') using navigator.sendBeacon and fetch with keepalive.
 */

export type AnalyticsAction =
  | "visit"
  | "page_view"
  | "call_click"
  | "whatsapp_click"
  | string;

export interface EventMetadata {
  pagePath?: string;
  details?: string;
  phoneNumber?: string;
  language?: string;
  [key: string]: any;
}

// In-memory cache to deduplicate rapid duplicate events (e.g. React Strict Mode, double clicks, bubbling)
const recentEventsCache = new Map<string, number>();

function isBot(ua: string): boolean {
  return /bot|crawler|spider|slurp|lighthouse|headless|facebookexternalhit|whatsapp/i.test(
    ua
  );
}

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

/**
 * Retrieves or establishes a stable anonymous session ID.
 * Survives normal page navigation and refreshes.
 * Expires after 30 minutes of inactivity.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server_session";

  const SESSION_KEY = "mh_session_id";
  const LAST_ACTIVE_KEY = "mh_session_last_active";
  const TIMEOUT_MS = 30 * 60 * 1000; // 30 mins inactivity timeout

  const now = Date.now();

  try {
    const existingSession = sessionStorage.getItem(SESSION_KEY);
    const lastActiveStr = sessionStorage.getItem(LAST_ACTIVE_KEY);
    const lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : 0;

    if (existingSession && lastActive && now - lastActive < TIMEOUT_MS) {
      sessionStorage.setItem(LAST_ACTIVE_KEY, now.toString());
      return existingSession;
    }

    // Also link with long-term anonymous visitor ID in localStorage if available
    let visitorSeed = "";
    try {
      visitorSeed = localStorage.getItem("mh_visitor_id") || "";
      if (!visitorSeed) {
        visitorSeed = `v_${now}_${Math.random().toString(36).substring(2, 8)}`;
        localStorage.setItem("mh_visitor_id", visitorSeed);
      }
    } catch {
      visitorSeed = `v_${now}`;
    }

    const newSessionId = `s_${visitorSeed}_${now.toString(36)}`;
    sessionStorage.setItem(SESSION_KEY, newSessionId);
    sessionStorage.setItem(LAST_ACTIVE_KEY, now.toString());
    return newSessionId;
  } catch {
    return `s_temp_${now}`;
  }
}

/**
 * Returns basic device and browser info without fingerprinting
 */
export function getDeviceInfo() {
  if (typeof window === "undefined") {
    return {
      device: "Desktop",
      operatingSystem: "Other",
      browser: "Other",
      deviceName: "Unknown",
      viewportWidth: 0,
      viewportHeight: 0,
    };
  }

  const ua = navigator.userAgent || "";
  const width = window.innerWidth;
  const height = window.innerHeight;

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const device = isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop";

  const operatingSystem = detectOS(ua);
  const browser = detectBrowser(ua);

  let deviceName = `${operatingSystem} • ${browser} • ${device}`;
  if ((navigator as any).userAgentData?.mobile) {
    deviceName = `Mobile (${operatingSystem} • ${browser})`;
  }

  return {
    device,
    operatingSystem,
    browser,
    deviceName,
    viewportWidth: width,
    viewportHeight: height,
  };
}

/**
 * Centralized trackEvent function.
 * Tracks events reliably before navigation using navigator.sendBeacon or fetch(keepalive).
 */
export function trackEvent(
  action: AnalyticsAction,
  metadata: EventMetadata = {}
): void {
  if (typeof window === "undefined") return;

  const ua = navigator.userAgent || "";
  if (isBot(ua)) return;

  const currentPath =
    metadata.pagePath || window.location.pathname || "/";

  // Never track admin portal interactions
  if (currentPath.startsWith("/admin")) return;

  // Deduplicate identical events within 800ms
  const dedupeKey = `${action}:${currentPath}:${metadata.details || ""}`;
  const lastTime = recentEventsCache.get(dedupeKey) || 0;
  const now = Date.now();

  if (now - lastTime < 800) {
    return;
  }
  recentEventsCache.set(dedupeKey, now);

  // Clean cache periodically
  if (recentEventsCache.size > 50) {
    recentEventsCache.forEach((time, key) => {
      if (now - time > 10000) recentEventsCache.delete(key);
    });
  }

  const sessionId = getOrCreateSessionId();
  const deviceInfo = getDeviceInfo();
  const referrer = document.referrer
    ? document.referrer.substring(0, 255)
    : null;

  const payload = {
    sessionId,
    action,
    pagePath: currentPath,
    details: metadata.details || null,
    language: metadata.language || document.documentElement.lang || "en",
    device: deviceInfo.device,
    operatingSystem: deviceInfo.operatingSystem,
    browser: deviceInfo.browser,
    deviceName: deviceInfo.deviceName,
    viewportWidth: deviceInfo.viewportWidth,
    viewportHeight: deviceInfo.viewportHeight,
    referrer,
  };

  const payloadString = JSON.stringify(payload);

  // Strategy 1: navigator.sendBeacon (preferred for external navigation like tel: or WhatsApp)
  let beaconSent = false;
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([payloadString], { type: "application/json" });
      beaconSent = navigator.sendBeacon("/api/analytics/track", blob);
    } catch {
      beaconSent = false;
    }
  }

  // Strategy 2: fetch with keepalive: true (failsafe fallback for browsers that block beacon or lack it)
  if (!beaconSent) {
    try {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payloadString,
        keepalive: true, // Prevents request termination during tel: or WhatsApp transitions!
      }).catch(() => {});
    } catch {
      // Fail silently, never disrupt user UX
    }
  }
}
