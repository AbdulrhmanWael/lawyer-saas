"use client";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { setCookie, getCookie } from "../../utils/cookies";
import { useSiteData } from "@/app/[locale]/context/SiteContext";
import { applyThemeColors } from "@/utils/applyThemeColors";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { siteSettings } = useSiteData();

  const THEME_KEY = "theme";
  const COOKIE_THEME = "theme_pref";

  useEffect(() => {
    const saved =
      (localStorage.getItem(THEME_KEY) as "light" | "dark") ||
      (getCookie(COOKIE_THEME) as "light" | "dark") ||
      "light";
    applyTheme(saved);
  }, []);

  function applyTheme(mode: "light" | "dark") {
    const html = document.documentElement;

    if (mode === "dark") html.setAttribute("data-theme", "dark");
    else html.removeAttribute("data-theme");

    localStorage.setItem(THEME_KEY, mode);
    setCookie(COOKIE_THEME, mode);
    setTheme(mode);

    // 👇 Reapply colors dynamically
    if (siteSettings) {
      applyThemeColors(siteSettings, mode);
    }
  }

  return (
    <button
      onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 border border-[var(--color-primary)] rounded-md hover:bg-[var(--color-accent)]/10 transition"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}
