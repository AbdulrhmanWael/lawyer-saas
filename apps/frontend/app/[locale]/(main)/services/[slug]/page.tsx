"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { PracticeArea } from "@/services/practiceAreaService";
import { practiceAreaService } from "@/services/practiceAreaService";
import Head from "next/head";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { TocList } from "../../blogs/[category]/[id]/TocItemComponent";

function normalizeField<T = Record<string, string>>(
  field: string | T | null | undefined
): T {
  if (!field) return {} as T;
  if (typeof field === "string") {
    try {
      return JSON.parse(field) as T;
    } catch {
      return {} as T;
    }
  }
  return field as T;
}

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

// --- Component ---
export default function ServicePage() {
  const t = useTranslations("Main.nav");
  const { slug } = useParams<{ slug: string }>();
  const locale = useLocale().toUpperCase();
  const [service, setService] = useState<PracticeArea | null>(null);
  const [loading, setLoading] = useState(true);

  const [toc, setToc] = useState<TocItem[]>([]);
  const [parsedContent, setParsedContent] = useState<string>("");

  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        setLoading(true);
        const data = await practiceAreaService.getBySlug(slug);

        const normalized: PracticeArea = {
          ...data,
          title: normalizeField(data.title),
          excerpt: normalizeField(data.excerpt),
          contentHtml: normalizeField(data.contentHtml),
          seoMeta: normalizeField(data.seoMeta),
        };

        setService(normalized);

        // --- Build TOC from contentHtml ---
        const container = document.createElement("div");
        container.innerHTML = normalized.contentHtml?.[locale] || "";

        const headings = Array.from(
          container.querySelectorAll("h1, h2, h3, h4, h5, h6")
        );

        const newToc: TocItem[] = [];
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
      } catch {
        setService(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, locale]);

  if (loading) return <p>Loading...</p>;
  if (!service) return <p>Service not found</p>;

  const meta = service.seoMeta;
  const pageTitle =
    meta?.title?.[locale] || service.title?.[locale] || "Service";
  const pageDescription =
    meta?.description?.[locale] || service.excerpt?.[locale] || "";
  const canonical = meta?.canonical || `/services/${service.slug}`;

  return (
    <>
      {/* SEO Meta */}
      <Head>
        <title>{pageTitle}</title>
        {pageDescription && (
          <meta name="description" content={pageDescription} />
        )}
        <link rel="canonical" href={canonical} />
      </Head>

      <article className="max-w-5xl mx-auto px-4 py-12">
        {/* Cover Image */}
        {service.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={process.env.NEXT_PUBLIC_BACKEND_URL + service.coverImageUrl}
            alt={service.title?.[locale]}
            className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8"
          />
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold text-[var(--color-heading)] mb-6">
          {service.title?.[locale]}
        </h1>

        {/* Table of Contents */}
        {toc.length > 0 && (
          <div className="mb-8 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <h2 className="text-lg font-semibold mb-2 text-center">Contents</h2>
            <TocList items={toc} />
          </div>
        )}

        {/* Content */}
        {parsedContent && (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        )}

        {/* CTA */}
        <div className="flex justify-center items-center mt-8">
          <Link
            href="/contact"
            className="px-6 py-3 rounded bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
          >
            {t("contact")}
          </Link>
        </div>
      </article>
    </>
  );
}
