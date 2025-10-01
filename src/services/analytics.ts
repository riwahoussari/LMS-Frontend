import type { AnalyticsResponse } from "@/pages/admin/AnalyticsPage";
import { api } from "./api";

export async function getPlatformAnalytics(): Promise<AnalyticsResponse> {
  const res = await api.get<AnalyticsResponse>("/analytics/summary");
  return res.data;
}
