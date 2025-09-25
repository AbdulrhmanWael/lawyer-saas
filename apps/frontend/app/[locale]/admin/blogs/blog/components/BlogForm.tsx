"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { getBlog, createBlog, updateBlog, Blog } from "@/services/blogs";
import {
  getCategories,
  createCategory,
  deleteCategory,
  Category,
} from "@/services/categories";

import Modal from "@/components/common/Modal";
import RichTextEditor from "@/components/common/RichTextEditor";
import CoverImageInput from "@/components/common/DropzoneImage";
import CategorySelect from "./CategorySelect";
import ToggleSwitch from "@/components/common/ToggleSwitch";
import LanguageTabs from "@/components/common/LanguageTabs";
import {
  runWithThrottle,
  sanitizeDoc,
  translateText,
  translateTiptapJSON,
} from "@/utils/translate";
import { htmlToJSON, jsonToHTML } from "@/utils/tipTapConverter";


const blogSchema = z.object({
  title: z.record(z.string(), z.string().min(1, "Title is required")),
  categoryId: z.string().min(1, "Category is required"),
  coverImage: z.any().optional(),
  content: z.record(z.string(), z.string().min(1, "Content is required")),
  draft: z.boolean(),
  published: z.boolean(),
  inactive: z.boolean(),
});

type BlogFormData = z.infer<typeof blogSchema>;

export const LANGS = ["EN", "AR", "DE", "RO", "RU", "ZH", "IT", "FR"];

