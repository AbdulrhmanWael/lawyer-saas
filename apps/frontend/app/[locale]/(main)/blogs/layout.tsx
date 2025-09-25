"use client";

import { useEffect, useState, useCallback } from "react";
import { getBlogs, Blog } from "@/services/blogs";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import debounce from "lodash.debounce";
import Link from "next/link";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Main.Blogs");
  const locale = useLocale().toUpperCase();

  const fetchBlogs = useCallback(
    debounce(async (query: string) => {
      setLoading(true);
      try {
        const res = await getBlogs({
          search: query,
          limit: 10,
          page: 1,
        });
        setBlogs(res.response);
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  useEffect(() => {
    fetchBlogs(search);
  }, [search, fetchBlogs]);

  return (
    <div className="flex w-full flex-col md:flex-row justify-between md:p-12 p-5 gap-10">
      {/* Main Content */}
      <div className="md:w-2/3 w-full md:px-0 px-5">{children}</div>
      {/* Sidebar */}
      <div className="md:w-1/3 w-full md:px-10 px-5">
        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[var(--color-bg)] mb-5 rounded-2xl border border-gray-300 p-6 sticky top-24"
        >
          <div className="flex w-full justify-between before-after items-center">
            <p className="mb-4 text-[14px]">{t("searchTopics")}</p>
            <Search className="text-gray-400 mb-3" />
          </div>
          <hr className="mb-4 text-gray-300" />
          <div className="relative">
            <form className="display flex">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <button className="bg-[var(--color-primary)] font-semibold text-[var(--color-bg)] px-3 py-2" type="submit" onClick={(e)=>{e.preventDefault()}}>
                <Search/>
              </button>
            </form>
          </div>
        </motion.div>

        {/* Latest Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[var(--color-bg)] border border-gray-300 before-after rounded-2xl shadow-lg p-6 sticky top-72"
        >
          <p className="mb-4 text-[14px]">{t("latestArticles")}</p>
          <hr className="mb-4 text-gray-300" />

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {loading ? (
              <p className="text-gray-500">{t("loading")}</p>
            ) : blogs.length ? (
              blogs
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 10)
                .map((blog, idx) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
                  >
                    {blog.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          process.env.NEXT_PUBLIC_BACKEND_URL + blog.coverImage
                        }
                        alt={blog.title[locale]}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                    )}
                    <Link
                      href={`/blogs/${blog.id}`}
                      className="font-medium text-sm text-[var(--color-heading)] line-clamp-2"
                    >
                      {blog.title[locale]}
                    </Link>
                  </motion.div>
                ))
            ) : (
              <p className="text-gray-500">{t("noArticles")}</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
