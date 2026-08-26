"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { VisitorLog } from "@/types/database";

export interface AnalyticsFilterOptions {
  period?: "today" | "yesterday" | "7days" | "30days" | "all" | "custom";
  startDate?: string;
  endDate?: string;
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
  dateStr: string; // "YYYY-MM-DD"
  dateLabel: string; // "Aug 26"
  visitors: number;
  pageViews: number;
}

export interface MonthlyStat {
  monthKey: string;
  monthName: string;
  pageViews: number;
  uniqueVisitors: number;
  whatsappClicks: number;
  callClicks: number;
}

export interface ComprehensiveAnalyticsData {
  todayVisitors: number;
  todayViews: number;
  yesterdayVisitors: number;
  yesterdayViews: number;
  last7DaysVisitors: number;
  last7DaysViews: number;
  last30DaysVisitors: number;
  last30DaysViews: number;
  totalVisitorsStored: number;
  totalPageViewsStored: number;
  whatsappClicks: number;
  callClicks: number;
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
  action: 'page_view' | 'whatsapp_click' | 'call_click' | 'service_view' | 'jewellery_view' | 'gallery_view';
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
    const visitDate = now.toISOString().split("T")[0]; // YYYY-MM-DD

    const { error } = await supabase.from("visitor_logs").insert({
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
    });

    if (error) {
      console.warn("Analytics insertion note:", error.message);
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
      // Retention cleanup fails silently if database has restricted permissions
    }

