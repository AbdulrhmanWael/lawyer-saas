import { apiClient } from "@/utils/apiClient";

export interface SiteSettings {
  id: string;
  logoUrl?: string | null;
  metaTitle?:string | null;
  metaDescription?:string | null;
  footer: {
    email?: string;
    phone?: string;
    social?: Record<string, string>;
    address?: string;
  };
  colors: {
    light: {
      colorPrimary?: string;
      colorSecondary?: string;
      colorHeaderBg?: string;
      colorAccent?: string;
      colorBg?: string;
      colorText?: string;
    };
    dark?: {
      colorPrimary?: string;
      colorHeaderBg?: string;
      colorSecondary?: string;
      colorAccent?: string;
      colorBg?: string;
      colorText?: string;
    };
  };
  updatedAt: string;
}

export const siteSettingsApi = {
  get: () => apiClient.get<SiteSettings>("/site-settings"),
  update: (formData: FormData) =>
    apiClient.patch<SiteSettings>("/site-settings", formData),
};
