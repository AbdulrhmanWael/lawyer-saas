import { SiteSettings } from "@/services/siteSettings";

export function applyThemeColors(settings: SiteSettings, theme?: "light" | "dark") {
  const root = document.documentElement;

  const activeTheme = theme || (root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  const light = settings.colors.light;
  const dark = settings.colors.dark;

  if (light) {
    root.style.setProperty("--color-primary", light.colorPrimary || "#2563eb");
    root.style.setProperty("--color-secondary", light.colorSecondary || "#222");
    root.style.setProperty("--color-accent", light.colorAccent || "#3b82f6");
    root.style.setProperty("--color-bg", light.colorBg || "#ffffff");
    root.style.setProperty("--color-text", light.colorText || "#1a1a1a");
    root.style.setProperty("--color-header-bg", light.colorHeaderBg || "#ffffff");
  }

  if (dark) {
    const darkSelector = document.querySelector<HTMLElement>("[data-theme='dark']");
    if (darkSelector) {
      darkSelector.style.setProperty("--color-primary", dark.colorPrimary || "#60a5fa");
      darkSelector.style.setProperty("--color-secondary", dark.colorSecondary || "#ddd");
      darkSelector.style.setProperty("--color-accent", dark.colorAccent || "#93c5fd");
      darkSelector.style.setProperty("--color-bg", dark.colorBg || "#121212");
      darkSelector.style.setProperty("--color-text", dark.colorText || "#e5e7eb");
      darkSelector.style.setProperty("--color-header-bg", dark.colorHeaderBg || "#121212");
    }
  }

  if (activeTheme === "dark" && dark) {
    Object.entries(dark).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--${camelToKebab(key)}`, value);
    });
  } else if (activeTheme === "light" && light) {
    Object.entries(light).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--${camelToKebab(key)}`, value);
    });
  }
}

function camelToKebab(str: string) {
  return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}
