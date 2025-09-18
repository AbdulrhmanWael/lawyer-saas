"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLocale, useTranslations } from "next-intl";
import { apiClient } from "@/utils/apiClient";

type Blog = {
  id: string;
  title: Record<string, string>;
  views: number;
  published: boolean;
  createdAt: string;
};

export default function TopBlogsChart({
  initialData,
}: {
  initialData: Blog[];
}) {
  const t = useTranslations("Dashboard.Overview");
  const locale = useLocale();
  const [blogs, setBlogs] = useState(
    initialData.sort((a, b) => b.views - a.views).slice(0, 6)
  );

  const togglePublish = async (blog: Blog) => {
    try {
      if (blog.published) {
        await apiClient.patch(`/blogs/unpublish/${blog.id}`);
      } else {
        await apiClient.patch(`/blogs/publish/${blog.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const highestViews = blogs.length > 0 ? blogs[0].views : 0;

  if (blogs.length === 0) {
    return (
      <div className="p-6 bg-[var(--color-bg)] rounded-2xl shadow-lg flex items-center justify-center h-[300px]">
        <span className="text-gray-400">{t("noBlogs")}</span>
      </div>
    );
  }

  if (highestViews === 0) {
    return (
      <div className="bg-[var(--color-bg)] rounded-2xl shadow-lg flex items-center justify-center h-[300px]">
        <span className="text-gray-400">{t("noViews")}</span>
      </div>
    );
  }

  return (
    <div
      className={`mt-6 overflow-x-auto flex ${document.dir === "rtl" ? "flex-row-reverse" : "flex-row"} gap-6`}
    >
      <div
        style={{ minWidth: `${blogs.length * 50}px`, flex: 1 }}
        className="rounded-2xl shadow-lg "
      >
        <h2 className="p-6 text-xl font-semibold text-[var(--color-primary)] mb-4">
          {t("topBlogs")}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={blogs}
            margin={{ top: 20, right: 20, left: 0, bottom: 50 }}
          >
            <XAxis
              dataKey={(blog) => blog.title[locale] ?? blog.title.EN}
              angle={-35}
              tick={({ x, y, payload }) => {
                const title = payload.value;
                return (
                  <text
                    x={x}
                    y={y + 10}
                    textAnchor="middle"
                    fill="var(--color-text)"
                    fontSize={12}
                  >
                    {title.length > 10
                      ? title
                          .match(/.{1,10}/g)
                          ?.map((line: string, idx: number) => (
                            <tspan key={line} x={x} dy={idx === 0 ? 0 : 14}>
                              {line}
                            </tspan>
                          ))
                      : title}
                  </text>
                );
              }}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [
                `${value} ${t("views")}`,
                t("views"),
              ]}
              labelFormatter={(label) => label}
            />
            <Bar
              dataKey="views"
              fill="var(--color-accent)"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Blog table */}
      <div className="w-80 shadow-2xl rounded-lg p-6 bg-[var(--color-bg)]">
        <h3 className="text-[var(--color-text)] font-semibold mb-2">
          {t("blogsTable")}
        </h3>
        <table className="w-full text-[var(--color-text)] border-collapse">
          <thead className="bg-[var(--color-accent)]/15">
            <tr>
              <th className="text-left px-3 py-2 text-sm font-semibold">
                {t("title")}
              </th>
              <th className="text-center px-3 py-2 text-sm font-semibold">
                {t("publish")}
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, idx) => (
              <tr
                key={blog.id}
                className={`border-t border-[var(--color-border)] hover:bg-[var(--color-accent)]/10 ${
                  idx % 2 === 0 ? "bg-[var(--color-row-alt)]" : ""
                }`}
              >
                <td className="px-3 py-2 text-sm">
                  <span
                    className="block truncate max-w-[10rem]"
                    title={blog.title[locale] ?? blog.title.EN}
                  >
                    {blog.title[locale] ?? blog.title.EN}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      blog.published
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-[var(--color-text)] hover:bg-red-600/20"
                    }`}
                    onClick={() => togglePublish(blog)}
                  >
                    {blog.published ? t("published") : t("unpublished")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
