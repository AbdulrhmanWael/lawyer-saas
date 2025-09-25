"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash2 } from "lucide-react";
import CoverImageInput from "@/components/common/DropzoneImage";
import { LANGS } from "../../blogs/blog/components/BlogForm";
import { translateText } from "@/utils/translate";
import { useTranslations } from "next-intl";
import { useState } from "react";

const carouselSchema = z.object({
  header: z.record(z.string(), z.string().min(1, "Header is required")),
  paragraph: z.record(z.string(), z.string().min(1, "Paragraph is required")),
  buttonText: z.record(
    z.string(),
    z.string().min(1, "Button text is required")
  ),
  buttonLink: z.string(),
  imageFile: z.instanceof(File).optional(),
});

export type CarouselFormData = z.infer<typeof carouselSchema>;

interface CarouselItemFormProps {
  activeLang: string;
  defaultValues?: Partial<CarouselFormData>;
  onSubmit: (data: CarouselFormData) => Promise<void>;
  onDelete?: () => void;
  index?: number;
  initialPreview?: string;
  loading?: boolean;
}

export default function CarouselItemForm({
  activeLang,
  defaultValues,
  onSubmit,
  onDelete,
  index,
  initialPreview,
  loading,
}: CarouselItemFormProps) {
  const t = useTranslations("Dashboard.HomePage");
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CarouselFormData>({
    resolver: zodResolver(carouselSchema),
    defaultValues: {
      header: { [activeLang]: "", ...defaultValues?.header },
      paragraph: { [activeLang]: "", ...defaultValues?.paragraph },
      buttonText: { [activeLang]: "", ...defaultValues?.buttonText },
      buttonLink: defaultValues?.buttonLink || "",
      imageFile: undefined,
    },
  });
  const [translating, setTranslating] = useState(false);

  const handleTranslate = async () => {
    setTranslating(true);
    try {
      const values = getValues();
      const fields = ["header", "paragraph", "buttonText"] as const;

      for (const field of fields) {
        const sourceText = values[field]?.[activeLang];
        if (!sourceText) continue;

        for (const lang of LANGS.filter((l: string) => l !== activeLang)) {
          if (!values[field]?.[lang]) {
            const translated = await translateText(
              sourceText,
              activeLang,
              lang
            );
            setValue(`${field}.${lang}`, translated);
          }
        }
      }
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 border rounded shadow-sm bg-[var(--color-bg)] flex flex-col gap-2 mb-2"
    >
      <div className="flex justify-between items-center">
        <strong>
          {index !== undefined ? `Item #${index + 1}` : "New Item"}
        </strong>
        <div className="flex gap-2">
          {onDelete && (
            <button type="button" onClick={onDelete}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          )}
          <button type="submit" disabled={loading}>
            <Save className="w-4 h-4 text-green-500" />
          </button>
        </div>
      </div>

      <label>Header</label>
      <textarea
        key={`header-${activeLang}`}
        {...register(`header.${activeLang}`)}
        className="w-full border border-[var(--color-accent)] rounded p-2"
      />
      {errors.header?.[activeLang] && (
        <p className="text-red-500 text-sm">
          {errors.header[activeLang]?.message}
        </p>
      )}

      <label>Paragraph</label>
      <textarea
        key={`p-${activeLang}`}
        {...register(`paragraph.${activeLang}`)}
        className="w-full border border-[var(--color-accent)] rounded p-2"
      />
      {errors.paragraph?.[activeLang] && (
        <p className="text-red-500 text-sm">
          {errors.paragraph[activeLang]?.message}
        </p>
      )}

      <label>Button Text</label>
      <input
        key={`b-${activeLang}`}
        type="text"
        {...register(`buttonText.${activeLang}`)}
        className="w-full border border-[var(--color-accent)] rounded p-2"
      />
      {errors.buttonText?.[activeLang] && (
        <p className="text-red-500 text-sm">
          {errors.buttonText[activeLang]?.message}
        </p>
      )}

      <label>Button Link (URL)</label>
      <input
        {...register("buttonLink")}
        className="w-full border border-[var(--color-accent)] rounded p-2"
      />
      {errors.buttonLink && (
        <p className="text-red-500 text-sm">{errors.buttonLink.message}</p>
      )}

      <label>
        Image
        <Controller
          control={control}
          name="imageFile"
          render={({ field: { onChange, value } }) => (
            <CoverImageInput
              value={value ? URL.createObjectURL(value) : undefined}
              preview={
                value ? URL.createObjectURL(value) : initialPreview || undefined
              }
              onChange={(file) => onChange(file)}
            />
          )}
        />
        {errors.imageFile && (
          <p className="text-red-500 text-sm">{errors.imageFile.message}</p>
        )}
      </label>

      {/* Translate Button */}
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
    </form>
  );
}
