"use client";

import { useEffect, useState } from "react";
import { getBlogs, Blog } from "@/services/blogs";
import { getCategories, Category } from "@/services/categories";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { slugify } from "@/utils/slugify";
import Image from "next/image";

export default function BlogsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogsByCategory, setBlogsByCategory] = useState<
    Record<string, Blog[]>
  >({});
  const locale = useLocale().toUpperCase();
  const t = useTranslations("Main.Blogs");

  const isRTL = ["AR", "HE", "FA"].includes(locale);

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats);

      cats.forEach((cat) => {
        getBlogs({ categoryId: cat.id }).then((res) => {
          setBlogsByCategory((prev) => ({ ...prev, [cat.id]: res.response }));
        });
      });
    });
  }, [locale]);

  return (
    <div className="space-y-8">
      {categories.map((cat, idx) => {
        const blogs = blogsByCategory[cat.id] || [];
        if (blogs.length === 0) return null;

        const [firstBlog, ...restBlogs] = blogs;

        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[var(--color-bg)] rounded-2xl border border-gray-300 p-8"
          >
            {/* Category Title */}
            <Link href={`/blogs/${slugify(cat.name.EN)}?id=${cat.id}`}>
              <h3 className="text-xl font-bold mb-2 cursor-pointer">
                {cat.name[locale]}
              </h3>
            </Link>
            <hr className="mb-6" />

            <div
              className={`flex flex-col md:flex-row gap-8 ${
                isRTL ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="md:w-2/5">
                <Link
                  href={`/blogs/${slugify(cat.name.EN)}/${firstBlog.id}`}
                  className="block"
                >
                  {firstBlog.coverImage && (
                    <Image
                      width={300}
                      height={168}
                      src={
                        process.env.NEXT_PUBLIC_BACKEND_URL +
                        firstBlog.coverImage
                      }
                      alt={firstBlog.title[locale]}
                      className="h-[168px] object-cover rounded-lg mb-4"
                    />
                  )}
                </Link>

                <h4 className="font-semibold text-lg text-[var(--color-heading)] mb-2">
                  {firstBlog.title[locale]}
                </h4>

                <div
                  className="text-sm text-gray-500 mb-4 line-clamp-5"
                  dangerouslySetInnerHTML={{
                    __html: firstBlog.content?.[locale] || "",
                  }}
                />

                <Link
                  href={`/blogs/${slugify(cat.name.EN)}/${firstBlog.id}`}
                  className="inline-block bg-[var(--color-primary)] text-[var(--color-bg)] px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
                >
                  {t("continueReading")}
                </Link>
              </div>

              {/* Other Blogs */}
              <div className="md:w-3/5 flex flex-col gap-4">
                {restBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blogs/${slugify(cat.name.EN)}/${blog.id}`}
                    className={`flex items-center gap-4 hover:opacity-80 transition ${
                      isRTL ? "flex-row-reverse text-right" : ""
                    }`}
                  >
                    {blog.coverImage && (
                      <Image
                        width={140}
                        height={90}
                        src={
                          process.env.NEXT_PUBLIC_BACKEND_URL + blog.coverImage
                        }
                        alt={blog.title[locale]}
                        className="w-40 h-[90px] object-cover rounded-md flex-shrink-0"
                      />
                    )}
                    <p className="text-[var(--color-heading)] text-base font-medium">
                      {blog.title[locale]}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
