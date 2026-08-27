"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { VisitorLog } from "@/types/database";
import {
  getIndiaDateString,
  getIndiaDayUtcBounds,
  getIndiaRangeUtcBounds,
  getIndiaDateDaysAgo,
  formatIndiaDate,
} from "@/lib/analytics/timezone";

export interface AnalyticsFilterOptions {
  period?: "today" | "yesterday" | "single_date" | "7days" | "30days" | "all" | "custom";
  selectedDate?: string; // "YYYY-MM-DD" for single day view
  startDate?: string;    // "YYYY-MM-DD"
  endDate?: string;      // "YYYY-MM-DD"
  deviceType?: string;
  operatingSystem?: string;
  browser?: string;
  pagePath?: string;
  page?: number;
  pageSize?: number;
}

export interface PopularPageStat {
  path: string;
  views: number;
  percentage: number;
}

export interface BreakdownStat {
  label: string;
  count: number;
  percentage: number;
}

export interface DailyChartPoint {
  dateStr: string;  // "YYYY-MM-DD"
  dateLabel: string; // "27 Aug"
  visitors: number;
  pageViews: number;
  calls: number;
  whatsapp: number;
}

export interface DailyVisitorRow {
  dateStr: string;   // "YYYY-MM-DD"
  dateLabel: string; // "27 Aug 2026"
  visitors: number;
  pageViews: number;
  calls: number;
  whatsapp: number;
}

export interface ComprehensiveAnalyticsData {
  // Current Filtered Period Metrics
  periodLabel: string;
  isSingleDay: boolean;
  selectedDate?: string;
  visitors: number;
  pageViews: number;
  callClicks: number;
  whatsappClicks: number;

  // Comparison Indicators (Today vs Yesterday)
  todayVisitors: number;
  todayViews: number;
  todayCalls: number;
  todayWhatsapp: number;

  yesterdayVisitors: number;
  yesterdayViews: number;
  yesterdayCalls: number;
  yesterdayWhatsapp: number;

  last7DaysVisitors: number;
  last7DaysViews: number;
  last30DaysVisitors: number;
  last30DaysViews: number;

  totalVisitorsStored: number;
  totalPageViewsStored: number;

  // Tables and Breakdowns
  dailyTable: DailyVisitorRow[];
  dailyChart: DailyChartPoint[];
  popularPages: PopularPageStat[];
  deviceBreakdown: BreakdownStat[];
  osBreakdown: BreakdownStat[];
  browserBreakdown: BreakdownStat[];
  recentLogs: VisitorLog[];
  totalLogCount: number;
  currentPage: number;
  totalPages: number;
}

export interface MonthlyStat {
  monthKey: string;
  monthName: string;
  pageViews: number;
  uniqueVisitors: number;
  whatsappClicks: number;
  callClicks: number;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  totalUniqueVisitors: number;
  todayPageViews: number;
  todayUniqueVisitors: number;
  whatsappClicks: number;
  callClicks: number;
  monthlyStats: MonthlyStat[];
  availableMonths: { monthKey: string; monthName: string }[];
  recentLogs: VisitorLog[];
}

