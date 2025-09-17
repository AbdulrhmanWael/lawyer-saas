"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { SiteSettings } from "@/services/siteSettings";

const COLOR_KEYS: (keyof SiteSettings["colors"]["light"])[] = [
  "colorPrimary",
  "colorSecondary",
  "colorAccent",
  "colorBg",
  "colorText",
];

export function ApplyThemeVariables() {
  const { control } = useFormContext();
  const colors = useWatch({
    control,
    name: "colors",
  }) as SiteSettings["colors"];

  useEffect(() => {
    if (!colors) return;

    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    const activeColors = isDark ? colors.dark : colors.light;

    COLOR_KEYS.forEach((key) => {
      const cssVar = "--" + key.replace(/([A-Z])/g, "-$1").toLowerCase();
      if (activeColors?.[key]) {
        html.style.setProperty(cssVar, activeColors[key]!);
      }
    });

    const observer = new MutationObserver(() => {
      const dark = html.getAttribute("data-theme") === "dark";
      const themeColors = dark ? colors.dark : colors.light;
      COLOR_KEYS.forEach((key) => {
        const cssVar = "--" + key.replace(/([A-Z])/g, "-$1").toLowerCase();
        if (themeColors?.[key])
          html.style.setProperty(cssVar, themeColors[key]!);
      });
    });

    observer.observe(html, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [colors]);

  return null;
}
