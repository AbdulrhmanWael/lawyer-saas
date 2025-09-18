import { apiClient } from "@/utils/apiClient";

export type TranslatableString = Record<string, string>;

export interface Faq {
  id: string;
  question: TranslatableString;
  answer: TranslatableString;
}

export interface FaqGroup {
  id: string;
  title: TranslatableString;
  faqs: Faq[];
}

export const faqService = {

  createGroup: (title: TranslatableString) =>
    apiClient.post<FaqGroup>("/faq-groups", { title }),

  getGroups: () => apiClient.get<FaqGroup[]>("/faq-groups"),

  getGroup: (id: string) => apiClient.get<FaqGroup>(`/faq-groups/${id}`),

  updateGroup: (id: string, title: TranslatableString) =>
    apiClient.put<FaqGroup>(`/faq-groups/${id}`, { title }),

  deleteGroup: (id: string) => apiClient.delete<void>(`/faq-groups/${id}`),


  createFaq: (groupId: string, question: TranslatableString, answer: TranslatableString) =>
    apiClient.post<Faq>("/faqs", { groupId, question, answer }),

  getFaqs: () => apiClient.get<Faq[]>("/faqs"),

  searchFaqs: (query: string) => apiClient.get<Faq[]>("/faqs/search", { q: query }),

  updateFaq: (id: string, question: TranslatableString, answer: TranslatableString) =>
    apiClient.put<Faq>(`/faqs/${id}`, { question, answer }),

  deleteFaq: (id: string) => apiClient.delete<void>(`/faqs/${id}`),
};
