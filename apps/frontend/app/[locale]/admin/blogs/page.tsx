"use client";

import { useCallback, useEffect, useState } from "react";
import { getBlogs, deleteBlog, Blog } from "@/services/blogs";
import { getCategories, Category } from "@/services/categories";
import Table from "@/components/common/Table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import Modal from "@/components/common/Modal";

export default function BlogsPage() {
  const locale = useLocale();
  const t = useTranslations("Dashboard.Blogs");

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blog, setBlog] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBlogs = useCallback(async () => {
    const data = await getBlogs({
      search: debouncedSearch,
      categoryId: selectedCategory,
    });

    if (Array.isArray(data.response)) {
      setBlogs(data.response);
    } else {
      setBlogs(data.response || []);
    }
  }, [debouncedSearch, selectedCategory]);

  const fetchCategories = async () => {
    const cats = await getCategories();
    setCategories(cats);
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [search, selectedCategory, fetchBlogs]);

  const confirmDelete = (id: string, title: string) => {
    setBlog({ title, id });
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!blog?.id) return;
    await deleteBlog(blog?.id);
    fetchBlogs();
    setDeleteModalOpen(false);
    setBlog(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">
          {t("title")}
        </h1>
        <Link
          className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
          href="blogs/blog"
        >
          {t("create")}
        </Link>
      </div>

      <div className="flex gap-4 mb-4">
        <select
          className="py-2 pl-2 pr-4 rounded-md border border-[var(--color-primary)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          value={selectedCategory ?? ""}
          onChange={(e) => setSelectedCategory(e.target.value || undefined)}
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name[locale.toUpperCase()]}
            </option>
          ))}
        </select>

        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full py-2 pl-9 pr-4 rounded-md border border-[var(--color-primary)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>

        <button
          onClick={() => fetchBlogs()}
          className={`px-4 py-2 rounded-lg font-medium transition-colors bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90`}
        >
          {t("searchButton")}
        </button>
      </div>

      <Table<Blog>
        columns={[
          { header: t("table.title"), accessor: "title" },
          { header: t("table.category"), accessor: "category" },
          { header: t("table.author"), accessor: "author" },
          { header: t("table.published"), accessor: "published" },
        ]}
        data={blogs}
        onEdit={(b) => router.push(`blogs/blog/${b.id}`)}
        onDelete={(b) => confirmDelete(b.id, b.title.EN)}
        limit={10}
      />
      <Modal
        isOpen={deleteModalOpen}
        title={`${t("deleteConfirm")}\n${blog?.title}`}
        isConfirm={false}
        onClose={() => setDeleteModalOpen(false)}
        onSubmit={handleDelete}
      />
    </div>
  );
}
