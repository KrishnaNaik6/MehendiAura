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
  Clock,
  ArrowRight,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import {
  ComprehensiveAnalyticsData,
  AnalyticsFilterOptions,
  DailyVisitorRow,
  fetchComprehensiveAnalytics,
  deleteAnalyticsLogs,
} from "@/app/actions/analytics";
import { formatIndiaTime, formatIndiaDate, getIndiaDateString } from "@/lib/analytics/timezone";

interface AnalyticsDashboardViewProps {
  initialData: ComprehensiveAnalyticsData;
}

export function AnalyticsDashboardView({ initialData }: AnalyticsDashboardViewProps) {
  const [data, setData] = useState<ComprehensiveAnalyticsData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter State
  const [period, setPeriod] = useState<
    "today" | "yesterday" | "single_date" | "7days" | "30days" | "all" | "custom"
  >("30days");
  const [singleDate, setSingleDate] = useState<string>(getIndiaDateString());
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

  const applyFilters = async (
    overridePage?: number,
    overridePeriod?: "today" | "yesterday" | "single_date" | "7days" | "30days" | "all" | "custom",
    overrideDate?: string
  ) => {
    setIsRefreshing(true);
    const activePeriod = overridePeriod !== undefined ? overridePeriod : period;
    const pageNum = overridePage !== undefined ? overridePage : currentPage;
    const targetSingleDate = overrideDate !== undefined ? overrideDate : singleDate;

    try {
      const filters: AnalyticsFilterOptions = {
        period: activePeriod,
        selectedDate: activePeriod === "single_date" ? targetSingleDate : undefined,
        startDate: activePeriod === "custom" ? startDate : undefined,
        endDate: activePeriod === "custom" ? endDate : undefined,
        deviceType: deviceType !== "all" ? deviceType : undefined,
        operatingSystem: operatingSystem !== "all" ? operatingSystem : undefined,
        browser: browser !== "all" ? browser : undefined,
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

  const handlePeriodChange = (newPeriod: typeof period) => {
    setPeriod(newPeriod);
    setCurrentPage(1);
    applyFilters(1, newPeriod);
  };

  const handleSingleDateSelect = (dateStr: string) => {
    setSingleDate(dateStr);
    setPeriod("single_date");
    setCurrentPage(1);
    applyFilters(1, "single_date", dateStr);
  };

  const handleDrillDownDay = (row: DailyVisitorRow) => {
    handleSingleDateSelect(row.dateStr);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

    const headers = [
      "Session ID",
      "Action",
      "Page Path",
      "Device",
      "OS",
      "Browser",
      "Device Name",
      "Language",
      "Timestamp (IST)",
    ];
    const rows = data.recentLogs.map((log) => [
      log.session_id,
      log.action,
      log.page_path,
      log.device || "Desktop",
      log.operating_system || "Other",
      log.browser || "Other",
      log.device_name || "Unknown",
      log.language || "en",
      formatIndiaDate(log.created_at) + " " + formatIndiaTime(log.created_at),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mhendi_analytics_${getIndiaDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully!");
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

  const isEmptyDay = data.isSingleDay && data.visitors === 0 && data.pageViews === 0 && data.callClicks === 0 && data.whatsappClicks === 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-950 text-cream-100 p-6 sm:p-8 rounded-3xl border border-gold-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              <span>Real Visitor Analytics</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-950/70 border border-gold-500/30 text-cream-200 text-[11px] font-mono">
              <Clock className="w-3 h-3 text-gold-400" />
              <span>IST (Asia/Kolkata)</span>
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Visitor Traffic &amp; Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-cream-200 mt-1">
            Real visitor tracking, call clicks, WhatsApp enquiries, and daily calendar breakdown.
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Time Period Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "today", label: "Today" },
              { id: "yesterday", label: "Yesterday" },
              { id: "single_date", label: "Select Any Date" },
              { id: "7days", label: "Last 7 Days" },
              { id: "30days", label: "Last 30 Days" },
              { id: "custom", label: "Custom Range" },
              { id: "all", label: "All History" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handlePeriodChange(p.id as any)}
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream-100 border border-gold-300/40 text-brand-900 text-xs font-semibold hover:bg-cream-200 shrink-0 self-start lg:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gold-700 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Single Date Picker Selector (Requirement 7 & 8) */}
        {period === "single_date" && (
          <div className="pt-3 border-t border-cream-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-600" />
              <label className="text-xs font-bold text-brand-900">Choose Specific Date (IST):</label>
            </div>
            <input
              type="date"
              value={singleDate}
              onChange={(e) => handleSingleDateSelect(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-gold-400/40 bg-cream-50 text-brand-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500 min-h-[38px]"
            />
            <span className="text-xs text-brand-600 font-medium">
              Viewing exact Indian day: <strong className="text-brand-950">{formatIndiaDate(singleDate)}</strong>
            </span>
          </div>
        )}

        {/* Custom Date Range (Requirement 8) */}
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

        {/* Active Filter Scope Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-cream-100 text-xs">
          <div className="flex items-center gap-2 text-brand-700 font-medium">
            <span className="font-bold text-brand-900">Active Scope:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-gold-50 text-gold-900 font-bold border border-gold-300/40">
              {data.periodLabel}
            </span>
          </div>

          {data.isSingleDay && (
            <button
              onClick={() => handlePeriodChange("30days")}
              className="text-[11px] text-gold-700 font-semibold hover:underline"
            >
              ← Back to 30-Day Overview
            </button>
          )}
        </div>
      </div>

      {/* Empty Day Banner (Requirement 11) */}
      {isEmptyDay && (
        <div className="p-8 rounded-3xl bg-cream-50 border border-gold-300/40 text-center space-y-3 shadow-soft">
          <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-600 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-brand-900">
            No visitor data recorded for this date.
          </h3>
          <p className="text-xs text-brand-600 max-w-md mx-auto">
            No visitors, page views, call clicks, or WhatsApp clicks occurred on {data.periodLabel}.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handlePeriodChange("today")}
              className="px-4 py-2 rounded-xl bg-gold-500 text-brand-950 text-xs font-bold hover:bg-gold-400 transition-all"
            >
              View Today&apos;s Activity
            </button>
          </div>
        </div>
      )}

      {/* 4 Separate Unmixed Overview Metrics (Requirement 6, 7, 9, 19) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Real Visitors */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gold-300/40 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-brand-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Unique Visitors</span>
            <Users className="w-4 h-4 text-gold-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-brand-900">
            {data.visitors}
          </div>
          <div className="text-[11px] text-brand-600 font-medium">
            Real visitor sessions
          </div>
        </div>

        {/* Page Views */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gold-300/40 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-brand-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Page Views</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-brand-900">
            {data.pageViews}
          </div>
          <div className="text-[11px] text-brand-600 font-medium">
            Navigations across pages
          </div>
        </div>

        {/* Call Clicks */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gold-300/40 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-brand-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Call Clicks</span>
            <Phone className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-700">
            {data.callClicks}
          </div>
          <div className="text-[11px] text-brand-600 font-medium">
            Phone dialer taps
          </div>
        </div>

        {/* WhatsApp Clicks */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gold-300/40 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-brand-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">WhatsApp Clicks</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700">
            {data.whatsappClicks}
          </div>
          <div className="text-[11px] text-brand-600 font-medium">
            Enquiries initiated
          </div>
        </div>
      </div>

      {/* DAILY VISITOR TABLE (Requirement 10: Date | Visitors | Page Views | Calls | WhatsApp) */}
      {!data.isSingleDay && data.dailyTable && data.dailyTable.length > 0 && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gold-300/40 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-900">
                Daily Visitor Statistics Table
              </h2>
              <p className="text-xs text-brand-600">
                Click any row or &quot;View Day&quot; to drill down into that specific day&apos;s metrics.
              </p>
            </div>
            <span className="text-xs font-semibold text-brand-700">
              Showing {data.dailyTable.length} recorded days
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-cream-300">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100 text-brand-900 font-bold uppercase tracking-wider border-b border-cream-300">
                  <th className="py-3 px-4">Date (IST)</th>
                  <th className="py-3 px-4">Visitors</th>
                  <th className="py-3 px-4">Page Views</th>
                  <th className="py-3 px-4">Calls</th>
                  <th className="py-3 px-4">WhatsApp</th>
                  <th className="py-3 px-4 text-right">Drill-Down</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 bg-white">
                {data.dailyTable.map((row) => (
                  <tr
                    key={row.dateStr}
                    onClick={() => handleDrillDownDay(row)}
                    className="hover:bg-gold-50/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-bold text-brand-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                        <span>{row.dateLabel}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-brand-900">
                      {row.visitors}
                    </td>
                    <td className="py-3 px-4 font-medium text-brand-700">
                      {row.pageViews}
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-700">
                      {row.calls}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {row.whatsapp}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDrillDownDay(row);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gold-100 text-brand-900 hover:bg-gold-500 hover:text-brand-950 font-bold text-[11px] transition-all"
                      >
                        <span>View Day</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Breakdown Grid: Popular Pages & Device Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Pages (Requirement 7 & 9) */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gold-300/40 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base sm:text-lg font-bold text-brand-900">
              Popular Pages ({data.periodLabel})
            </h3>
            <span className="text-xs text-brand-600 font-medium">
              {data.popularPages.length} pages viewed
            </span>
          </div>

          {data.popularPages.length === 0 ? (
            <div className="p-6 text-center text-xs text-brand-600 bg-cream-50 rounded-2xl">
              No page view records in this timeframe.
            </div>
          ) : (
            <div className="space-y-3">
              {data.popularPages.map((page) => (
                <div key={page.path} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-brand-900">
                    <span className="font-mono truncate max-w-[200px] sm:max-w-xs">{page.path}</span>
                    <span>
                      {page.views} views ({page.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-cream-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"
                      style={{ width: `${Math.min(page.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device & Platform Breakdown (Requirement 7 & 9) */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gold-300/40 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base sm:text-lg font-bold text-brand-900">
              Device Breakdown ({data.periodLabel})
            </h3>
            <span className="text-xs text-brand-600 font-medium">Platforms</span>
          </div>

          {data.deviceBreakdown.length === 0 ? (
            <div className="p-6 text-center text-xs text-brand-600 bg-cream-50 rounded-2xl">
              No device data available.
            </div>
          ) : (
            <div className="space-y-3">
              {data.deviceBreakdown.map((dev) => (
                <div key={dev.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-brand-900">
                    <div className="flex items-center gap-1.5">
                      {dev.label === "Mobile" ? (
                        <Smartphone className="w-3.5 h-3.5 text-gold-600" />
                      ) : dev.label === "Tablet" ? (
                        <Tablet className="w-3.5 h-3.5 text-gold-600" />
                      ) : (
                        <Monitor className="w-3.5 h-3.5 text-brand-600" />
                      )}
                      <span>{dev.label}</span>
                    </div>
                    <span>
                      {dev.count} interactions ({dev.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-cream-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-700 to-brand-900 rounded-full"
                      style={{ width: `${Math.min(dev.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* OS Breakdown Pills */}
          {data.osBreakdown && data.osBreakdown.length > 0 && (
            <div className="pt-3 border-t border-cream-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-brand-700 mb-2">
                Operating Systems
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.osBreakdown.map((os) => (
                  <span
                    key={os.label}
                    className="px-2.5 py-1 rounded-lg bg-cream-100 border border-cream-300 text-brand-900 text-xs font-semibold"
                  >
                    {os.label}: <strong>{os.count}</strong> ({os.percentage}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RECENT ACTIVITY STREAM (Requirement 20) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gold-300/40 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-900">
              Recent Activity Feed ({data.periodLabel})
            </h3>
            <p className="text-xs text-brand-600">
              Real-time sequence of visits, page views, call clicks, and WhatsApp enquiries in IST.
            </p>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="text-brand-600 font-medium">
              Page {data.currentPage} of {data.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(data.currentPage - 1)}
              disabled={data.currentPage <= 1 || isRefreshing}
              className="p-1.5 rounded-lg border border-cream-300 text-brand-800 disabled:opacity-40 hover:bg-cream-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(data.currentPage + 1)}
              disabled={data.currentPage >= data.totalPages || isRefreshing}
              className="p-1.5 rounded-lg border border-cream-300 text-brand-800 disabled:opacity-40 hover:bg-cream-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {data.recentLogs.length === 0 ? (
          <div className="p-8 text-center bg-cream-50 rounded-2xl text-xs text-brand-600">
            No activity logs found for this timeframe.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-cream-300">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100 text-brand-900 font-bold uppercase tracking-wider border-b border-cream-300">
                  <th className="py-3 px-4">Time (IST)</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Page / Location</th>
                  <th className="py-3 px-4">Device &amp; OS</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 bg-white">
                {data.recentLogs.map((log) => {
                  const isVisit = log.action === "visit";
                  const isPage = log.action === "page_view";
                  const isWhatsapp = log.action === "whatsapp_click";
                  const isCall = log.action === "call_click";

                  return (
                    <tr key={log.id} className="hover:bg-cream-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-brand-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gold-600" />
                          <span>{formatIndiaTime(log.created_at)}</span>
                        </div>
                        <div className="text-[10px] text-brand-600 font-normal">
                          {formatIndiaDate(log.created_at, { day: "numeric", month: "short" })}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isWhatsapp
                              ? "bg-emerald-500/15 text-emerald-800 border border-emerald-500/30"
                              : isCall
                              ? "bg-amber-500/20 text-amber-900 border border-amber-500/40"
                              : isVisit
                              ? "bg-gold-500/20 text-gold-900 border border-gold-500/40"
                              : "bg-blue-500/10 text-blue-800 border border-blue-500/20"
                          }`}
                        >
                          {isWhatsapp ? (
                            <>
                              <MessageSquare className="w-3 h-3 text-emerald-600" />
                              <span>WhatsApp</span>
                            </>
                          ) : isCall ? (
                            <>
                              <Phone className="w-3 h-3 text-amber-600" />
                              <span>Call Click</span>
                            </>
                          ) : isVisit ? (
                            <>
                              <Users className="w-3 h-3 text-gold-700" />
                              <span>Website Visit</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3 text-blue-600" />
                              <span>Page View</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-brand-900 font-semibold">
                        {log.page_path}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {log.device === "Mobile" ? (
                            <Smartphone className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                          ) : log.device === "Tablet" ? (
                            <Tablet className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                          )}
                          <span className="font-semibold text-brand-900">
                            {log.operating_system || "OS"} • {log.browser || "Browser"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cream-100 text-brand-900 text-[10px] font-semibold border border-cream-300">
                          <Globe className="w-3 h-3 text-gold-600" />
                          <span>{log.language === "kn" ? "KN" : "EN"}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right text-brand-600 text-[11px] truncate max-w-[180px]">
                        {log.details || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Analytics Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-5">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-900">
                  Delete Visitor Analytics?
                </h3>
                <p className="text-xs text-brand-600">
                  Admin authorization required. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-brand-900">Deletion Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteMode("date_range")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      deleteMode === "date_range"
                        ? "bg-rose-50 border-rose-500 text-rose-800"
                        : "border-cream-300 hover:bg-cream-100 text-brand-800"
                    }`}
                  >
                    Specific Date Range
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteMode("all")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      deleteMode === "all"
                        ? "bg-rose-50 border-rose-500 text-rose-800"
                        : "border-cream-300 hover:bg-cream-100 text-brand-800"
                    }`}
                  >
                    Delete All History
                  </button>
                </div>
              </div>

              {deleteMode === "date_range" && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-800 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={deleteStartDate}
                      onChange={(e) => setDeleteStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-800 mb-1">End Date</label>
                    <input
                      type="date"
                      value={deleteEndDate}
                      onChange={(e) => setDeleteEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-cream-300 hover:bg-cream-100 text-xs font-semibold text-brand-800 min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-2 min-h-[44px]"
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
