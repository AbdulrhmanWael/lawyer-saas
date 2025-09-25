"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import LanguageTabs from "@/components/common/LanguageTabs";
import RichTextEditor from "@/components/common/RichTextEditor";
import { contentService } from "@/services/contentService";
import { LANGS } from "../blogs/blog/components/BlogForm";
import {
  translateTiptapJSON,
  sanitizeDoc,
  runWithThrottle,
} from "@/utils/translate";
import { htmlToJSON, jsonToHTML } from "@/utils/tipTapConverter";

interface ContentEditorProps {
  type: "about" | "privacy";
  initialContent?: Record<string, string>;
}

export default function ContentEditor({
  type,
  initialContent = {},
}: Readonly<ContentEditorProps>) {
  const t = useTranslations("Dashboard.ContentEditor");

  const [content, setContent] = useState<Record<string, object>>({});
  const [activeLang, setActiveLang] = useState<string>(LANGS[0]);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res =
          type === "about"
            ? await contentService.getAbout()
            : await contentService.getPrivacyPolicy();

        const htmlContent = res.content || initialContent || {};
        const jsonContent: Record<string, object> = {};

        LANGS.forEach((lang) => {
          if (htmlContent[lang]) {
            jsonContent[lang] = JSON.parse(htmlToJSON(htmlContent[lang]));
          } else {
            jsonContent[lang] = { type: "doc", content: [] };
          }
        });

        setContent(jsonContent);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [type]);

  const handleChange = (val: string) => {
    try {
      const jsonVal = JSON.parse(val);
      setContent((prev) => ({
        ...prev,
        [activeLang]: jsonVal,
      }));
    } catch {
      console.warn("Invalid JSON string from editor");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const htmlContent: Record<string, string> = {};
      LANGS.forEach((lang) => {
        if (content[lang]) {
          htmlContent[lang] = jsonToHTML(JSON.stringify(content[lang]));
        } else {
          htmlContent[lang] = "<p></p>";
        }
      });

      if (type === "about") {
        await contentService.updateAbout(htmlContent);
      } else {
        await contentService.updatePrivacyPolicy(htmlContent);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Translate activeLang → others
  const handleTranslate = async () => {
    setTranslating(true);
    try {
      const tasks = LANGS.filter((l) => l !== activeLang).map(
        (lang) => async () => {
          const parsed = content[activeLang];
          if (parsed) {
            const translated = await translateTiptapJSON(
              parsed,
              activeLang.toLowerCase(),
              lang.toLowerCase()
            );
            const sanitized = sanitizeDoc(translated);

            setContent((prev) => ({
              ...prev,
              [lang]: sanitized,
            }));
          }
        }
      );

      await runWithThrottle(tasks);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-[var(--color-primary)] text-2xl m-5">{type === "about" ? "About Us" : "Privacy Policy"}</h1>
      {/* Language Switcher */}
      <LanguageTabs
        languages={LANGS}
        activeLang={activeLang}
        onChange={setActiveLang}
      />

      {/* Editor */}
      <RichTextEditor
        value={content[activeLang] || { type: "doc", content: [] }}
        onChange={handleChange}
        placeholder={t("placeholder")}
      />

      <div className="flex justify-between mt-4">
        {/* Translate */}
        <button
          onClick={handleTranslate}
          disabled={translating}
          className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${
            translating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[var(--color-accent)]"
          }`}
        >
          {translating ? t("translating") : t("translate")}
        </button>

        {/* Save */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)] transition disabled:opacity-50"
        >
          {loading ? t("saving") : t("save")}
        </button>
      </div>
    </div>
  );
}
