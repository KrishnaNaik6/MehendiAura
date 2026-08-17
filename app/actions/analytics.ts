"use server";

import { createClient } from "@/lib/supabase/server";
import { VisitorLog } from "@/types/database";

export interface AnalyticsSummary {
  totalPageViews: number;
  totalUniqueVisitors: number;
  todayPageViews: number;
  todayUniqueVisitors: number;
  whatsappClicks: number;
  callClicks: number;
  recentLogs: VisitorLog[];
}

export async function recordVisitorActivity(payload: {
  sessionId: string;
  pagePath: string;
  action: 'page_view' | 'whatsapp_click' | 'call_click' | 'service_view' | 'jewellery_view' | 'gallery_view';
  details?: string;
  language?: string;
  device?: string;
}) {
  try {
    const supabase = await createClient();

    // Prevent logging admin portal pages to keep stats focused on website customers
    if (payload.pagePath.startsWith("/admin")) {
      return { success: true };
    }

    const { error } = await supabase.from("visitor_logs").insert({
      session_id: payload.sessionId,
      page_path: payload.pagePath,
      action: payload.action,
      details: payload.details || null,
      language: payload.language || "en",
      device: payload.device || "desktop",
    });

    if (error) {
      // Table might not exist yet if migration hasn't been run; handle gracefully without crashing client
      console.warn("Analytics insertion note:", error.message);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    const supabase = await createClient();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayIso = todayStart.toISOString();

    // Query all logs
    const { data: logsData, error } = await supabase
      .from("visitor_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error || !logsData) {
      return {
        totalPageViews: 0,
        totalUniqueVisitors: 0,
        todayPageViews: 0,
        todayUniqueVisitors: 0,
        whatsappClicks: 0,
        callClicks: 0,
        recentLogs: [],
      };
    }

    const logs: VisitorLog[] = logsData;

    const totalPageViews = logs.length;
    const totalUniqueVisitors = new Set(logs.map((l) => l.session_id)).size;

    const todayLogs = logs.filter((l) => new Date(l.created_at) >= todayStart);
    const todayPageViews = todayLogs.length;
    const todayUniqueVisitors = new Set(todayLogs.map((l) => l.session_id)).size;

    const whatsappClicks = logs.filter((l) => l.action === "whatsapp_click").length;
    const callClicks = logs.filter((l) => l.action === "call_click").length;

    return {
      totalPageViews,
      totalUniqueVisitors,
      todayPageViews,
      todayUniqueVisitors,
      whatsappClicks,
      callClicks,
      recentLogs: logs.slice(0, 15),
    };
  } catch {
    return {
      totalPageViews: 0,
      totalUniqueVisitors: 0,
      todayPageViews: 0,
      todayUniqueVisitors: 0,
      whatsappClicks: 0,
      callClicks: 0,
      recentLogs: [],
    };
  }
}
