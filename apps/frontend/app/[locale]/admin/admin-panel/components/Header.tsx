"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const LANGUAGES = ["en", "ar", "de", "fr", "ru", "it", "ro", "zh"];
const LS_KEY = "preferred-locale";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState<string>(LANGUAGES[0]);

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY);
    const currentLocaleInURL = pathname.split("/")[1];

    if (stored && LANGUAGES.includes(stored) && stored !== currentLocaleInURL) {
      const segments = pathname.split("/");
      segments[1] = stored;
      router.replace(segments.join("/"));
      setLocale(stored);
    } else {
      setLocale(currentLocaleInURL);
    }
  }, [pathname, router]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    setLocale(newLocale);
    localStorage.setItem(LS_KEY, newLocale);

    // Replace current locale in URL
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
      <h1 className="text-lg font-bold">Admin Panel</h1>
      <div>
        <select
          value={locale}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-1"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
