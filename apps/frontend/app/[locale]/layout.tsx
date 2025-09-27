import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getLocale, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "./globals.css";
import RouteProgressBar from "./providers";
import { SiteProvider } from "./context/SiteContext";
import { Metadata } from "next";

type Props = {
  children: React.ReactNode;
};
const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/site-settings");
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
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale '${locale}':`, error);
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RouteProgressBar />
          <SiteProvider>{children}</SiteProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
