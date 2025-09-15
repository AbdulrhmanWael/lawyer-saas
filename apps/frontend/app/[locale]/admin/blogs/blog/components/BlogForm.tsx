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

const blogSchema = z.object({
  title: z.record(z.string(), z.string().min(1, "Title is required")),
  categoryId: z.string().min(1, "Category is required"),
  coverImage: z.any().optional(),
  content: z.record(z.string(), z.string().min(1, "Content is required")),
  draft: z.boolean(),
  published: z.boolean(),
});

type BlogFormData = z.infer<typeof blogSchema>;

const LANGS = ["EN", "AR", "DE", "RO", "RU", "ZH", "IT", "FR"];

export default function BlogForm() {
  const t = useTranslations("Dashboard.BlogForm");
  const router = useRouter();
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
    },
  });

  // load blog if editing
  useEffect(() => {
    if (isEdit && params.id) {
      getBlog(params.id).then((blog: Blog) => {
        reset({
          title: blog.title,
          categoryId: blog.category.id,
          coverImage: blog.coverImage,
          content: blog.content,
          draft: blog.draft,
          published: blog.published,
        });
        if (blog.coverImage) setPreview(blog.coverImage);
      });
    }
  }, [isEdit, params?.id, reset]);

  // load categories
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

  const onSubmit = async (data: BlogFormData) => {
    const payload = {
      ...data,
      title: JSON.stringify(data.title),
      content: JSON.stringify(data.content),
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
        <div className="flex flex-wrap gap-2 mb-4">
          {LANGS.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1 rounded ${
                activeLang === lang
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <label className="block font-medium mb-1">{t("title")}</label>
          <input
            type="text"
            {...register(`title.${activeLang}`)}
            className="w-full border rounded px-3 py-2"
          />
          {errors.title?.[activeLang] && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title[activeLang]?.message}
            </p>
          )}
        </div>

        {/* Category select */}
        <div className="w-full">
          <label className="block font-medium mb-1">{t("category")}</label>
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
        <label className="block font-medium mb-1">{t("coverImage")}</label>
        <Controller
          name="coverImage"
          control={control}
          render={({ field }) => (
            <CoverImageInput
              value={field.value}
              preview={preview}
              onChange={(file) => {
                field.onChange(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
          )}
        />

        {/* Content */}
        <div>
          <label className="block font-medium mb-1">{t("content")}</label>
          <Controller
            name={`content.${activeLang}`}
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
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
          className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700"
          onClick={() => {
            const title = getValues("title")[activeLang];
            const content = getValues("content")[activeLang];
            LANGS.filter((l) => l !== activeLang).forEach((lang) => {
              setValue(`title.${lang}`, title);
              setValue(`content.${lang}`, content);
            });
          }}
        >
          {t("translate")}
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
