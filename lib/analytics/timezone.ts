/**
 * Timezone utilities for Indian Standard Time (IST - Asia/Kolkata).
 * Ensures daily analytics date boundaries and timestamps match the business calendar in India.
 */

export const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Returns YYYY-MM-DD representing the current or given date in Asia/Kolkata.
 * (en-CA locale outputs YYYY-MM-DD format).
 */
export function getIndiaDateString(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: IST_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    // Fallback if Intl fails
    const utcTime = date.getTime();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcTime + istOffsetMs);
    return istDate.toISOString().split("T")[0];
  }
}

/**
 * Returns UTC Date range [startUtc, endUtc] for an exact Indian calendar date (YYYY-MM-DD).
 * For example: "2026-08-27" in IST runs from:
 *   2026-08-27 00:00:00.000 +05:30 -> 2026-08-26 18:30:00.000 UTC
 *   2026-08-27 23:59:59.999 +05:30 -> 2026-08-27 18:29:59.999 UTC
 */
export function getIndiaDayUtcBounds(dateStr: string): { startUtc: string; endUtc: string } {
  // Validate YYYY-MM-DD
  const parts = dateStr.split("-");
  if (parts.length !== 3) {
    const today = getIndiaDateString();
    return getIndiaDayUtcBounds(today);
  }

  const [year, month, day] = parts;
  const pad = (s: string) => s.padStart(2, "0");

  const startUtc = new Date(`${year}-${pad(month)}-${pad(day)}T00:00:00.000+05:30`).toISOString();
  const endUtc = new Date(`${year}-${pad(month)}-${pad(day)}T23:59:59.999+05:30`).toISOString();

  return { startUtc, endUtc };
}

/**
 * Returns UTC range for a date range in Asia/Kolkata
 */
export function getIndiaRangeUtcBounds(
  startDateStr: string,
  endDateStr: string
): { startUtc: string; endUtc: string } {
  const { startUtc } = getIndiaDayUtcBounds(startDateStr);
  const { endUtc } = getIndiaDayUtcBounds(endDateStr);
  return { startUtc, endUtc };
}

/**
 * Formats timestamp to readable Indian time (e.g. "08:42 AM")
 */
export function formatIndiaTime(date: string | Date): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "--:--";

    return new Intl.DateTimeFormat("en-IN", {
      timeZone: IST_TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return "--:--";
  }
}

/**
 * Formats timestamp to readable Indian date (e.g. "27 Aug 2026" or "27 August 2026")
 */
export function formatIndiaDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return typeof date === "string" ? date : "";

    return new Intl.DateTimeFormat("en-IN", {
      timeZone: IST_TIMEZONE,
      day: "numeric",
      month: "short",
      year: "numeric",
      ...options,
    }).format(d);
  } catch {
    return typeof date === "string" ? date : "";
  }
}

/**
 * Get date N days ago in Asia/Kolkata
 */
export function getIndiaDateDaysAgo(daysAgo: number): string {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return getIndiaDateString(past);
}
