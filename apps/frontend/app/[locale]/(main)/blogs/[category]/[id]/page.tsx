"use client";

import { useEffect, useState } from "react";
import { getBlog, getBlogs, Blog } from "@/services/blogs";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { TocList } from "./TocItemComponent";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export type TocItem = {
  id: string;
  text: string;
  level: number;
  number: string;
  children?: TocItem[];
};

function buildTocTree(flatToc: TocItem[]): TocItem[] {
  const root: TocItem[] = [];
  const stack: TocItem[] = [];

  flatToc.forEach((item) => {
    while (stack.length && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(item);
      stack.push(item);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(item);
      stack.push(item);
    }
  });

  return root;
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const locale = useLocale().toUpperCase();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [toc, setToc] = useState<
    {
      id: string;
      text: string;
      level: number;
      number: string;
    }[]
  >([]);
  const [parsedContent, setParsedContent] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    getBlog(id as string).then((data) => {
      setBlog(data);

      const container = document.createElement("div");
      container.innerHTML = data.content[locale] || "";

      const headings = Array.from(
        container.querySelectorAll("h1, h2, h3, h4, h5, h6")
      );

      const newToc: {
        id: string;
        text: string;
        level: number;
        number: string;
      }[] = [];

      const counters: number[] = [];
      headings.forEach((h) => {
        const text = h.textContent || "";
        const slug = slugify(text);
        h.setAttribute("id", slug);

        const level = parseInt(h.tagName.substring(1), 10);
        counters.length = level;
        counters[level - 1] = (counters[level - 1] || 0) + 1;

        const number = counters.slice(0, level).join("-");

        newToc.push({ id: slug, text, level, number });
      });

      setToc(buildTocTree(newToc));
      setParsedContent(container.innerHTML);

      getBlogs({ categoryId: data.category.id, limit: 3 }).then((res) => {
        const filtered = res.response.filter((b) => b.id !== data.id);
        setRelatedBlogs(filtered);
      });
    });
  }, [id, locale]);

  if (!blog) return <p>Loading...</p>;

  return (
    <>
      <article className="max-w-4xl mx-auto border border-gray-300 mb-0 rounded-2xl px-7 py-7">
        {/* Category */}
        <span className="bg-[var(--color-primary)] text-[var(--color-bg)] text-xs px-3 py-2 rounded-full">
          {blog.category.name[locale]}
        </span>

        {/* Title */}
        <h1 className="text-3xl font-bold mt-4 mb-2 text-[var(--color-heading)]">
          {blog.title[locale]}
        </h1>

        {/* Author + Date */}
        <p className="text-sm text-gray-500 mb-6">
          {blog.author} · {new Date(blog.createdAt).toLocaleDateString(locale)}
        </p>

        {/* Table of Contents */}
        {toc.length > 0 && (
          <div className="mb-8 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <h2 className="text-lg font-semibold mb-2 text-center">Contents</h2>
            <TocList items={toc} />
          </div>
        )}

        {/* Blog Content with IDs injected */}
        <div
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: parsedContent }}
        />
      </article>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div className="border border-gray-300 rounded-2xl p-7 mt-16">
          <h2 className="text-xl font-bold mb-6">More from this category</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedBlogs.map((b) => (
              <Link key={b.id} href={`/blogs/${b.id}`}>
                <div className="cursor-pointer border mb-2 border-gray-300 rounded-lg overflow-hidden hover:shadow-md hover:scale-105 duration-150 transition-all">
                  {b.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={process.env.NEXT_PUBLIC_BACKEND_URL + b.coverImage}
                      alt={b.title[locale]}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <p className="p-2 font-medium">{b.title[locale]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
