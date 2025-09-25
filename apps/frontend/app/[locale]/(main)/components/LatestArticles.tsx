"use client";

import { useEffect, useState } from "react";
import { getBlogs, Blog } from "@/services/blogs";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function LatestArticlesSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const t = useTranslations("Main.Home.blogs");
  const locale = useLocale().toUpperCase();

  useEffect(() => {
    getBlogs().then((res) => {
      const published = res.response
        .filter((b) => b.published && !b.draft && !b.inactive)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3);

      setBlogs(published);
    });
  }, []);

  if (!blogs.length) return null;

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
          {t("title")}
        </h2>
        <p className="text-lg text-[var(--color-text)]">{t("intro")}</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog, idx) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
          >
            <Link
              href={`/blogs/${blog.id}`}
              className="block bg-[var(--color-bg)]/90 rounded-2xl shadow-lg hover:shadow-xl p-6 transition"
            >
              {blog.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={process.env.NEXT_PUBLIC_BACKEND_URL + blog.coverImage}
                  alt={blog.title[locale]}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="font-semibold text-lg text-[var(--color-heading)] mb-2">
                {blog.title[locale]}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-[var(--color-primary)]">
                {blog.category?.name?.[locale]}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/blogs"
          className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-accent)] transition"
        >
          {t("showMore")}
        </Link>
      </div>
    </section>
  );
}
