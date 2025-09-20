import { apiClient } from "@/utils/apiClient";

export interface WhyUs {
  id: string;
  title: Record<string, string>;
  paragraph: Record<string, string>;
  buttonText: Record<string, string>;
  createdAt: string;
}

export const whyUsService = {
  getAll: () => apiClient.get<WhyUs[]>("/why-us"),

  getOne: (id: string) => apiClient.get<WhyUs>(`/why-us/${id}`),

  create: (data: Omit<WhyUs, "id" | "createdAt">) =>
    apiClient.post<WhyUs>("/why-us", data),

  update: (id: string, data: Partial<Omit<WhyUs, "id" | "createdAt">>) =>
    apiClient.patch<WhyUs>(`/why-us/${id}`, data),

  delete: (id: string) => apiClient.delete<void>(`/why-us/${id}`),
};
