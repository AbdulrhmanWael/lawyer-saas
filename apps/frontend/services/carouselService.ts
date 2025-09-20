import { apiClient } from "@/utils/apiClient";

export interface CarouselItemPayload {
  paragraph: Record<string, string>;
  order: number;
  isActive?: boolean;
  image?: File;
}

export interface CarouselItem {
  id: string;
  paragraph: Record<string, string>;
  order: number;
  isActive: boolean;
  imageUrl?: string;
}

export const carouselClient = {
  getAll: () => apiClient.get<CarouselItem[]>("/carousel-items"),

  create: async (payload: CarouselItemPayload) => {
    const formData = new FormData();
    formData.append("paragraph", JSON.stringify(payload.paragraph));
    formData.append("order", String(payload.order));
    if (payload.isActive !== undefined)
      formData.append("isActive", String(payload.isActive));
    if (payload.image) formData.append("image", payload.image);

    return apiClient.post<CarouselItem>("/carousel-items", formData);
  },

  update: async (id: string, payload: CarouselItemPayload) => {
    const formData = new FormData();
    formData.append("paragraph", JSON.stringify(payload.paragraph));
    formData.append("order", String(payload.order));
    if (payload.isActive !== undefined)
      formData.append("isActive", String(payload.isActive));
    if (payload.image) formData.append("image", payload.image);

    return apiClient.put<CarouselItem>(`/carousel-items/${id}`, formData);
  },

  delete: (id: string) => apiClient.delete(`/carousel-items/${id}`),
};
