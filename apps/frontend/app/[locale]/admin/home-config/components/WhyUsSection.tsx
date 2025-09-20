"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { whyUsService } from "@/services/whyUsService";

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

  // fetch existing entry
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
        alert(t("updatedSuccessfully"));
      } else {
        const created = await whyUsService.create(data);
        setEntryId(created.id);
        alert(t("createdSuccessfully"));
      }
    } catch (err) {
      console.error("Failed to submit Why Us:", err);
      alert(t("submitFailed"));
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
            type="text"
            value={data.title[activeLang] || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full border border-[var(--color-accent)] rounded p-2"
          />
        </div>

        <div>
          <label>{t("paragraph")}</label>
          <textarea
            value={data.paragraph[activeLang] || ""}
            onChange={(e) => handleChange("paragraph", e.target.value)}
            className="w-full border border-[var(--color-accent)] rounded p-2 min-h-[150px]"
          />
        </div>

        <div>
          <label>{t("buttonText")}</label>
          <input
            type="text"
            value={data.buttonText[activeLang] || ""}
            onChange={(e) => handleChange("buttonText", e.target.value)}
            className="w-full border border-[var(--color-accent)] rounded p-2"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 rounded bg-[var(--color-primary)] text-white"
        >
          {t("submitWhyUs")}
        </button>
      </div>
    </section>
  );
}
