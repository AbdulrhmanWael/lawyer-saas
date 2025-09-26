import { getBlogs, Blog } from "@/services/blogs";
import { getCategory, Category } from "@/services/categories";
import { slugify } from "@/utils/slugify";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

type Props = {
  searchParams: { id?: string };
};

export const revalidate = 60;

export default async function BlogCategory({ searchParams }: Props) {
  const locale = (await getLocale()).toUpperCase();

  const categoryId = searchParams.id;
  if (!categoryId) {
    return <p className="text-red-500 p-6">Category ID is missing</p>;
  }

  const category: Category | null = await getCategory(categoryId);
  if (!category) {
    return <p className="text-red-500 p-6">Category not found</p>;
  }

  const blogsByCategory: Blog[] = (await getBlogs({ categoryId })).response;

  return (
    <>
      <h1 className="border border-gray-300 w-full flex items-center h-30 rounded-2xl text-3xl px-5">
        <p>{category.name[locale] || category.name.EN}</p>
      </h1>
      <div className="border mt-5 border-gray-300 w-full flex flex-col gap-y-5 rounded-2xl p-10">
        {blogsByCategory.map((blog) => (
          <Link
            href={`/blogs/${slugify(category.name.EN)}/${blog.id}`}
            key={blog.id}
            className="flex min-h-[202px]"
          >
            {blog.coverImage && (
              <Image
                width={360}
                height={203}
                src={process.env.NEXT_PUBLIC_BACKEND_URL! + blog.coverImage}
                alt={blog.title[locale] || blog.title.EN}
                className="object-fill rounded-2xl"
              />
            )}
            <p className="ms-7 text-2xl font-semibold">
              {blog.title[locale] || blog.title.EN}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
