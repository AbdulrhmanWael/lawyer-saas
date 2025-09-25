"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  newsletterApi,
  SendNewsletterDto,
  MailSettingsDto,
} from "../../../../services/newsletterService";
import { useTranslations } from "next-intl";
import RichTextEditor from "@/components/common/RichTextEditor";
import Link from "next/link";
import { jsonToHTML } from "@/utils/tipTapConverter";
import { JSONContent } from "@tiptap/react";

const newsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.any(),
});

const settingsSchema = z.object({
  host: z.string().min(1),
  port: z.number(),
  user: z.string().min(1),
  pass: z.string().min(1),
  from: z.email(),
});

export default function NewsletterPage() {
  const t = useTranslations("Dashboard.Newsletter");

  const {
    register: registerNewsletter,
    handleSubmit: handleSubmitNewsletter,
    reset: resetNewsletter,
    control,
    formState: { errors: newsletterErrors },
  } = useForm<SendNewsletterDto>({
    resolver: zodResolver(newsletterSchema),
  });

  const {
    register: registerSettings,
    handleSubmit: handleSubmitSettings,
    reset: resetSettings,
    formState: { errors: settingsErrors },
  } = useForm<MailSettingsDto>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await newsletterApi.getSettings();
      resetSettings(settings);
    };
    loadSettings();
  }, [resetSettings]);

  const onSendNewsletter = async (data: SendNewsletterDto) => {
    const htmlContent = jsonToHTML(JSON.stringify(data.content));

    await newsletterApi.send({
      ...data,
      content: htmlContent,
    });

    resetNewsletter();
  };

  const onSaveSettings = async (data: MailSettingsDto) => {
    await newsletterApi.updateSettings(data);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">
          {t("title")}
        </h1>
        <Link
          href="/admin/newsletter/subscribers"
          className="text-sm font-medium px-4 py-2 rounded bg-[var(--color-primary)] text-white hover:opacity-90"
        >
          {t("subscribersLink")}
        </Link>
      </div>

      {/* Newsletter Form */}
      <form
        onSubmit={handleSubmitNewsletter(onSendNewsletter)}
        className="space-y-4 bg-[var(--form-bg)] p-4 rounded shadow"
      >
        <h2 className="text-xl font-semibold">{t("sendTitle")}</h2>
        <div>
          <label className="block mb-1">{t("subject")}</label>
          <input
            {...registerNewsletter("subject")}
            className="w-full border rounded p-2"
          />
          {newsletterErrors.subject && (
            <p className="text-[var(--form-error)] text-sm">
              {newsletterErrors.subject.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1">{t("content")}</label>
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <RichTextEditor
                value={field.value as unknown as JSONContent}
                onChange={(val: string) => {
                  try {
                    const parsed = JSON.parse(val);
                    field.onChange(parsed);
                  } catch {
                    field.onChange(val);
                  }
                }}
                placeholder={t("contentPlaceholder")}
              />
            )}
          />

          {newsletterErrors.content && (
            <p className="text-[var(--form-error)] text-sm">
              {newsletterErrors.content.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded"
        >
          {t("send")}
        </button>
      </form>

      {/* Settings Form */}
      <form
        onSubmit={handleSubmitSettings(onSaveSettings)}
        className="space-y-4 bg-[var(--form-bg)] p-4 rounded shadow"
      >
        <h2 className="text-xl font-semibold">{t("settingsTitle")}</h2>
        <div>
          <label className="block mb-1">{t("host")}</label>
          <input
            {...registerSettings("host")}
            className="w-full border rounded p-2"
          />
          {settingsErrors.host && (
            <p className="text-[var(--form-error)] text-sm">
              {settingsErrors.host.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1">{t("port")}</label>
          <input
            type="number"
            {...registerSettings("port", { valueAsNumber: true })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">{t("user")}</label>
          <input
            {...registerSettings("user")}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">{t("pass")}</label>
          <input
            type="password"
            {...registerSettings("pass")}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">{t("from")}</label>
          <input
            {...registerSettings("from")}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded"
        >
          {t("save")}
        </button>
      </form>
    </div>
  );
}
