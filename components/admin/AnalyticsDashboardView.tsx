"use client";

import React, { useState } from "react";
import {
  Users,
  Eye,
  MessageSquare,
  Phone,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  RefreshCw,
  Activity,
  Sparkles,
  Calendar,
  Trash2,
  AlertTriangle,
  Loader2,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import {
  ComprehensiveAnalyticsData,
  AnalyticsFilterOptions,
  fetchComprehensiveAnalytics,
  deleteAnalyticsLogs,
} from "@/app/actions/analytics";

interface AnalyticsDashboardViewProps {
  initialData: ComprehensiveAnalyticsData;
}

export function AnalyticsDashboardView({ initialData }: AnalyticsDashboardViewProps) {
  const [data, setData] = useState<ComprehensiveAnalyticsData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter State
  const [period, setPeriod] = useState<"today" | "yesterday" | "7days" | "30days" | "all" | "custom">("30days");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [deviceType, setDeviceType] = useState<string>("all");
  const [operatingSystem, setOperatingSystem] = useState<string>("all");
  const [browser, setBrowser] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"all" | "date_range">("date_range");
  const [deleteStartDate, setDeleteStartDate] = useState<string>("");
  const [deleteEndDate, setDeleteEndDate] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const applyFilters = async (overridePage?: number, overridePeriod?: string) => {
    setIsRefreshing(true);
    const activePeriod = (overridePeriod as any) || period;
    const pageNum = overridePage !== undefined ? overridePage : currentPage;

    try {
      const filters: AnalyticsFilterOptions = {
        period: activePeriod,
        startDate: activePeriod === "custom" ? startDate : undefined,
        endDate: activePeriod === "custom" ? endDate : undefined,
        deviceType,
        operatingSystem,
        browser,
        page: pageNum,
        pageSize: 15,
      };

      const result = await fetchComprehensiveAnalytics(filters);
      setData(result);
    } catch {
      toast.error("Failed to load analytics data.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePeriodChange = (newPeriod: any) => {
    setPeriod(newPeriod);
    setCurrentPage(1);
    applyFilters(1, newPeriod);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > data.totalPages) return;
    setCurrentPage(newPage);
    applyFilters(newPage);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    if (!data.recentLogs || data.recentLogs.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const headers = ["Session ID", "Action", "Page Path", "Device", "OS", "Browser", "Device Name", "Language", "Timestamp"];
    const rows = data.recentLogs.map((log) => [
      log.session_id,
      log.action,
      log.page_path,
      log.device || "Desktop",
      log.operating_system || "Other",
      log.browser || "Other",
      log.device_name || "Unknown",
      log.language || "en",
      new Date(log.created_at).toISOString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mhendi_analytics_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV report downloaded!");
  };

  // Delete Handler
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteAnalyticsLogs({
        mode: deleteMode,
        startDate: deleteMode === "date_range" ? deleteStartDate : undefined,
        endDate: deleteMode === "date_range" ? deleteEndDate : undefined,
      });

      if (res.error) {
        toast.error("Delete Failed", { description: res.error });
      } else {
        toast.success("Analytics data deleted successfully!");
        setIsDeleteModalOpen(false);
        applyFilters(1);
      }
    } catch (err: any) {
      toast.error("Error", { description: err.message || "Delete failed." });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-cream-100 p-6 sm:p-8 rounded-3xl border border-gold-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Privacy-Conscious Analytics CMS</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Visitor Traffic &amp; Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-cream-200 mt-1">
            Real visitor stats, deduplicated sessions, device breakdown, and 365-day retention.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-brand-950 font-bold text-xs shadow-md transition-all min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-semibold text-xs transition-all min-h-[44px]"
          >
            <Trash2 className="w-4 h-4 text-rose-300" />
            <span>Delete Analytics</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gold-300/40 shadow-soft space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Time Period Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "today", label: "Today" },
              { id: "yesterday", label: "Yesterday" },
              { id: "7days", label: "Last 7 Days" },
              { id: "30days", label: "Last 30 Days" },
              { id: "all", label: "All History" },
              { id: "custom", label: "Custom Range" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handlePeriodChange(p.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap min-h-[38px] transition-all ${
                  period === p.id
                    ? "bg-brand-900 text-gold-300 border border-gold-400/40 shadow-xs font-bold"
                    : "bg-cream-100 text-brand-800 hover:bg-cream-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => applyFilters()}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream-100 border border-gold-300/40 text-brand-900 text-xs font-semibold hover:bg-cream-200 shrink-0 self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gold-700 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Custom Date Range & Device Filters */}
        {period === "custom" && (
          <div className="pt-3 border-t border-cream-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-brand-900 uppercase mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-900 uppercase mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div className="sm:col-span-2 flex items-end">
              <button
                onClick={() => applyFilters(1)}
                className="w-full px-4 py-2 rounded-xl bg-gold-500 text-brand-950 font-bold text-xs hover:bg-gold-400 transition-all min-h-[38px]"
              >
                Apply Custom Date Range
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4 Visitor Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today */}
        <div className="p-5 rounded-2xl bg-white border border-gold-300/40 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-brand-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today</span>
            <Users className="w-4 h-4 text-gold-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-brand-900">
            {data.todayVisitors}
          </div>
          <div className="text-[11px] text-brand-700 font-medium">
            {data.todayViews} total page views
          </div>
        </div>

        {/* Yesterday */}
        <div className="p-5 rounded-2xl bg-white border border-gold-300/40 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-brand-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Yesterday</span>
            <Calendar className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-brand-900">
            {data.yesterdayVisitors}
          </div>
          <div className="text-[11px] text-brand-700 font-medium">
            {data.yesterdayViews} total page views
          </div>
        </div>

        {/* Last 7 Days */}
        <div className="p-5 rounded-2xl bg-white border border-gold-300/40 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-brand-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Last 7 Days</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-brand-900">
            {data.last7DaysVisitors}
          </div>
          <div className="text-[11px] text-brand-700 font-medium">
            {data.last7DaysViews} total page views
          </div>
        </div>

        {/* Last 30 Days */}
        <div className="p-5 rounded-2xl bg-white border border-gold-300/40 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-brand-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Last 30 Days</span>
            <Activity className="w-4 h-4 text-gold-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-brand-900">
            {data.last30DaysVisitors}
          </div>
          <div className="text-[11px] text-brand-700 font-medium">
            {data.last30DaysViews} total page views
          </div>
        </div>
      </div>

      {/* Daily Visitor Interactive Bar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-gold-300/40 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Daily Visitor Trend</span>
            </h3>
            <p className="text-xs text-brand-600">Real unique visitors per day (no estimated data)</p>
          </div>
          <span className="text-xs text-brand-700 font-semibold bg-cream-100 px-3 py-1 rounded-full border border-gold-300/30">
            {data.dailyChart.length} Days Stored
          </span>
        </div>

        {data.dailyChart.length === 0 ? (
          <div className="p-8 text-center bg-cream-50 rounded-2xl text-xs text-brand-600">
            No daily data available for selected filter period.
          </div>
        ) : (
          <div className="pt-4 pb-2">
            <div className="flex items-end gap-2 h-44 overflow-x-auto pb-6 scrollbar-none border-b border-cream-200">
              {data.dailyChart.map((pt) => {
                const maxVis = Math.max(...data.dailyChart.map((d) => d.visitors), 1);
                const heightPct = Math.max((pt.visitors / maxVis) * 100, 10);

                return (
                  <div key={pt.dateStr} className="flex-1 min-w-[36px] flex flex-col items-center gap-1.5 group relative">
                    <div className="text-[10px] font-bold text-brand-900 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 bg-brand-900 text-gold-300 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                      {pt.visitors} Visitors ({pt.pageViews} Views)
                    </div>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-gold-600 to-gold-400 rounded-t-lg group-hover:from-emerald-600 group-hover:to-emerald-400 transition-all shadow-xs"
                    />
                    <span className="text-[9px] font-semibold text-brand-700 truncate max-w-full">
                      {pt.dateLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2-Column Section: Popular Pages + Distribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Pages */}
        <div className="bg-white p-6 rounded-3xl border border-gold-300/40 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-brand-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold-600" />
            <span>Popular Pages</span>
          </h3>

          {data.popularPages.length === 0 ? (
            <div className="p-6 text-center text-xs text-brand-600 bg-cream-50 rounded-2xl">
              No page view records found.
            </div>
          ) : (
            <div className="space-y-3">
              {data.popularPages.map((pg) => (
                <div key={pg.path} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-brand-900 truncate max-w-[220px]">
                      {pg.path}
                    </span>
                    <span className="font-bold text-brand-800">
                      {pg.views} views ({pg.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-cream-200 rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${pg.percentage}%` }}
                      className="bg-gold-500 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device, OS, and Browser Distributions */}
        <div className="bg-white p-6 rounded-3xl border border-gold-300/40 shadow-soft space-y-6">
          {/* Device Type */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-gold-600" />
              <span>Device Breakdown</span>
            </h4>
            <div className="space-y-2">
              {data.deviceBreakdown.map((d) => (
                <div key={d.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-brand-800">
                    <span>{d.label}</span>
                    <span>{d.count} ({d.percentage}%)</span>
                  </div>
                  <div className="w-full bg-cream-200 rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${d.percentage}%` }}
                      className="bg-emerald-600 h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operating System */}
          <div className="space-y-3 pt-2 border-t border-cream-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-gold-700" />
              <span>Operating System Breakdown</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {data.osBreakdown.map((os) => (
                <div key={os.label} className="p-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs">
                  <div className="font-bold text-brand-900">{os.label}</div>
                  <div className="text-[11px] text-brand-700">
                    {os.count} sessions ({os.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Browser */}
          <div className="space-y-3 pt-2 border-t border-cream-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-gold-600" />
              <span>Browser Breakdown</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {data.browserBreakdown.map((b) => (
                <div key={b.label} className="p-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs">
                  <div className="font-bold text-brand-900">{b.label}</div>
                  <div className="text-[11px] text-brand-700">
                    {b.count} sessions ({b.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Paginated Visitor Log Table */}
      <div className="bg-white p-6 rounded-3xl border border-gold-300/40 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-600" />
              <span>Recent Visitor Activity Stream</span>
            </h3>
            <p className="text-xs text-brand-600">
              Showing {data.recentLogs.length} of {data.totalLogCount} visitor records
            </p>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handlePageChange(data.currentPage - 1)}
              disabled={data.currentPage <= 1}
              className="p-2 rounded-xl bg-cream-100 border border-gold-300/30 text-brand-900 disabled:opacity-40 hover:bg-cream-200 transition-all"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-brand-900 px-2">
              Page {data.currentPage} of {data.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(data.currentPage + 1)}
              disabled={data.currentPage >= data.totalPages}
              className="p-2 rounded-xl bg-cream-100 border border-gold-300/30 text-brand-900 disabled:opacity-40 hover:bg-cream-200 transition-all"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {data.recentLogs.length === 0 ? (
          <div className="p-8 text-center bg-cream-50 rounded-2xl text-xs text-brand-600">
            No visitor log records found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-cream-300">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100 text-brand-900 font-bold uppercase tracking-wider border-b border-cream-300">
                  <th className="py-3 px-4">Device &amp; OS</th>
                  <th className="py-3 px-4">Browser</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Page Path</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4 text-right">Visited At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 bg-white">
                {data.recentLogs.map((log) => {
                  const isWhatsapp = log.action === "whatsapp_click";
                  const isCall = log.action === "call_click";

                  return (
                    <tr key={log.id} className="hover:bg-cream-50 transition-colors">
                      <td className="py-3 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          {log.device === "Mobile" ? (
                            <Smartphone className="w-4 h-4 text-gold-600 shrink-0" />
                          ) : log.device === "Tablet" ? (
                            <Tablet className="w-4 h-4 text-gold-600 shrink-0" />
                          ) : (
                            <Monitor className="w-4 h-4 text-brand-600 shrink-0" />
                          )}
                          <div>
                            <div className="font-bold text-brand-900">{log.device_name || `${log.operating_system || "Android"} • ${log.browser || "Chrome"} • ${log.device || "Mobile"}`}</div>
                            <div className="text-[10px] text-brand-600">{log.operating_system || "OS"}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-brand-800">
                        {log.browser || "Browser"}
                      </td>

                      <td className="py-3 px-4">
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
                              <span>WhatsApp</span>
                            </>
                          ) : isCall ? (
                            <>
                              <Phone className="w-3 h-3 text-gold-700" />
                              <span>Call</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3 text-brand-700" />
                              <span>Page View</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-brand-900 font-semibold">
                        {log.page_path}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cream-100 text-brand-900 text-[10px] font-semibold border border-cream-300">
                          <Globe className="w-3 h-3 text-gold-600" />
                          <span>{log.language === "kn" ? "KN" : "EN"}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right text-brand-600 font-mono text-[11px]">
                        {new Date(log.created_at).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal to Delete Analytics */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-gold-300/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 pb-3 border-b border-cream-200">
              <div className="p-2.5 rounded-xl bg-rose-100 shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-900">
                  Delete Visitor Analytics?
                </h3>
                <p className="text-xs text-brand-600">
                  This action permanently deletes the selected data.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-brand-900">Delete Option:</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="deleteMode"
                    value="date_range"
                    checked={deleteMode === "date_range"}
                    onChange={() => setDeleteMode("date_range")}
                    className="accent-gold-500"
                  />
                  <span>Delete Date Range</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="deleteMode"
                    value="all"
                    checked={deleteMode === "all"}
                    onChange={() => setDeleteMode("all")}
                    className="accent-gold-500"
                  />
                  <span>Delete ALL History</span>
                </label>
              </div>

              {deleteMode === "date_range" && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-900 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={deleteStartDate}
                      onChange={(e) => setDeleteStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-gold-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-900 mb-1">End Date</label>
                    <input
                      type="date"
                      value={deleteEndDate}
                      onChange={(e) => setDeleteEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-gold-400"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-200">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-cream-100 text-brand-800 font-semibold text-xs hover:bg-cream-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md transition-colors"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
