"use client";

import { Blog, getBlogs } from "@/services/blogs";
import { Category, getCategory } from "@/services/categories";
import { slugify } from "@/utils/slugify";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogCategory() {
  const categoryId = useSearchParams().get("id");
  const [category, setCategory] = useState<Category | null>(null);
  const [blogsByCategory, setBlogsByCategory] = useState<Blog[]>([]);
  const locale = useLocale().toUpperCase();

  useEffect(() => {
    if (!categoryId) return;

    getCategory(categoryId).then((cat) => {
      setCategory(cat);

      getBlogs({ categoryId: cat.id }).then((res) => {
        setBlogsByCategory(res.response);
      });
    });
  }, [categoryId]);

  return (
    <>
      <h1 className="border border-gray-300 w-full flex items-center h-30 rounded-2xl text-3xl px-5">
        <p>{category?.name[locale] || category?.name.EN}</p>
      </h1>
      <div className="border mt-5 border-gray-300 w-full flex flex-col gap-y-5 rounded-2xl p-10">
        {blogsByCategory.map((blog) => (
          <Link
            href={`/blogs/${slugify(category!.name.EN)}/${blog.id}`}
            key={blog.id}
            className="flex min-h-[202px]"
          >
            <Image
              width={360}
              height={203}
              src={process.env.NEXT_PUBLIC_BACKEND_URL! + blog.coverImage}
              alt={blog.title[locale] || blog.title.EN}
              className="object-fill rounded-2xl"
            />
            <p className="ms-7 text-2xl font-semibold">
              {blog.title[locale] || blog.title.EN}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
