"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import clsx from "clsx";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { SiteSettings } from "@/services/siteSettings";

const COLOR_KEYS: (keyof SiteSettings["colors"]["light"])[] = [
  "colorPrimary",
  "colorSecondary",
  "colorAccent",
  "colorBg",
  "colorText",
];

const DEFAULT_COLOR = "#ffffff";

export default function ColorsSection({
  initialColors,
}: {
  initialColors: Record<string, Record<string, string>>;
}) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const { control } = useFormContext();
  const t = useTranslations("Dashboard.settings");

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("colors")}</h2>

        {/* Light/Dark Switcher */}
        <div className="flex rounded-xl border p-1 bg-[var(--color-accent)]">
          {(["light", "dark"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={clsx(
                "px-4 py-1 rounded-lg text-sm font-medium transition",
                mode === m
                  ? "bg-[var(--color-bg)] shadow text-[var(--color-primary)]"
                  : "text-[var(--color-secondary)] hover:bg-gray-200"
              )}
            >
              {m === "light" ? t("lightMode") : t("darkMode")}
            </button>
          ))}
        </div>
      </div>

      {/* Render both sets but only show the active one */}
      {(["light", "dark"] as const).map((m) => (
        <div
          key={m}
          className={clsx(
            "grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity",
            mode === m ? "opacity-100" : "opacity-0 hidden"
          )}
        >
          {COLOR_KEYS.map((key) => (
            <Controller
              key={key}
              name={`colors.${m}.${key}`}
              control={control}
              defaultValue={initialColors[m]?.[key] || DEFAULT_COLOR}
              render={({ field }) => (
                <div className="flex flex-col gap-2 border rounded-xl p-4 shadow-sm bg-[var(--color-bg)]">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-[var(--color-text)]">
                      {t(key)}
                    </label>
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: field.value }}
                    />
                  </div>

                  <HexColorPicker
                    color={field.value || DEFAULT_COLOR}
                    onChange={field.onChange}
                  />

                  <input
                    type="text"
                    {...field}
                    className="border rounded-lg p-2 text-sm font-mono w-full"
                  />
                </div>
              )}
            />
          ))}
        </div>
      ))}
    </section>
  );
}
