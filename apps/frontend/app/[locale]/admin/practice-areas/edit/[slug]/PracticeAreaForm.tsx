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
import {
  runWithThrottle,
  sanitizeDoc,
  translateText,
  translateTiptapJSON,
} from "@/utils/translate";
import { htmlToJSON, jsonToHTML } from "@/utils/tipTapConverter";

const LANGS = ["EN", "AR", "DE", "RO", "RU", "ZH", "IT", "FR"];

export function normalizeField<T = Record<string, string>>(
  field: string | T | null
): T {
  if (!field) return {} as T;
  if (typeof field === "string") {
    try {
      return JSON.parse(field) as T;
    } catch {
      return {} as T;
    }
  }
  return field as T;
}
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

export default function PracticeAreaForm({
  initialData,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any;
}) {
  const t = useTranslations("Dashboard.PracticeAreaForm");
  const [translating, setTranslating] = useState(false);
  const router = useRouter();
  const [activeLang, setActiveLang] = useState("EN");
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.logoUrl || null
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.coverImageUrl || null
  );

  const parsedSeoMeta = normalizeField(initialData.seoMeta);

  const contentAsJSON: Record<string, string> = {};
  LANGS.forEach((lang) => {
    const contentHtml = typeof initialData.contentHtml === "string" ? JSON.parse(initialData.contentHtml) : initialData.contentHtml;
    if (contentHtml[lang]) {
      contentAsJSON[lang] = htmlToJSON(contentHtml[lang]);
    } else {
      contentAsJSON[lang] = htmlToJSON("<p></p>");
    }
  });
  console.log(contentAsJSON);

  const form = useForm<FormData>({
    resolver: zodResolver(practiceAreaSchema),
    defaultValues: {
      title: normalizeField(initialData.title),
      excerpt: normalizeField(initialData.excerpt),
      contentHtml: contentAsJSON,
      logoUrl: undefined,
      coverImageUrl: undefined,
      seoMeta: {
        title: parsedSeoMeta?.title ?? {},
        description: parsedSeoMeta?.description ?? {},
        canonical: parsedSeoMeta?.canonical ?? "",
      },
    },
  });

  const handleTabSwitch = (lang: string) => {
    const currentTitle = form.getValues(`title.${activeLang}`);
    const currentExcerpt = form.getValues(`excerpt.${activeLang}`);
    const currentContent = form.getValues(`contentHtml.${activeLang}`);

    form.setValue(`title.${activeLang}`, currentTitle ?? "", {
      shouldValidate: false,
    });
    form.setValue(`excerpt.${activeLang}`, currentExcerpt ?? "", {
      shouldValidate: false,
    });
    form.setValue(`contentHtml.${activeLang}`, currentContent ?? "", {
      shouldValidate: false,
    });

    setActiveLang(lang);
  };

  const onSubmit = async (data: FormData) => {
    const sanitizeRecord = (rec: Record<string, string | undefined>) =>
      Object.fromEntries(Object.entries(rec).map(([k, v]) => [k, v ?? ""]));

    console.log(data.contentHtml[activeLang]);

    const contentAsHTML: Record<string, string> = {};
    LANGS.forEach((lang) => {
      if (data.contentHtml?.[lang]) {
        contentAsHTML[lang] = jsonToHTML(data.contentHtml[lang]);
      } else {
        contentAsHTML[lang] = "<p></p>";
      }
    });

    const payload = {
      ...data,
      contentHtml: contentAsHTML,
      seoMeta: {
        title: sanitizeRecord(data.seoMeta.title),
        description: sanitizeRecord(data.seoMeta.description),
        canonical: data.seoMeta.canonical ?? "",
      },
    };

    await practiceAreaService.update(
      initialData.id,
      payload,
      data.logoUrl instanceof File ? data.logoUrl : undefined,
      data.coverImageUrl instanceof File ? data.coverImageUrl : undefined
    );
    router.push("/admin/practice-areas");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t("editHeader")}</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <LanguageTabs
          languages={LANGS}
          activeLang={activeLang}
          onChange={handleTabSwitch}
        />

        {/* Slug */}
        <div>
          <label className="block font-bold text-lg mb-2">{t("slug")}</label>
          <input
            type="text"
            value={initialData.slug}
            disabled
            className="text-input bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block font-bold text-lg mb-2">{t("title")}</label>
          <input
            key={`title-${activeLang}`}
            type="text"
            {...form.register(`title.${activeLang}`)}
            className="text-input"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block font-bold text-lg mb-2">{t("excerpt")}</label>
          <textarea
            key={`excerpt-${activeLang}`}
            {...form.register(`excerpt.${activeLang}`)}
            className="w-full border rounded p-2 min-h-[150px]"
          />
        </div>

        {/* ContentHtml */}
        <div>
          <label className="block font-bold text-lg mb-2">{t("content")}</label>
          <Controller
            key={`content-${activeLang}`}
            name={`contentHtml.${activeLang}`}
            control={form.control}
            render={({ field }) => {
              const parsedValue = field.value
                ? JSON.parse(field.value)
                : { type: "doc", content: [] };
              return (
                <RichTextEditor
                  key={`editor-${activeLang}`}
                  value={parsedValue}
                  onChange={(val) =>
                    form.setValue(`contentHtml.${activeLang}`, val)
                  }
                />
              );
            }}
          />
        </div>

        {/* Logo */}
        <div>
          <label className="block font-bold text-lg mb-2">
            {t("logoImage")}
          </label>
          <Controller
            name="logoUrl"
            control={form.control}
            render={({ field }) => (
              <CoverImageInput
                value={field.value}
                preview={
                  logoPreview
                    ? process.env.NEXT_PUBLIC_BACKEND_API + logoPreview
                    : ""
                }
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
          <label className="block font-bold text-lg mb-2">
            {t("coverImage")}
          </label>
          <Controller
            name="coverImageUrl"
            control={form.control}
            render={({ field }) => (
              <CoverImageInput
                value={field.value}
                preview={
                  coverPreview?.startsWith("blob")
                    ? coverPreview
                    : coverPreview
                      ? process.env.NEXT_PUBLIC_BACKEND_URL! + coverPreview
                      : coverPreview
                }
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
          <h2 className="text-lg font-semibold mb-2">{t("seoMeta")}</h2>
          <div>
            <label className="block font-bold mb-1">{t("seoTitle")}</label>
            <input
              type="text"
              key={`seo-title-${activeLang}`}
              {...form.register(`seoMeta.title.${activeLang}`)}
              className="text-input"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">
              {t("seoDescription")}
            </label>
            <textarea
              key={`seo-desc-${activeLang}`}
              {...form.register(`seoMeta.description.${activeLang}`)}
              className="w-full border rounded p-2 min-h-[80px]"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">{t("seoCanonical")}</label>
            <input
              type="text"
              {...form.register("seoMeta.canonical")}
              className="text-input"
            />
          </div>
        </div>

        <button
          type="button"
          className={`px-4 py-2 rounded text-white flex items-center gap-2 ${
            translating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[var(--color-accent)]"
          }`}
          disabled={translating}
          onClick={async () => {
            setTranslating(true);
            try {
              const tasks = LANGS.filter((l) => l !== activeLang).map(
                (lang) => async () => {
                  const title = form.getValues("title")[activeLang];
                  const excerpt = form.getValues("excerpt")[activeLang];
                  const contentJSON = form.getValues("contentHtml")[activeLang];
                  const parsed = contentJSON ? JSON.parse(contentJSON) : null;

                  const [
                    translatedTitle,
                    translatedExcerpt,
                    translatedContent,
                  ] = await Promise.all([
                    translateText(
                      title,
                      activeLang.toLowerCase(),
                      lang.toLowerCase()
                    ),
                    translateText(
                      excerpt,
                      activeLang.toLowerCase(),
                      lang.toLowerCase()
                    ),
                    parsed
                      ? translateTiptapJSON(
                          parsed,
                          activeLang.toLowerCase(),
                          lang.toLowerCase()
                        )
                      : null,
                  ]);

                  form.setValue(`title.${lang}`, translatedTitle, {
                    shouldDirty: true,
                  });
                  form.setValue(`excerpt.${lang}`, translatedExcerpt, {
                    shouldDirty: true,
                  });

                  if (translatedContent) {
                    const sanitized = sanitizeDoc(translatedContent);
                    form.setValue(
                      `contentHtml.${lang}`,
                      JSON.stringify(sanitized),
                      {
                        shouldDirty: true,
                        shouldTouch: true,
                      }
                    );
                  }
                }
              );

              await runWithThrottle(tasks);
            } finally {
              setTranslating(false);
            }
          }}
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              {t("translating")}
            </>
          ) : (
            t("translate")
          )}
        </button>

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
