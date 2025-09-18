"use client";

import { JSX, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { siteSettingsApi } from "@/services/siteSettings";
import LogoDropzone from "@/components/common/LogoDropZone";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { Mail, Phone } from "lucide-react";
import ColorsSection from "./components/ColorSelection";
import { ApplyThemeVariables } from "./components/ApplyThemeVariables";
import toast, { Toaster } from "react-hot-toast";

const SiteSettingsSchema = z.object({
  logoUrl: z.string().nullable().optional(),
  footer: z.object({
    email: z.email("invalidEmail").optional(),
    phone: z
      .string()
      .refine((val) => !val || isValidPhoneNumber(val), {
        message: "invalidPhone",
      })
      .optional(),
    social: z.record(z.string(), z.string().url("invalidUrl")).optional(),
  }),
  colors: z.object({
    light: z.object({
      colorPrimary: z.string().optional(),
      colorSecondary: z.string().optional(),
      colorHeaderBg: z.string().optional(),
      colorAccent: z.string().optional(),
      colorBg: z.string().optional(),
      colorText: z.string().optional(),
    }),
    dark: z
      .object({
        colorPrimary: z.string().optional(),
        colorSecondary: z.string().optional(),
        colorHeaderBg: z.string().optional(),
        colorAccent: z.string().optional(),
        colorBg: z.string().optional(),
        colorText: z.string().optional(),
      })
      .optional(),
  }),
});

export type SettingsFormData = z.infer<typeof SiteSettingsSchema>;

const socialIcons: Record<string, { icon: JSX.Element; placeholder: string }> =
  {
    facebook: { icon: <FaFacebook />, placeholder: "Facebook URL" },
    whatsapp: { icon: <FaWhatsapp />, placeholder: "WhatsApp link" },
    instagram: { icon: <FaInstagram />, placeholder: "Instagram URL" },
    twitter: { icon: <FaTwitter />, placeholder: "X (Twitter) URL" },
    linkedin: { icon: <FaLinkedin />, placeholder: "LinkedIn URL" },
  };

export default function SettingsClient({
  initialSettings,
}: {
  initialSettings: SettingsFormData;
}) {
  const t = useTranslations("Dashboard.settings");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [showSocialOptions, setShowSocialOptions] = useState(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(SiteSettingsSchema),
    defaultValues: initialSettings,
  });

  const onSubmit = async (data: SettingsFormData) => {
    const formData = new FormData();
    if (logoFile) formData.append("logo", logoFile);
    formData.append("data", JSON.stringify(data));

    try {
      const res = await siteSettingsApi.update(formData);
      const normalized = {
        logoUrl: res.logoUrl ?? null,
        footer: res.footer || { email: "", phone: "", social: {} },
        colors:
          typeof res.colors === "string"
            ? JSON.parse(res.colors)
            : res.colors || { light: {}, dark: {} },
      };

      form.reset(normalized);
      toast.success(t("settingsSaved"));
    } catch (err) {
      console.error(err);
      toast.error(t("settingsSaveError"));
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto p-6 space-y-8"
      >
        <Toaster position="top-right" />
        <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

        {/* Logo */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t("logo")}</h2>
          <LogoDropzone
            onFileSelected={(file) => setLogoFile(file)}
            initialUrl={
              form.getValues("logoUrl")
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${form.getValues(
                    "logoUrl"
                  )}`
                : undefined
            }
          />
        </section>

        {/* Contact */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">{t("contact")}</h2>

          <div className="flex items-center gap-x-2">
            <Mail size={25} />
            <Controller
              name="footer.email"
              control={form.control}
              render={({ field }) => (
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  {...field}
                  className="w-full border rounded p-2"
                />
              )}
            />
          </div>
          {form.formState.errors.footer?.email && (
            <p className="text-red-500 text-xs">
              {t(form.formState.errors.footer.email.message!)}
            </p>
          )}

          <div className="flex items-center gap-x-2">
            <Phone size={25} />
            <Controller
              name="footer.phone"
              control={form.control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  international
                  defaultCountry="EG"
                  className="w-full border-[2px] rounded-lg p-0 focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              )}
            />
          </div>
          {form.formState.errors.footer?.phone && (
            <p className="text-red-500 text-xs">
              {t(form.formState.errors.footer.phone.message!)}
            </p>
          )}
        </section>

        {/* Socials */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">{t("socials")}</h2>

          {Object.entries(form.watch("footer.social") || {}).map(
            ([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-3 rounded p-2 bg-[var(--color-bg)]"
              >
                <span className="text-xl">{socialIcons[key]?.icon}</span>
                <Controller
                  name={`footer.social.${key}`}
                  control={form.control}
                  defaultValue={value}
                  render={({ field }) => (
                    <input
                      type="url"
                      placeholder={socialIcons[key]?.placeholder || key}
                      {...field}
                      className="flex-1 border rounded p-2"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => {
                    const socials = { ...form.getValues("footer.social") };
                    delete socials[key];
                    form.setValue("footer.social", socials);
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  ✕
                </button>
              </div>
            )
          )}

          <button
            type="button"
            className="w-full py-2 border-2 border-dashed rounded font-bold"
            onClick={() => setShowSocialOptions((prev) => !prev)}
          >
            {t("addSocial")}
          </button>

          {showSocialOptions && (
            <div className="flex justify-center items-center gap-3 flex-wrap">
              {Object.entries(socialIcons).map(([key, { icon }]) => (
                <button
                  key={key}
                  type="button"
                  className="p-2 border rounded hover:bg-gray-100"
                  onClick={() => {
                    const socials = {
                      ...form.getValues("footer.social"),
                      [key]: "",
                    };
                    form.setValue("footer.social", socials);
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Colors */}
        <ColorsSection initialColors={form.getValues("colors")} />
        <ApplyThemeVariables />

        <button
          type="submit"
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-accent)]"
        >
          {t("save")}
        </button>
      </form>
    </FormProvider>
  );
}
