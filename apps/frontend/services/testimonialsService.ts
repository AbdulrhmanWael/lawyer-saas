import { apiClient } from "@/utils/apiClient";

export interface TestimonialPayload {
  person: string;
  quote: Record<string, string>;
  rating: number;
  image?: File;
}

export interface Testimonial {
  id: string;
  person: string;
  quote: Record<string, string>;
  rating: number;
  imageUrl: string;
}

export const testimonialClient = {
  getAll: () => apiClient.get<Testimonial[]>("/testimonials"),

  create: async (data: TestimonialPayload) => {
    const formData = new FormData();
    formData.append("person", data.person);
    formData.append("rating", String(data.rating));
    formData.append("quote", JSON.stringify(data.quote));
    if (data.image) formData.append("image", data.image);
    return apiClient.post<Testimonial>("/testimonials", formData);
  },

  update: async (id: string, data: TestimonialPayload) => {
    const formData = new FormData();
    formData.append("person", data.person);
    formData.append("rating", String(data.rating));
    formData.append("quote", JSON.stringify(data.quote));
    if (data.image) formData.append("image", data.image);
    return apiClient.put<Testimonial>(`/testimonials/${id}`, formData);
  },

  delete: (id: string) => apiClient.delete(`/testimonials/${id}`),
};
