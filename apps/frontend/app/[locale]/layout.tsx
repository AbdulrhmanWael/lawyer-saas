import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "./globals.css";
import RouteProgressBar from "./providers";
import { SiteProvider } from "./context/SiteContext";

type Props = {
  children: React.ReactNode;
  main: React.ReactNode;
  params: Promise<{ locale: string }>;
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

export default async function LocaleLayout({ children, main, params }: Props) {
  const { locale } = await params;
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
        <SiteProvider>{main || children}</SiteProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
