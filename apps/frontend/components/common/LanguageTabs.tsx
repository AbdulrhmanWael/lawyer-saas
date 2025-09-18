"use client";

import React from "react";

interface LanguageTabsProps {
  languages: string[];
  activeLang: string;
  onChange: (lang: string) => void;
  className?: string;
}

export default function LanguageTabs({
  languages,
  activeLang,
  onChange,
  className = "",
}: Readonly<LanguageTabsProps>) {
  return (
    <div
      className={`flex border-b border-[var(--color-primary)] mb-4 ${className}`}
    >
      {languages.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={`px-4 py-2 -mb-px border-b-2 font-medium transition-all duration-400 ease-in-out ${
            activeLang === lang
              ? "border-[var(--color-primary)] text-[var(--color-primary)]"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-[var(--color-primary)]"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
