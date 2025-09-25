"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { whyUsService } from "@/services/whyUsService";
import { LANGS } from "../../blogs/blog/components/BlogForm";
import { translateText } from "@/utils/translate";

interface WhyUsData {
  title: Record<string, string>;
  paragraph: Record<string, string>;
  buttonText: Record<string, string>;
}

interface Props {
  activeLang: string;
}

export default function WhyUsSection({ activeLang }: Props) {
  const t = useTranslations("Dashboard.WhyUsSection");

  const [data, setData] = useState<WhyUsData>({
    title: {},
    paragraph: {},
    buttonText: {},
  });

  const [entryId, setEntryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const allEntries = await whyUsService.getAll();
        if (allEntries.length > 0) {
          const entry = allEntries[0];
          setData({
            title: entry.title,
            paragraph: entry.paragraph,
            buttonText: entry.buttonText,
          });
          setEntryId(entry.id);
        }
      } catch (err) {
        console.error("Failed to fetch Why Us entry:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (field: keyof WhyUsData, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [activeLang]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      if (entryId) {
        await whyUsService.update(entryId, data);
      } else {
        const created = await whyUsService.create(data);
        setEntryId(created.id);
      }
    } catch (err) {
      console.error("Failed to submit Why Us:", err);
    }
  };

  const handleTranslate = async () => {
    setTranslating(true);
    try {
      const fields: (keyof WhyUsData)[] = ["title", "paragraph", "buttonText"];

      for (const field of fields) {
        const sourceText = data[field][activeLang];
        if (!sourceText) continue;

        for (const lang of LANGS.filter((l) => l !== activeLang)) {
          if (data[field][lang]) {
            const translated = await translateText(
              sourceText,
              activeLang.toLowerCase(),
              lang.toLowerCase()
            );
            setData((prev) => ({
              ...prev,
              [field]: { ...prev[field], [lang]: translated },
            }));
          }
        }
      }
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setTranslating(false);
    }
  };

  if (loading) return <p>{t("loading")}</p>;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4">{t("whyUsSection")}</h2>
      <div className="flex flex-col gap-4">
        <div>
          <label>{t("title")}</label>
          <input
            key={`title-${activeLang}`}
            type="text"
            value={data.title[activeLang] || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full border border-[var(--color-accent)] rounded p-2"
          />
        </div>

        <div>
          <label>{t("paragraph")}</label>
          <textarea
            key={`p-${activeLang}`}
            value={data.paragraph[activeLang] || ""}
            onChange={(e) => handleChange("paragraph", e.target.value)}
            className="w-full border border-[var(--color-accent)] rounded p-2 min-h-[150px]"
          />
        </div>

        <div>
          <label>{t("buttonText")}</label>
          <input
            key={`b-${activeLang}`}
            type="text"
            value={data.buttonText[activeLang] || ""}
            onChange={(e) => handleChange("buttonText", e.target.value)}
            className="w-full border border-[var(--color-accent)] rounded p-2"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 rounded bg-[var(--color-primary)] text-white"
          >
            {t("submitWhyUs")}
          </button>
          <button
            type="button"
            onClick={handleTranslate}
            disabled={translating}
            className={`px-6 py-2 rounded text-white ${
              translating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[var(--color-accent)]"
            }`}
          >
            {translating ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                {t("translating")}
              </>
            ) : (
              t("translate")
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