    // 2. Fetch all visitor logs for aggregation calculations
    const { data: rawData } = await supabase
      .from("visitor_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5000);

    const allLogs: VisitorLog[] = rawData || [];

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

    const date7Ago = new Date(now);
    date7Ago.setDate(date7Ago.getDate() - 7);

    const date30Ago = new Date(now);
    date30Ago.setDate(date30Ago.getDate() - 30);

    // Compute Overall Overview Cards
    const todayLogs = allLogs.filter((l) => (l.visit_date || l.created_at.split("T")[0]) === todayStr);
    const todayVisitors = new Set(todayLogs.map((l) => l.session_id)).size;
    const todayViews = todayLogs.length;

    const yesterdayLogs = allLogs.filter((l) => (l.visit_date || l.created_at.split("T")[0]) === yesterdayStr);
    const yesterdayVisitors = new Set(yesterdayLogs.map((l) => l.session_id)).size;
    const yesterdayViews = yesterdayLogs.length;

    const last7Logs = allLogs.filter((l) => new Date(l.created_at) >= date7Ago);
    const last7DaysVisitors = new Set(last7Logs.map((l) => l.session_id)).size;
    const last7DaysViews = last7Logs.length;

    const last30Logs = allLogs.filter((l) => new Date(l.created_at) >= date30Ago);
    const last30DaysVisitors = new Set(last30Logs.map((l) => l.session_id)).size;
    const last30DaysViews = last30Logs.length;

    const totalVisitorsStored = new Set(allLogs.map((l) => l.session_id)).size;
    const totalPageViewsStored = allLogs.length;

    // Filter logs based on active filter criteria
    let filteredLogs = allLogs;

    const period = filters.period || "30days";
    if (period === "today") {
      filteredLogs = todayLogs;
    } else if (period === "yesterday") {
      filteredLogs = yesterdayLogs;
    } else if (period === "7days") {
      filteredLogs = last7Logs;
    } else if (period === "30days") {
      filteredLogs = last30Logs;
    } else if (period === "custom" && (filters.startDate || filters.endDate)) {
      filteredLogs = filteredLogs.filter((l) => {
        const d = l.created_at.split("T")[0];
        const matchStart = filters.startDate ? d >= filters.startDate : true;
        const matchEnd = filters.endDate ? d <= filters.endDate : true;
        return matchStart && matchEnd;
      });
    }

    if (filters.deviceType && filters.deviceType !== "all") {
      filteredLogs = filteredLogs.filter((l) => l.device === filters.deviceType);
    }

    if (filters.operatingSystem && filters.operatingSystem !== "all") {
      filteredLogs = filteredLogs.filter((l) => l.operating_system === filters.operatingSystem);
    }

    if (filters.browser && filters.browser !== "all") {
      filteredLogs = filteredLogs.filter((l) => l.browser === filters.browser);
    }

    if (filters.pagePath && filters.pagePath !== "all") {
      filteredLogs = filteredLogs.filter((l) => l.page_path === filters.pagePath);
    }

    // 3. Compute Daily Chart Data (last 14 days or selected timeframe)
    const dailyMap = new Map<string, VisitorLog[]>();
    filteredLogs.forEach((log) => {
      const dStr = log.visit_date || log.created_at.split("T")[0];
      if (!dailyMap.has(dStr)) {
        dailyMap.set(dStr, []);
      }
      dailyMap.get(dStr)!.push(log);
    });

    const dailyChart: DailyChartPoint[] = [];
    const sortedDates = Array.from(dailyMap.keys()).sort();

    sortedDates.forEach((dStr) => {
      const logsForDay = dailyMap.get(dStr) || [];
      const dObj = new Date(dStr);
      const dateLabel = isNaN(dObj.getTime())
        ? dStr
        : dObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      dailyChart.push({
        dateStr: dStr,
        dateLabel,
        visitors: new Set(logsForDay.map((l) => l.session_id)).size,
        pageViews: logsForDay.length,
      });
    });

    // 4. Compute Popular Pages
    const pageMap = new Map<string, number>();
    filteredLogs.forEach((l) => {
      pageMap.set(l.page_path, (pageMap.get(l.page_path) || 0) + 1);
    });

    const popularPages: PopularPageStat[] = [];
    const totalFilteredViews = filteredLogs.length || 1;

    pageMap.forEach((count, path) => {
      popularPages.push({
        path,
        views: count,
        percentage: parseFloat(((count / totalFilteredViews) * 100).toFixed(1)),
      });
    });

    popularPages.sort((a, b) => b.views - a.views);

    // 5. Compute Device Breakdown
    const deviceMap = new Map<string, number>();
    filteredLogs.forEach((l) => {
      const dev = l.device || "Unknown";
      deviceMap.set(dev, (deviceMap.get(dev) || 0) + 1);
    });

    const deviceBreakdown: BreakdownStat[] = [];
    deviceMap.forEach((count, label) => {
      deviceBreakdown.push({
        label,
        count,
        percentage: parseFloat(((count / totalFilteredViews) * 100).toFixed(1)),
      });
    });
    deviceBreakdown.sort((a, b) => b.count - a.count);

    // 6. Compute OS Breakdown
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
        percentage: parseFloat(((count / totalFilteredViews) * 100).toFixed(1)),
      });
    });
    osBreakdown.sort((a, b) => b.count - a.count);

    // 7. Compute Browser Breakdown
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
        percentage: parseFloat(((count / totalFilteredViews) * 100).toFixed(1)),
      });
    });
    browserBreakdown.sort((a, b) => b.count - a.count);

    // 8. Pagination for Recent Log Stream
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 15;
    const startIndex = (page - 1) * pageSize;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;

    const whatsappClicks = filteredLogs.filter((l) => l.action === "whatsapp_click").length;
    const callClicks = filteredLogs.filter((l) => l.action === "call_click").length;

    return {
      todayVisitors,
      todayViews,
      yesterdayVisitors,
      yesterdayViews,
      last7DaysVisitors,
      last7DaysViews,
      last30DaysVisitors,
      last30DaysViews,
      totalVisitorsStored,
      totalPageViewsStored,
      whatsappClicks,
      callClicks,
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
  } catch {
    return {
      todayVisitors: 0,
      todayViews: 0,
      yesterdayVisitors: 0,
      yesterdayViews: 0,
      last7DaysVisitors: 0,
      last7DaysViews: 0,
      last30DaysVisitors: 0,
      last30DaysViews: 0,
      totalVisitorsStored: 0,
      totalPageViewsStored: 0,
      whatsappClicks: 0,
      callClicks: 0,
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

// Backward-compatible exports for Admin Dashboard Widgets
export async function fetchAnalyticsSummary(filterMonth?: string): Promise<AnalyticsSummary> {
  const data = await fetchComprehensiveAnalytics({ period: filterMonth ? "custom" : "30days", page: 1, pageSize: 15 });

  // Compute monthly stats
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
      pageViews: mLogs.length,
      uniqueVisitors: new Set(mLogs.map((l) => l.session_id)).size,
      whatsappClicks: mLogs.filter((l) => l.action === "whatsapp_click").length,
      callClicks: mLogs.filter((l) => l.action === "call_click").length,
    });
  });

  return {
    totalPageViews: data.totalPageViewsStored,
    totalUniqueVisitors: data.totalVisitorsStored,
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
      const startIso = new Date(`${payload.startDate}T00:00:00.000Z`).toISOString();
      const endIso = new Date(`${payload.endDate}T23:59:59.999Z`).toISOString();

      const { error } = await supabase
        .from("visitor_logs")
        .delete()
        .gte("created_at", startIso)
        .lte("created_at", endIso);
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
