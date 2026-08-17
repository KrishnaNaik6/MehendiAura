"use client";

import React, { useState, useEffect } from "react";
import { Users, Eye, MessageSquare, Phone, Smartphone, Monitor, Globe, RefreshCw, Activity, Sparkles } from "lucide-react";
import { AnalyticsSummary, fetchAnalyticsSummary } from "@/app/actions/analytics";

interface AdminAnalyticsWidgetProps {
  initialData: AnalyticsSummary;
}

export function AdminAnalyticsWidget({ initialData }: AdminAnalyticsWidgetProps) {
  const [data, setData] = useState<AnalyticsSummary>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const summary = await fetchAnalyticsSummary();
      setData(summary);
    } catch {
      // Ignore network glitch
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Auto-refresh analytics stats every 30 seconds
    const interval = setInterval(handleRefresh, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-gold-300/40 shadow-soft overflow-hidden p-6 space-y-6">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-900 text-gold-300 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-brand-900">
                Visitor &amp; Customer Activity Live Tracker
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Tracker
              </span>
            </div>
            <p className="text-xs text-brand-600">
              Real-time traffic counts, unique visitors, WhatsApp enquiries, and client activity logs.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 border border-gold-300/40 text-brand-900 hover:bg-cream-200 text-xs font-semibold transition-all shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gold-700 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh Traffic</span>
        </button>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Visitors */}
        <div className="p-4 rounded-2xl bg-cream-50 border border-gold-300/30 space-y-1">
          <div className="flex items-center justify-between text-brand-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today's Visitors</span>
            <Users className="w-4 h-4 text-gold-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-brand-900">
            {data.todayUniqueVisitors}
          </div>
          <div className="text-[11px] text-brand-700 font-medium">
            {data.todayPageViews} total views today
          </div>
        </div>

        {/* Total Page Views */}
        <div className="p-4 rounded-2xl bg-cream-50 border border-gold-300/30 space-y-1">
          <div className="flex items-center justify-between text-brand-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-brand-900">
            {data.totalPageViews}
          </div>
          <div className="text-[11px] text-brand-700 font-medium">
            Across {data.totalUniqueVisitors} unique sessions
          </div>
        </div>

        {/* WhatsApp Enquiries */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[11px] font-bold uppercase tracking-wider">WhatsApp Enquiries</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-900">
            {data.whatsappClicks}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            Direct chat clicks
          </div>
        </div>

        {/* Phone Call Clicks */}
        <div className="p-4 rounded-2xl bg-cream-50 border border-gold-300/30 space-y-1">
          <div className="flex items-center justify-between text-brand-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Call Enquiries</span>
            <Phone className="w-4 h-4 text-gold-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-brand-900">
            {data.callClicks}
          </div>
          <div className="text-[11px] text-brand-700 font-medium">
            Direct phone dial clicks
          </div>
        </div>
      </div>

      {/* Live Visitor Activity Log Stream */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-brand-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <span>Recent Visitor Activity Feed</span>
          </h3>
          <span className="text-xs text-brand-600 font-medium">
            Showing last {data.recentLogs.length} activity records
          </span>
        </div>

        {data.recentLogs.length === 0 ? (
          <div className="p-8 text-center bg-cream-50 rounded-2xl border border-cream-200 text-brand-600 text-xs">
            No visitor logs recorded yet. Visit your public website pages or click WhatsApp to see live activity stream!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-cream-300">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100 text-brand-900 font-bold uppercase tracking-wider border-b border-cream-300">
                  <th className="py-2.5 px-4">Visitor / Device</th>
                  <th className="py-2.5 px-4">Action Event</th>
                  <th className="py-2.5 px-4">Page Path</th>
                  <th className="py-2.5 px-4">Language</th>
                  <th className="py-2.5 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 bg-white">
                {data.recentLogs.map((log) => {
                  const isWhatsapp = log.action === "whatsapp_click";
                  const isCall = log.action === "call_click";
                  const timeFormatted = new Date(log.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });
                  const dateFormatted = new Date(log.created_at).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr key={log.id} className="hover:bg-cream-50 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          {log.device === "mobile" ? (
                            <Smartphone className="w-3.5 h-3.5 text-gold-600" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-brand-600" />
                          )}
                          <span className="font-semibold text-brand-900 truncate max-w-[110px]">
                            {log.session_id.substring(0, 12)}...
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isWhatsapp
                              ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/30"
                              : isCall
                              ? "bg-gold-500/20 text-gold-800 border border-gold-400/40"
                              : "bg-brand-900/10 text-brand-900 border border-brand-800/20"
                          }`}
                        >
                          {isWhatsapp ? (
                            <>
                              <MessageSquare className="w-3 h-3 text-emerald-600" />
                              <span>WhatsApp Inquiry</span>
                            </>
                          ) : isCall ? (
                            <>
                              <Phone className="w-3 h-3 text-gold-700" />
                              <span>Call Inquiry</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3 text-brand-700" />
                              <span>Page View</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-brand-800 font-medium">
                        {log.page_path}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cream-100 text-brand-900 text-[10px] font-semibold border border-cream-300">
                          <Globe className="w-3 h-3 text-gold-600" />
                          <span>{log.language === "kn" ? "Kannada (kn)" : "English (en)"}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-brand-600 font-mono text-[11px]">
                        {dateFormatted}, {timeFormatted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
