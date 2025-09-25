import { apiClient } from "@/utils/apiClient";

export interface PracticeArea {
  id: string;
  slug: string;
  title: Record<string, string>;
  excerpt?: Record<string, string>;
  contentHtml?: Record<string, string>;
  logoUrl?: string;
  coverImageUrl?: string;
  seoMeta?: {
    title?: Record<string, string>;
    description?: Record<string, string>;
    canonical?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const practiceAreaService = {
  getAll: () => apiClient.get<PracticeArea[]>("/practice-areas"),

  getOne: (id: string) => apiClient.get<PracticeArea>(`/practice-areas/${id}`),

  getBySlug: async (slug: string): Promise<PracticeArea> => {
    return apiClient.get(`/practice-areas/${slug}`);
  },

  create: (
    data: Omit<PracticeArea, "id" | "createdAt" | "updatedAt">,
    logoFile?: File,
    coverFile?: File
  ) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (logoFile) formData.append("logo", logoFile);
    if (coverFile) formData.append("coverImage", coverFile);

    return apiClient.post<PracticeArea>("/practice-areas", formData);
  },

  update: (
    id: string,
    data: Partial<Omit<PracticeArea, "id" | "createdAt" | "updatedAt">>,
    logoFile?: File,
    coverFile?: File
  ) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (logoFile) formData.append("logo", logoFile);
    if (coverFile) formData.append("coverImage", coverFile);

    return apiClient.patch<PracticeArea>(`/practice-areas/${id}`, formData);
  },

  delete: (id: string) => apiClient.delete<void>(`/practice-areas/${id}`),
};
