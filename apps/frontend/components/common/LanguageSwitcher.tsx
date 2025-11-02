// components/LanguageSwitcher.tsx
"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setCookie, getCookie } from "../../utils/cookies";
import ReactCountryFlag from "react-country-flag";

const LANGS = [
  { code: "ar", countryCode: "SA", label: "العربية" },
  { code: "en", countryCode: "GB", label: "English" },
  { code: "de", countryCode: "DE", label: "Deutsch" },
  { code: "fr", countryCode: "FR", label: "Français" },
  { code: "ru", countryCode: "RU", label: "Русский" },
  { code: "it", countryCode: "IT", label: "Italiano" },
  { code: "ro", countryCode: "RO", label: "Română" },
  { code: "zh", countryCode: "CN", label: "中文" },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState("ar");
  const searchParams = useSearchParams();

  const LOCALE_KEY = "preferred-locale";
  const COOKIE_LOCALE = "locale_pref";

  useEffect(() => {
    const saved =
      localStorage.getItem(LOCALE_KEY) ||
      getCookie(COOKIE_LOCALE) ||
      pathname.split("/")[1] ||
      "en";
    setLocale(saved);
    document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
  }, [pathname]);

  const changeLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    if (segments.length > 1) segments[1] = newLocale;

    const query = searchParams.toString();
    const newPath =
      (segments.join("/") || `/${newLocale}/`) + (query ? `?${query}` : "");

    setLocale(newLocale);
    setCookie(COOKIE_LOCALE, newLocale);
    localStorage.setItem(LOCALE_KEY, newLocale);
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";

    router.replace(newPath);
    setOpen(false);
  };

  const currentLang = LANGS.find((l) => l.code === locale)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--color-primary)] bg-[var(--color-bg)] hover:bg-[var(--color-bg)]/10 transition"
      >
        <ReactCountryFlag
          countryCode={currentLang.countryCode}
          svg
          style={{ width: "1.2em", height: "1.2em" }}
        />
        <span className="text-sm hidden md:inline">{currentLang.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-[var(--color-bg)] border border-[var(--color-primary)] rounded-md shadow-lg z-50">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => changeLocale(l.code)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 transition"
            >
              <ReactCountryFlag
                countryCode={l.countryCode}
                svg
                style={{ width: "1.2em", height: "1.2em" }}
              />
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
