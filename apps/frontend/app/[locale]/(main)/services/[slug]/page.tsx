import { getBlog, getBlogs, Blog } from "@/services/blogs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { TocList } from '../../blogs/[category]/[id]/TocItemComponent';

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

export const revalidate = 60;

export default async function BlogDetailPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const locale = (await getLocale()).toUpperCase();
  const blog = await getBlog(params.id);
  if (!blog) return notFound();
  let content = blog.content?.[locale] || blog.content?.EN || "";
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
  const newToc: TocItem[] = [];
  const counters: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]+>/g, "");
    const id = slugify(text);

    counters.length = level;
    counters[level - 1] = (counters[level - 1] || 0) + 1;
    const number = counters.slice(0, level).join("-");

    content = content.replace(match[0], (h) =>
      h.replace(/<h[1-6]/, `<h${level} id="${id}"`)
    );

    newToc.push({ id, text, level, number });
  }

  const toc = buildTocTree(newToc);

  const relatedBlogs: Blog[] = (
    await getBlogs({ categoryId: blog.category.id, limit: 3 })
  ).response.filter((b) => b.id !== blog.id);

  return (
    <>
      <article className="max-w-4xl mx-auto border border-gray-300 mb-0 rounded-2xl px-7 py-7">
        {/* Category */}
        <span className="bg-[var(--color-primary)] text-[var(--color-bg)] text-xs px-3 py-2 rounded-full">
          {blog.category.name[locale] || blog.category.name.EN}
        </span>

        {/* Title */}
        <h1 className="text-3xl font-bold mt-4 mb-2 text-[var(--color-heading)]">
          {blog.title[locale] || blog.title.EN}
        </h1>

        {/* Author + Date */}
        <p className="text-sm text-gray-500 mb-6">
          {blog.author} ·{" "}
          {new Date(blog.createdAt).toLocaleDateString(params.locale)}
        </p>

        {/* Table of Contents */}
        {toc.length > 0 && (
          <div className="mb-8 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <h2 className="text-lg font-semibold mb-2 text-center">Contents</h2>
            <TocList items={toc} />
          </div>
        )}

        {/* Blog Content */}
        {content && (
          <div
            className="prose prose-lg"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
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
                      alt={b.title[locale] || b.title.EN}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <p className="p-2 font-medium">
                    {b.title[locale] || b.title.EN}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
