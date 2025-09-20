import { apiClient } from "@/utils/apiClient";

export interface SubscribeDto {
  email: string;
}

export interface SendNewsletterDto {
  subject: string;
  content: string;
}

export interface MailSettingsDto {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export const newsletterApi = {
  subscribe: (dto: SubscribeDto) =>
    apiClient.post("/newsletter/subscribe", dto),

  unsubscribe: (email: string) =>
    apiClient.get("/newsletter/unsubscribe", { email }),

  send: (dto: SendNewsletterDto) => apiClient.post("/newsletter/send", dto),

  updateSettings: (dto: MailSettingsDto) =>
    apiClient.post("/newsletter/settings", dto),

  getSubsrcribers: () =>
    apiClient.get<{
      id: number;
      email: string;
      createdAt: Date;
      active: boolean;
    }[]>("/newsletter/subscribers"),

  getSettings: () => apiClient.get<MailSettingsDto>("/newsletter/settings"),
};
