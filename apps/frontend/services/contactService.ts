import { apiClient } from "@/utils/apiClient";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  title: string;
  details: string;
}

export const contactClient = {
  create: (data: ContactPayload) => apiClient.post("/contact", data),
};
