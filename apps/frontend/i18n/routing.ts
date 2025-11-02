import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en", "de", "it", "ro", "zh", "ru", "fr"],
  defaultLocale: "ar",
  localePrefix: "always",
  localeDetection: false,
});
