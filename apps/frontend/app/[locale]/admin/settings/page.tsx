import { SiteSettings, siteSettingsApi } from "@/services/siteSettings";
import SettingsClient from "./SettingsClient";

function normalizeSettings(res: SiteSettings) {
  return {
    logoUrl: res.logoUrl ?? null,
    footer: res.footer || { email: "", phone: "", social: {}, address: "" },
    metaTitle: res.metaTitle ?? null,
    metaDescription: res.metaDescription ?? null,
    colors:
      typeof res.colors === "string"
        ? JSON.parse(res.colors)
        : res.colors || { light: {}, dark: {} },
  };
}

export default async function SettingsPage() {
  const settings = await siteSettingsApi.get();
  const normalized = normalizeSettings(settings);

  return <SettingsClient initialSettings={normalized} />;
}
