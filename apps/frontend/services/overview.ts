import { apiClient } from "@/utils/apiClient";

type Traffic = { day: string; count: number };
export async function getTraffic(period: string) {
  return apiClient.get<Traffic[]>(`/page-view/summary?period=${period}`);
}

export async function getContactsOverview() {
  return apiClient.get<number>("/contact/count/unread");
}
