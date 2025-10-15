import { apiClient } from "@/utils/apiClient";

export interface NavItem {
  id: string;
  label: Record<string, string>;
  url: string;
  order: number;
  visible: boolean;
  parentId: string | null;
}

export const navItemsClient = {
  getAll: () => apiClient.get<NavItem[]>("/nav-items"),

  create: (data: Omit<NavItem, "id">) =>
    apiClient.post<NavItem>("/nav-items", data),

  update: (id: string, data: Partial<NavItem>) =>
    apiClient.patch<NavItem>(`/nav-items/${id}`, data),

  reorder: (items: { id: string; order: number }[]) =>
    apiClient.patch(`/nav-items/reorder`, items),

  delete: (id: string) => apiClient.delete(`/nav-items/${id}`),
};