export default function BlogForm() {
  const t = useTranslations("Dashboard.BlogForm");
  const router = useRouter();
  const [translating, setTranslating] = useState(false);
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id;

  const [activeLang, setActiveLang] = useState("EN");
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: Object.fromEntries(LANGS.map((l) => [l, ""])),
      content: Object.fromEntries(LANGS.map((l) => [l, ""])),
      draft: false,
      published: false,
      inactive: true,
    },
  });

  useEffect(() => {
    if (isEdit && params.id) {
      getBlog(params.id).then((blog: Blog) => {
        const contentAsJSON: Record<string, string> = {};
        LANGS.forEach((lang) => {
          if (blog.content?.[lang]) {
            contentAsJSON[lang] = htmlToJSON(blog.content[lang]);
          } else {
            contentAsJSON[lang] = htmlToJSON("<p></p>");
          }
        });

        reset({
          title: blog.title,
          categoryId: blog.category.id,
          coverImage: blog.coverImage,
          content: contentAsJSON,
          draft: blog.draft,
          published: blog.published,
        });

        if (blog.coverImage) setPreview(blog.coverImage);
      });
    }
  }, [isEdit, params?.id, reset]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleAddCategory = async (values: Record<string, string>) => {
    const name: Record<string, string> = {};
    LANGS.forEach((lang) => {
      name[lang] = values.text;
    });
    const newCat = await createCategory(name);
    setCategories((prev) => [...prev, newCat]);
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleTabSwitch = (lang: string) => {
    const currentTitle = getValues(`title.${activeLang}`);
    const currentContent = getValues(`content.${activeLang}`);

    setValue(`title.${activeLang}`, currentTitle ?? "", {
      shouldValidate: false,
    });
    setValue(`content.${activeLang}`, currentContent ?? "", {
      shouldValidate: false,
    });
    setActiveLang(lang);
  };
  const onSubmit = async (data: BlogFormData) => {
    const contentAsHTML: Record<string, string> = {};
    LANGS.forEach((lang) => {
      if (data.content?.[lang]) {
        contentAsHTML[lang] = jsonToHTML(data.content[lang]);
      } else {
        contentAsHTML[lang] = "<p></p>";
      }
    });

    const payload = {
      ...data,
      title: JSON.stringify(data.title),
      content: JSON.stringify(contentAsHTML),
    };

    if (isEdit && params.id) {
      await updateBlog(params.id, payload);
    } else {
      await createBlog(payload);
    }

    router.push("/admin/blogs");
  };

  return (
    <div className="p-6">
      {/* Page header */}
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? t("editHeader") : t("createHeader")}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Tab switcher */}
        <LanguageTabs
          languages={LANGS}
          activeLang={activeLang}
          onChange={handleTabSwitch}
        />
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

        {/* Category select */}
        <div className="w-full">
          <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
            {t("category")}
          </label>
          <CategorySelect
            categories={categories}
            activeLang={activeLang}
            value={watch("categoryId")}
            onChange={(id) => setValue("categoryId", id)}
            onAddCategory={() => setModalOpen(true)}
            onDeleteCategory={handleDeleteCategory}
            placeholder={t("selectCategory")}
            t={t}
          />
        </div>

        {/* Cover image dropzone */}
        <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
          {t("coverImage")}
        </label>
        <Controller
          name="coverImage"
          control={control}
          render={({ field }) => (
            <CoverImageInput
              value={field.value}
              preview={
                preview?.startsWith("blob")
                  ? preview
                  : preview
                    ? process.env.NEXT_PUBLIC_BACKEND_URL! + preview
                    : preview
              }
              onChange={(file) => {
                field.onChange(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
          )}
        />

        {/* Content */}
        <div>
          <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
            {t("content")}
          </label>
          <Controller
            key={`content-${activeLang}`}
            name={`content.${activeLang}`}
            control={control}
            render={({ field }) => {
              const parsedValue = field.value
                ? JSON.parse(field.value)
                : { type: "doc", content: [] };
              return (
                <RichTextEditor
                  key={`editor-${activeLang}`}
                  value={parsedValue}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue(`content.${activeLang}`, val, {
                      shouldDirty: true,
                    });
                  }}
                />
              );
            }}
          />

          {errors.content?.[activeLang] && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content[activeLang]?.message}
            </p>
          )}
        </div>

        {/* Translate button */}
        <button
          type="button"
          className={`px-4 py-2 rounded text-white flex items-center justify-center gap-2 ${
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
                  const title = getValues("title")[activeLang];
                  const contentJSON = getValues("content")[activeLang];
                  const parsed = contentJSON ? JSON.parse(contentJSON) : null;

                  const [translatedTitle, translatedContent] =
                    await Promise.all([
                      translateText(
                        title,
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

                  setValue(`title.${lang}`, translatedTitle, {
                    shouldDirty: true,
                  });

                  if (translatedContent) {
                    const sanitized = sanitizeDoc(translatedContent);
                    setValue(`content.${lang}`, JSON.stringify(sanitized), {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
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

        {/* Toggles */}
        <div className="flex gap-6">
          <ToggleSwitch
            name="draft"
            label={t("draft")}
            control={control}
            onChangeExtra={(val) => {
              if (val) {
                setValue("published", false);
                setValue("inactive", false);
              } else if (
                !val &&
                !getValues("published") &&
                !getValues("inactive")
              ) {
                setValue("inactive", true);
              }
            }}
          />
          <ToggleSwitch
            name="published"
            label={t("published")}
            control={control}
            onChangeExtra={(val) => {
              if (val) {
                setValue("draft", false);
                setValue("inactive", false);
              } else if (
                !val &&
                !getValues("draft") &&
                !getValues("inactive")
              ) {
                setValue("inactive", true);
              }
            }}
          />
          <ToggleSwitch
            name="inactive"
            label={t("inactive")}
            control={control}
            onChangeExtra={(val) => {
              if (val) {
                setValue("draft", false);
                setValue("published", false);
              }
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-2 rounded bg-[var(--color-primary)] text-white"
        >
          {t("submit")}
        </button>
      </form>

      {/* Modal for adding category */}
      <Modal
        isOpen={modalOpen}
        title={t("addCategory")}
        fields={["text"]}
        labels={[t("categoryName")]}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddCategory}
      />
    </div>
  );
}
