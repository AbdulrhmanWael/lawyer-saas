import { apiClient } from "@/utils/apiClient";

export interface Client {
  id: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface ClientPayload {
  name: string;
  isActive: boolean;
  image?: File;
}

export const clientClient = {
  getAll: (): Promise<Client[]> => apiClient.get("/client-logos"),

  create: async (payload: ClientPayload): Promise<Client> => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("isActive", String(payload.isActive));
    if (payload.image) formData.append("imageFile", payload.image);

    return apiClient.post("/client-logos", formData);
  },

  update: async (id: string, payload: ClientPayload): Promise<Client> => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("isActive", String(payload.isActive));
    if (payload.image) formData.append("imageFile", payload.image);

    return apiClient.put(`/client-logos/${id}`, formData);
  },

  delete: (id: string) => apiClient.delete(`/client-logos/${id}`),
};
