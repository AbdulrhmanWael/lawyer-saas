import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "ar", "it", "ro", "zh", "ru"],
  defaultLocale: "en",
});
