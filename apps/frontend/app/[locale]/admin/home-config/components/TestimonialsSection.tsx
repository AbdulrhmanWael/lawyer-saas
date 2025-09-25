"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit } from "lucide-react";
import CoverImageInput from "@/components/common/DropzoneImage";
import { useTranslations } from "next-intl";
import {
  testimonialClient,
  TestimonialPayload,
} from "@/services/testimonialsService";
import { LANGS } from "../../blogs/blog/components/BlogForm";
import { translateText } from "@/utils/translate";

interface Testimonial {
  id: string;
  person: string;
  quote: Record<string, string>;
  rating: number;
  imageUrl?: string;
}

interface Props {
  activeLang: string;
}

export default function TestimonialsSection({ activeLang }: Props) {
  const t = useTranslations("Dashboard.TestimonialsSection");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<
    (Partial<Testimonial> & { imageFile?: File }) | null
  >(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await testimonialClient.getAll();
        setTestimonials(data);
      } catch (err) {
        console.error("Failed to load testimonials", err);
      }
    })();
  }, []);

  const handleAdd = () =>
    setEditing({
      person: "",
      quote: { [activeLang.toUpperCase()]: "" },
      rating: 5,
    });

  const handleEditClick = (item: Testimonial) => {
    if (editing?.id === item.id) {
      setEditing(null);
      return;
    }

    let parsedQuote: Record<string, string> = {};
    try {
      if (typeof item.quote === "string") {
        const firstParse = JSON.parse(item.quote);
        parsedQuote =
          typeof firstParse === "string" ? JSON.parse(firstParse) : firstParse;
      } else {
        parsedQuote = item.quote;
      }
    } catch (err) {
      console.error("Failed to parse quote:", err);
    }

    setEditing({ ...item, quote: parsedQuote });
  };

  const handleSave = async () => {
    if (!editing) return;

    try {
      const payload: TestimonialPayload = {
        person: editing.person || "",
        rating: editing.rating || 5,
        quote: editing.quote || { [activeLang.toUpperCase()]: "" },
        image: editing.imageFile,
      };

      if (editing.id) {
        const updated = await testimonialClient.update(editing.id, payload);
        setTestimonials((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
      } else {
        const created = await testimonialClient.create(payload);
        setTestimonials((prev) => [...prev, created]);
      }

      setEditing(null);
    } catch (err) {
      console.error("Failed to save testimonial", err);
      alert("Error saving testimonial");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await testimonialClient.delete(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete testimonial", err);
      alert("Error deleting testimonial");
    }
  };

  const handleTranslate = async () => {
    if (!editing) return;
    setTranslating(true);

    try {
      const sourceText = editing.quote?.[activeLang.toUpperCase()];
      if (!sourceText) return;

      for (const lang of LANGS.filter((l) => l !== activeLang.toUpperCase())) {
        if (!editing.quote?.[lang]) {
          const translated = await translateText(
            sourceText,
            activeLang.toLowerCase(),
            lang.toLowerCase()
          );
          setEditing((prev) =>
            prev
              ? {
                  ...prev,
                  quote: { ...prev.quote, [lang]: translated },
                }
              : prev
          );
        }
      }
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4">{t("testimonialsSection")}</h2>

      {editing ? (
        <div className="p-4 border rounded bg-[var(--color-bg)] flex flex-col gap-2">
          <label>{t("person")}</label>
          <input
            key={`p-${activeLang}`}
            type="text"
            value={editing.person}
            onChange={(e) => setEditing({ ...editing, person: e.target.value })}
            className="w-full border border-[var(--color-accent)] rounded p-2"
          />

          <label>{t("quote")}</label>
          <textarea
            key={`q-${activeLang}`}
            value={editing.quote?.[activeLang.toUpperCase()] || ""}
            onChange={(e) =>
              setEditing({
                ...editing,
                quote: {
                  ...editing.quote,
                  [activeLang.toUpperCase()]: e.target.value,
                },
              })
            }
            className="w-full border border-[var(--color-accent)] rounded p-2 min-h-[100px]"
          />

          <label>{t("rating")}</label>
          <input
            type="number"
            min={1}
            max={5}
            value={editing.rating}
            onChange={(e) =>
              setEditing({ ...editing, rating: parseInt(e.target.value) })
            }
            className="w-24 border border-[var(--color-accent)] rounded p-2"
          />

          <label>{t("image")}</label>
          <CoverImageInput
            value={editing.imageUrl}
            preview={
              editing.imageFile
                ? URL.createObjectURL(editing.imageFile)
                : editing.imageUrl
                  ? process.env.NEXT_PUBLIC_BACKEND_URL! + editing.imageUrl
                  : null
            }
            onChange={(file) => setEditing({ ...editing, imageFile: file })}
          />

          <div className="flex gap-3 mt-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-[var(--color-primary)] text-white"
            >
              {t("submit")}
            </button>
            <button
              type="button"
              onClick={handleTranslate}
              disabled={translating}
              className={`px-4 py-2 rounded text-white ${
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
      ) : (
        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded bg-[var(--color-accent)] text-white flex items-center gap-2 mb-4"
        >
          + {t("addTestimonial")}
        </button>
      )}

      <div className="space-y-2">
        {testimonials.map((tItem) => (
          <div
            key={tItem.id}
            className="p-2 border rounded flex justify-between items-center bg-[var(--color-bg)]"
          >
            <div>
              <p className="font-semibold">{tItem.person}</p>
              <p className="text-sm">
                {tItem.quote[activeLang.toUpperCase()] || ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEditClick(tItem)}>
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(tItem.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
