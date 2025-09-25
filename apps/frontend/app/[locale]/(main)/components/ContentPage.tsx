"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { contentService } from "@/services/contentService";
import { motion } from "framer-motion";
import Head from "next/head";

interface ContentResponse {
  id: number;
  content: Record<string, string>;
}

interface Props {
  type: "about" | "privacy";
}

export default function ContentPage({ type }: Props) {
  const [content, setContent] = useState<string | null>(null);
  const locale = useLocale().toUpperCase();
  const t = useTranslations("Main");

  useEffect(() => {
    const fetchContent = async () => {
      const res: ContentResponse =
        type === "about"
          ? await contentService.getAbout()
          : await contentService.getPrivacyPolicy();

      setContent(res.content[locale] || "");
    };

    fetchContent();
  }, [type, locale]);

  const pageTitle =
    type === "about" ? t("about.title") : t("privacyPolicy.title");
  const pageDescription =
    type === "about" ? t("about.description") : t("privacyPolicy.description");

  if (!content) return null;

  return (
    <>
      <Head>
        <title>{pageTitle} | My Website</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
      </Head>

      <section className="container mx-auto px-4 py-20 max-w-3xl">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {pageTitle}
        </motion.h1>

        <motion.div
          className="prose max-w-none text-[var(--color-text)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>
    </>
  );
}
