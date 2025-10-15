import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getLocale, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "./globals.css";
import RouteProgressBar from "./providers";
import { SiteProvider } from "./context/SiteContext";
import { Metadata } from "next";
import Script from "next/script";
import { cookies } from "next/headers";

type Props = { children: React.ReactNode };

// Server-side fetch site settings
const res = await fetch(
  process.env.NEXT_PUBLIC_BACKEND_URL + "/site-settings",
  {
    cache: "no-store",
  }
);
const siteSettings = await res.json();

export const metadata: Metadata = {
  title: siteSettings.metaTitle,
  icons: {
    icon: siteSettings.logoUrl
      ? process.env.NEXT_PUBLIC_BACKEND_URL + siteSettings.logoUrl
      : "/favicon.ico",
  },
};

export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "ar" },
    { locale: "de" },
    { locale: "fr" },
    { locale: "ru" },
    { locale: "it" },
    { locale: "ro" },
    { locale: "zh" },
  ];
}

export default async function LocaleLayout({ children }: Props) {
  const locale = await getLocale();
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";

  const colors = siteSettings?.colors?.[theme] || {};

  const styleObject = Object.entries(colors).reduce<Record<string, string>>(
    (acc, [key, val]) => {
      const kebab = key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
      acc[`--${kebab}`] = val as string;
      return acc;
    },
    {}
  );

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale} data-theme={theme} style={styleObject}>
      <head>
        {/* Optional: re-apply if user toggles theme later */}
        <Script
          id="restore-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const match = document.cookie.match(/siteSettings=([^;]+)/);
                const themeMatch = document.cookie.match(/theme=([^;]+)/);
                const theme = themeMatch ? themeMatch[1] : "light";
                if (match) {
                  const settings = JSON.parse(decodeURIComponent(match[1]));
                  const colors = settings.colors?.[theme];
                  if (colors) {
                    const root = document.documentElement;
                    for (const key in colors) {
                      if (colors[key]) {
                        const kebab = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
                        root.style.setProperty("--" + kebab, colors[key]);
                      }
                    }
                  }
                }
                document.documentElement.setAttribute("data-theme", theme);
              } catch (e) {
                console.error("Failed to restore theme:", e);
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RouteProgressBar />
          <SiteProvider>{children}</SiteProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
