import { apiClient } from "@/utils/apiClient";

export const contentService = {
  getAbout: () =>
    apiClient.get<{ id: number; content: Record<string, string> }>("/about"),
  updateAbout: (content: Record<string, string>) =>
    apiClient.put<{ id: number; content: Record<string, string> }>("/about", {
      content,
    }),

  getPrivacyPolicy: () =>
    apiClient.get<{ id: number; content: Record<string, string> }>(
      "/privacy-policy"
    ),
  updatePrivacyPolicy: (content: Record<string, string>) =>
    apiClient.put<{ id: number; content: Record<string, string> }>(
      "/privacy-policy",
      { content }
    ),
};
