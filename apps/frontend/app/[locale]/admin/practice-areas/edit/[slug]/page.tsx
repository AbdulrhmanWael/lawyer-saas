"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { practiceAreaService } from "@/services/practiceAreaService";
import RichTextEditor from "@/components/common/RichTextEditor";
import LanguageTabs from "@/components/common/LanguageTabs";
import CoverImageInput from "@/components/common/DropzoneImage";
import { usePracticeAreas } from "../../../context/PracticeAreaContext";

const LANGS = ["EN", "AR", "DE", "RO", "RU", "ZH", "IT", "FR"];

const practiceAreaSchema = z.object({
  title: z.record(z.string(), z.string().min(1, "Title is required")),
  excerpt: z.record(z.string(), z.string().min(1, "Excerpt is required")),
  contentHtml: z.record(z.string(), z.string().min(1, "Content is required")),
  logoUrl: z.any().optional(),
  coverImageUrl: z.any().optional(),
  seoMeta: z.object({
    title: z.record(z.string(), z.string().optional()),
    description: z.record(z.string(), z.string().optional()),
    canonical: z.string().optional(),
  }),
});

type FormData = z.infer<typeof practiceAreaSchema>;

export default function PracticeAreaForm() {
  const { selectedPracticeArea } = usePracticeAreas();
  const t = useTranslations("Dashboard.PracticeAreaForm");
  const router = useRouter();
  const [activeLang, setActiveLang] = useState("EN");
  const [logoPreview, setLogoPreview] = useState<string | null>(
    selectedPracticeArea?.logoUrl || null
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    selectedPracticeArea?.coverImageUrl || null
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(practiceAreaSchema),
    defaultValues: {
      title: selectedPracticeArea!.title,
      excerpt: selectedPracticeArea!.excerpt ?? {},
      contentHtml: selectedPracticeArea!.contentHtml ?? {},
      logoUrl: undefined,
      coverImageUrl: undefined,
      seoMeta: selectedPracticeArea!.seoMeta ?? {
        title: {},
        description: {},
        canonical: "",
      },
    },
  });

  const handleTabSwitch = (lang: string) => {
    (["title", "excerpt", "contentHtml"] as const).forEach((field) => {
      const key = `${field}.${activeLang}` as const;
      const val = getValues(key);
      setValue(key, val ?? "");
    });

    LANGS.forEach(() => {
      const seoTitle = getValues(`seoMeta.title.${activeLang}`);
      const seoDesc = getValues(`seoMeta.description.${activeLang}`);
      setValue(`seoMeta.title.${activeLang}`, seoTitle ?? "");
      setValue(`seoMeta.description.${activeLang}`, seoDesc ?? "");
    });
    setActiveLang(lang);
  };

  const onSubmit = async (data: FormData) => {
    const sanitizeRecord = (rec: Record<string, string | undefined>) =>
      Object.fromEntries(Object.entries(rec).map(([k, v]) => [k, v ?? ""]));

    const payload = {
      ...data,
      seoMeta: {
        title: sanitizeRecord(data.seoMeta.title),
        description: sanitizeRecord(data.seoMeta.description),
        canonical: data.seoMeta.canonical ?? "",
      },
    };
    await practiceAreaService.update(
      selectedPracticeArea!.id,
      payload,
      data.logoUrl instanceof File ? data.logoUrl : undefined,
      data.coverImageUrl instanceof File ? data.coverImageUrl : undefined
    );
    router.push("/admin/practice-areas");
  };

  if (!selectedPracticeArea)
    return <p className="p-6 text-red-500">No practice area selected</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t("editHeader")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <LanguageTabs
          languages={LANGS}
          activeLang={activeLang}
          onChange={handleTabSwitch}
        />

        {/* Slug */}
        <div>
          <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
            {t("slug")}
          </label>
          <input
            type="text"
            value={selectedPracticeArea.slug}
            disabled
            className="text-input bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
            {t("title")}
          </label>
          <input
            key={`title-${activeLang}`}
            type="text"
            {...register(`title.${activeLang}`)}
            className="text-input"
          />
          {errors.title?.[activeLang] && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title[activeLang]?.message}
            </p>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
            {t("excerpt")}
          </label>
          <textarea
            key={`excerpt-${activeLang}`}
            {...register(`excerpt.${activeLang}`)}
            className="w-full border border-[var(--color-accent)] rounded p-2 min-h-[150px]"
          />
          {errors.excerpt?.[activeLang] && (
            <p className="text-red-500 text-sm mt-1">
              {errors.excerpt[activeLang]?.message}
            </p>
          )}
        </div>

        {/* ContentHtml */}
        <div>
          <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
            {t("content")}
          </label>
          <Controller
            key={`content-${activeLang}`}
            name={`contentHtml.${activeLang}`}
            control={control}
            render={({ field }) => (
              <RichTextEditor
                key={`editor-${activeLang}`}
                value={field.value ?? ""}
                onChange={(val) => setValue(`contentHtml.${activeLang}`, val)}
              />
            )}
          />
          {errors.contentHtml?.[activeLang] && (
            <p className="text-red-500 text-sm mt-1">
              {errors.contentHtml[activeLang]?.message}
            </p>
          )}
        </div>

        {/* Logo */}
        <div>
          <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
            {t("logoImage")}
          </label>
          <Controller
            name="logoUrl"
            control={control}
            render={({ field }) => (
              <CoverImageInput
                value={field.value}
                preview={logoPreview}
                onChange={(file) => {
                  field.onChange(file);
                  setLogoPreview(URL.createObjectURL(file));
                }}
              />
            )}
          />
        </div>

        {/* Cover */}
        <div>
          <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
            {t("coverImage")}
          </label>
          <Controller
            name="coverImageUrl"
            control={control}
            render={({ field }) => (
              <CoverImageInput
                value={field.value}
                preview={coverPreview}
                onChange={(file) => {
                  field.onChange(file);
                  setCoverPreview(URL.createObjectURL(file));
                }}
              />
            )}
          />
        </div>

        {/* SEO Meta */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
            {t("seoMeta")}
          </h2>
          <div>
            <label className="block font-bold text-[var(--color-text)] mb-1">
              {t("seoTitle")}
            </label>
            <input
              type="text"
              key={`seo-title-${activeLang}`}
              {...register(`seoMeta.title.${activeLang}`)}
              className="text-input"
            />
          </div>
          <div>
            <label className="block font-bold text-[var(--color-text)] mb-1">
              {t("seoDescription")}
            </label>
            <textarea
              key={`seo-desc-${activeLang}`}
              {...register(`seoMeta.description.${activeLang}`)}
              className="w-full border border-[var(--color-accent)] rounded p-2 min-h-[80px]"
            />
          </div>
          <div>
            <label className="block font-bold text-[var(--color-text)] mb-1">
              {t("seoCanonical")}
            </label>
            <input
              type="text"
              {...register("seoMeta.canonical")}
              className="text-input"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-2 rounded bg-[var(--color-primary)] text-white"
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
