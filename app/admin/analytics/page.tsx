import React from "react";
import { Metadata } from "next";
import { fetchComprehensiveAnalytics } from "@/app/actions/analytics";
import { AnalyticsDashboardView } from "@/components/admin/AnalyticsDashboardView";

export const metadata: Metadata = {
  title: "Visitor Analytics & Traffic | Admin Dashboard",
  description: "Comprehensive privacy-conscious visitor analytics and traffic report.",
};

export default async function AdminAnalyticsPage() {
  const initialData = await fetchComprehensiveAnalytics({ period: "30days", page: 1, pageSize: 15 });

  return <AnalyticsDashboardView initialData={initialData} />;
}