export async function recordVisitorActivity(payload: {
  sessionId: string;
  pagePath: string;
  action: "visit" | "page_view" | "whatsapp_click" | "call_click" | string;
  details?: string;
  language?: string;
  device?: string;
  operatingSystem?: string;
  browser?: string;
  deviceName?: string;
  viewportWidth?: number;
  viewportHeight?: number;
  referrer?: string | null;
}) {
  try {
    const supabase = await createClient();

    // Prevent logging admin portal activity
    if (payload.pagePath.startsWith("/admin")) {
      return { success: true };
    }

    const now = new Date();
    const visitDate = getIndiaDateString(now); // Exact YYYY-MM-DD in Asia/Kolkata!

    const insertData: Record<string, any> = {
      session_id: payload.sessionId,
      page_path: payload.pagePath,
      action: payload.action,
      details: payload.details || null,
      language: payload.language || "en",
      device: payload.device || "Desktop",
      operating_system: payload.operatingSystem || "Other",
      browser: payload.browser || "Other",
      device_name: payload.deviceName || "Unknown",
      viewport_width: payload.viewportWidth || null,
      viewport_height: payload.viewportHeight || null,
      referrer: payload.referrer || null,
      visited_at: now.toISOString(),
      visit_date: visitDate,
    };

    const { error } = await supabase.from("visitor_logs").insert(insertData);

    if (error) {
      // Safe fallback for older table schemas missing optional columns
      await supabase.from("visitor_logs").insert({
        session_id: payload.sessionId,
        page_path: payload.pagePath,
        action: payload.action,
        details: payload.details || null,
        language: payload.language || "en",
        device: payload.device || "Desktop",
      });
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchComprehensiveAnalytics(
  filters: AnalyticsFilterOptions = {}
): Promise<ComprehensiveAnalyticsData> {
  try {
    const supabase = await createClient();

    // 1. AUTOMATIC 365-DAY DATA RETENTION CLEANUP
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 365);
    try {
      await supabase
        .from("visitor_logs")
        .delete()
        .lt("created_at", cutoffDate.toISOString());
    } catch {
      // Silently proceed if retention cleanup has restricted permissions
    }

    const todayStr = getIndiaDateString();
    const yesterdayStr = getIndiaDateDaysAgo(1);

    // Determine query date bounds in Asia/Kolkata
    let startUtc = "";
    let endUtc = "";
    let periodLabel = "Last 30 Days";
    let isSingleDay = false;
    let selectedDateForDisplay = "";

    const activePeriod = filters.period || "30days";

    if (activePeriod === "today") {
      isSingleDay = true;
      selectedDateForDisplay = todayStr;
      periodLabel = `Today (${formatIndiaDate(todayStr)})`;
      const bounds = getIndiaDayUtcBounds(todayStr);
      startUtc = bounds.startUtc;
      endUtc = bounds.endUtc;
    } else if (activePeriod === "yesterday") {
      isSingleDay = true;
      selectedDateForDisplay = yesterdayStr;
      periodLabel = `Yesterday (${formatIndiaDate(yesterdayStr)})`;
      const bounds = getIndiaDayUtcBounds(yesterdayStr);
      startUtc = bounds.startUtc;
      endUtc = bounds.endUtc;
    } else if (activePeriod === "single_date" && filters.selectedDate) {
      isSingleDay = true;
      selectedDateForDisplay = filters.selectedDate;
      periodLabel = formatIndiaDate(filters.selectedDate);
      const bounds = getIndiaDayUtcBounds(filters.selectedDate);
      startUtc = bounds.startUtc;
      endUtc = bounds.endUtc;
    } else if (activePeriod === "7days") {
      const startDay = getIndiaDateDaysAgo(6);
      periodLabel = `Last 7 Days (${formatIndiaDate(startDay)} - ${formatIndiaDate(todayStr)})`;
      const bounds = getIndiaRangeUtcBounds(startDay, todayStr);
      startUtc = bounds.startUtc;
      endUtc = bounds.endUtc;
    } else if (activePeriod === "custom" && filters.startDate && filters.endDate) {
      if (filters.startDate === filters.endDate) {
        isSingleDay = true;
        selectedDateForDisplay = filters.startDate;
        periodLabel = formatIndiaDate(filters.startDate);
      } else {
        periodLabel = `${formatIndiaDate(filters.startDate)} - ${formatIndiaDate(filters.endDate)}`;
      }
      const bounds = getIndiaRangeUtcBounds(filters.startDate, filters.endDate);
      startUtc = bounds.startUtc;
      endUtc = bounds.endUtc;
    } else if (activePeriod === "all") {
      periodLabel = "All History (Last 365 Days)";
      const startDay = getIndiaDateDaysAgo(365);
      const bounds = getIndiaRangeUtcBounds(startDay, todayStr);
      startUtc = bounds.startUtc;
      endUtc = bounds.endUtc;
    } else {
      // Default: 30 days
      const startDay = getIndiaDateDaysAgo(29);
      periodLabel = `Last 30 Days (${formatIndiaDate(startDay)} - ${formatIndiaDate(todayStr)})`;
      const bounds = getIndiaRangeUtcBounds(startDay, todayStr);
      startUtc = bounds.startUtc;
      endUtc = bounds.endUtc;
    }

    // 2. Query logs bounded by Indian Standard Time UTC range (Requirement 13: Database-side filtering)
    let query = supabase
      .from("visitor_logs")
      .select("*")
      .gte("created_at", startUtc)
      .lte("created_at", endUtc)
      .order("created_at", { ascending: false })
      .limit(5000);

    if (filters.deviceType && filters.deviceType !== "all") {
      query = query.eq("device", filters.deviceType);
    }
    if (filters.operatingSystem && filters.operatingSystem !== "all") {
      query = query.eq("operating_system", filters.operatingSystem);
    }
    if (filters.browser && filters.browser !== "all") {
      query = query.eq("browser", filters.browser);
    }
    if (filters.pagePath && filters.pagePath !== "all") {
      query = query.eq("page_path", filters.pagePath);
    }

    const { data: rawData } = await query;
    const filteredLogs: VisitorLog[] = rawData || [];

    // 3. Compute Today & Yesterday comparison stats via separate focused queries
    const todayBounds = getIndiaDayUtcBounds(todayStr);
    const yesterdayBounds = getIndiaDayUtcBounds(yesterdayStr);

    const [{ data: todayRaw }, { data: yesterdayRaw }] = await Promise.all([
      supabase
        .from("visitor_logs")
        .select("session_id, action")
        .gte("created_at", todayBounds.startUtc)
        .lte("created_at", todayBounds.endUtc),
      supabase
        .from("visitor_logs")
        .select("session_id, action")
        .gte("created_at", yesterdayBounds.startUtc)
        .lte("created_at", yesterdayBounds.endUtc),
    ]);

    const todayList = todayRaw || [];
    const todayVisitors = new Set(
      todayList.filter((l) => l.action === "visit" || l.action === "page_view").map((l) => l.session_id)
    ).size;
    const todayViews = todayList.filter((l) => l.action === "page_view").length;
    const todayCalls = todayList.filter((l) => l.action === "call_click").length;
    const todayWhatsapp = todayList.filter((l) => l.action === "whatsapp_click").length;

    const yesterdayList = yesterdayRaw || [];
    const yesterdayVisitors = new Set(
      yesterdayList.filter((l) => l.action === "visit" || l.action === "page_view").map((l) => l.session_id)
    ).size;
    const yesterdayViews = yesterdayList.filter((l) => l.action === "page_view").length;
    const yesterdayCalls = yesterdayList.filter((l) => l.action === "call_click").length;
    const yesterdayWhatsapp = yesterdayList.filter((l) => l.action === "whatsapp_click").length;

    // 4. Compute Accurate Unmixed Metrics for Selected Period (Requirement 6)
    // - Unique visitors: count of distinct sessions that had a visit or page_view
    const visitors = new Set(
      filteredLogs.filter((l) => l.action === "visit" || l.action === "page_view").map((l) => l.session_id)
    ).size;
    // - Page views: count of page_view actions only
    const pageViews = filteredLogs.filter((l) => l.action === "page_view").length;
    // - Call clicks: count of call_click actions only
    const callClicks = filteredLogs.filter((l) => l.action === "call_click").length;
    // - WhatsApp clicks: count of whatsapp_click actions only
    const whatsappClicks = filteredLogs.filter((l) => l.action === "whatsapp_click").length;

    // 5. Compute Daily Visitor Table and Chart Points (Requirement 10)
    const dailyMap = new Map<string, VisitorLog[]>();
    filteredLogs.forEach((log) => {
      // Group by exact Indian calendar date
      const dStr = log.visit_date || getIndiaDateString(new Date(log.created_at));
      if (!dailyMap.has(dStr)) {
        dailyMap.set(dStr, []);
      }
      dailyMap.get(dStr)!.push(log);
    });

    const sortedDatesAsc = Array.from(dailyMap.keys()).sort();
    const sortedDatesDesc = [...sortedDatesAsc].reverse();

    const dailyChart: DailyChartPoint[] = sortedDatesAsc.map((dStr) => {
      const logs = dailyMap.get(dStr) || [];
      const dayVisitors = new Set(
        logs.filter((l) => l.action === "visit" || l.action === "page_view").map((l) => l.session_id)
      ).size;
      const dayViews = logs.filter((l) => l.action === "page_view").length;
      const dayCalls = logs.filter((l) => l.action === "call_click").length;
      const dayWhatsapp = logs.filter((l) => l.action === "whatsapp_click").length;

      return {
        dateStr: dStr,
        dateLabel: formatIndiaDate(dStr, { day: "numeric", month: "short" }),
        visitors: dayVisitors,
        pageViews: dayViews,
        calls: dayCalls,
        whatsapp: dayWhatsapp,
      };
    });

    const dailyTable: DailyVisitorRow[] = sortedDatesDesc.map((dStr) => {
      const logs = dailyMap.get(dStr) || [];
      const dayVisitors = new Set(
        logs.filter((l) => l.action === "visit" || l.action === "page_view").map((l) => l.session_id)
      ).size;
      const dayViews = logs.filter((l) => l.action === "page_view").length;
      const dayCalls = logs.filter((l) => l.action === "call_click").length;
      const dayWhatsapp = logs.filter((l) => l.action === "whatsapp_click").length;

      return {
        dateStr: dStr,
        dateLabel: formatIndiaDate(dStr),
        visitors: dayVisitors,
        pageViews: dayViews,
        calls: dayCalls,
        whatsapp: dayWhatsapp,
      };
    });

    // 6. Compute Popular Pages (using page_view events only)
    const pageMap = new Map<string, number>();
    filteredLogs
      .filter((l) => l.action === "page_view")
      .forEach((l) => {
        pageMap.set(l.page_path, (pageMap.get(l.page_path) || 0) + 1);
      });

    const totalViewsCount = pageViews || 1;
    const popularPages: PopularPageStat[] = [];
    pageMap.forEach((count, path) => {
      popularPages.push({
        path,
        views: count,
        percentage: parseFloat(((count / totalViewsCount) * 100).toFixed(1)),
      });
    });
    popularPages.sort((a, b) => b.views - a.views);

    // 7. Compute Device Breakdown
    const deviceMap = new Map<string, number>();
    filteredLogs.forEach((l) => {
      const dev = l.device || "Desktop";
      deviceMap.set(dev, (deviceMap.get(dev) || 0) + 1);
    });

    const totalLogEvents = filteredLogs.length || 1;
    const deviceBreakdown: BreakdownStat[] = [];
    deviceMap.forEach((count, label) => {
      deviceBreakdown.push({
        label,
        count,
        percentage: parseFloat(((count / totalLogEvents) * 100).toFixed(1)),
      });
    });
    deviceBreakdown.sort((a, b) => b.count - a.count);

    // 8. Compute OS Breakdown
    const osMap = new Map<string, number>();
    filteredLogs.forEach((l) => {
      const os = l.operating_system || "Other";
      osMap.set(os, (osMap.get(os) || 0) + 1);
    });

    const osBreakdown: BreakdownStat[] = [];
    osMap.forEach((count, label) => {
      osBreakdown.push({
        label,
        count,
        percentage: parseFloat(((count / totalLogEvents) * 100).toFixed(1)),
      });
    });
    osBreakdown.sort((a, b) => b.count - a.count);

    // 9. Compute Browser Breakdown
    const browserMap = new Map<string, number>();
    filteredLogs.forEach((l) => {
      const b = l.browser || "Other";
      browserMap.set(b, (browserMap.get(b) || 0) + 1);
    });

    const browserBreakdown: BreakdownStat[] = [];
    browserMap.forEach((count, label) => {
      browserBreakdown.push({
        label,
        count,
        percentage: parseFloat(((count / totalLogEvents) * 100).toFixed(1)),
      });
    });
    browserBreakdown.sort((a, b) => b.count - a.count);

    // 10. Paginated Recent Activity Log Stream (Requirement 20)
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 15;
    const startIndex = (page - 1) * pageSize;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;

    return {
      periodLabel,
      isSingleDay,
      selectedDate: selectedDateForDisplay,
      visitors,
      pageViews,
      callClicks,
      whatsappClicks,

      todayVisitors,
      todayViews,
      todayCalls,
      todayWhatsapp,

      yesterdayVisitors,
      yesterdayViews,
      yesterdayCalls,
      yesterdayWhatsapp,

      last7DaysVisitors: visitors,
      last7DaysViews: pageViews,
      last30DaysVisitors: visitors,
      last30DaysViews: pageViews,

      totalVisitorsStored: visitors,
      totalPageViewsStored: pageViews,

      dailyTable,
      dailyChart,
      popularPages: popularPages.slice(0, 10),
      deviceBreakdown,
      osBreakdown,
      browserBreakdown,
      recentLogs: paginatedLogs,
      totalLogCount: filteredLogs.length,
      currentPage: page,
      totalPages,
    };
  } catch (err: any) {
    return {
      periodLabel: "Error Loading Data",
      isSingleDay: false,
      visitors: 0,
      pageViews: 0,
      callClicks: 0,
      whatsappClicks: 0,

      todayVisitors: 0,
      todayViews: 0,
      todayCalls: 0,
      todayWhatsapp: 0,

      yesterdayVisitors: 0,
      yesterdayViews: 0,
      yesterdayCalls: 0,
      yesterdayWhatsapp: 0,

      last7DaysVisitors: 0,
      last7DaysViews: 0,
      last30DaysVisitors: 0,
      last30DaysViews: 0,

      totalVisitorsStored: 0,
      totalPageViewsStored: 0,

      dailyTable: [],
      dailyChart: [],
      popularPages: [],
      deviceBreakdown: [],
      osBreakdown: [],
      browserBreakdown: [],
      recentLogs: [],
      totalLogCount: 0,
      currentPage: 1,
      totalPages: 1,
    };
  }
}

export async function fetchAnalyticsSummary(filterMonth?: string): Promise<AnalyticsSummary> {
  const data = await fetchComprehensiveAnalytics({
    period: filterMonth ? "custom" : "30days",
    startDate: filterMonth ? `${filterMonth}-01` : undefined,
    endDate: filterMonth ? `${filterMonth}-31` : undefined,
    page: 1,
    pageSize: 15,
  });

  const monthMap = new Map<string, VisitorLog[]>();
  data.recentLogs.forEach((log) => {
    const d = new Date(log.created_at);
    if (!isNaN(d.getTime())) {
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, []);
      }
      monthMap.get(monthKey)!.push(log);
    }
  });

  const monthlyStats: MonthlyStat[] = [];
  const availableMonths: { monthKey: string; monthName: string }[] = [];

  monthMap.forEach((mLogs, mKey) => {
    const [yearStr, monthStr] = mKey.split("-");
    const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
    const monthName = dateObj.toLocaleString("en-US", { month: "long", year: "numeric" });

    availableMonths.push({ monthKey: mKey, monthName });

    monthlyStats.push({
      monthKey: mKey,
      monthName,
      pageViews: mLogs.filter((l) => l.action === "page_view").length,
      uniqueVisitors: new Set(mLogs.map((l) => l.session_id)).size,
      whatsappClicks: mLogs.filter((l) => l.action === "whatsapp_click").length,
      callClicks: mLogs.filter((l) => l.action === "call_click").length,
    });
  });

  return {
    totalPageViews: data.pageViews,
    totalUniqueVisitors: data.visitors,
    todayPageViews: data.todayViews,
    todayUniqueVisitors: data.todayVisitors,
    whatsappClicks: data.whatsappClicks,
    callClicks: data.callClicks,
    monthlyStats,
    availableMonths,
    recentLogs: data.recentLogs,
  };
}

export async function clearVisitorLogs(targetMonth?: string) {
  return deleteAnalyticsLogs({ mode: targetMonth ? "date_range" : "all" });
}

export async function deleteAnalyticsLogs(payload: {
  mode: "all" | "date_range" | "selected";
  startDate?: string;
  endDate?: string;
  selectedIds?: string[];
}) {
  try {
    const supabase = await createClient();

    if (payload.mode === "all") {
      const { error } = await supabase
        .from("visitor_logs")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
    } else if (payload.mode === "date_range" && payload.startDate && payload.endDate) {
      const bounds = getIndiaRangeUtcBounds(payload.startDate, payload.endDate);
      const { error } = await supabase
        .from("visitor_logs")
        .delete()
        .gte("created_at", bounds.startUtc)
        .lte("created_at", bounds.endUtc);
      if (error) throw error;
    } else if (payload.mode === "selected" && payload.selectedIds && payload.selectedIds.length > 0) {
      const { error } = await supabase
        .from("visitor_logs")
        .delete()
        .in("id", payload.selectedIds);
      if (error) throw error;
    }

    revalidatePath("/admin");
    revalidatePath("/admin/analytics");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete analytics logs." };
  }
}
