"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CoverImageInput from "@/components/common/DropzoneImage";
import LanguageTabs from "@/components/common/LanguageTabs";
import { useLocale, useTranslations } from "next-intl";
import { StaffFormData, staffSchema } from "./staffSchema";
import { LANGS } from "../../blogs/blog/components/BlogForm";
import {
  PracticeArea,
  practiceAreaService,
} from "@/services/practiceAreaService";
import { translateText } from "@/utils/translate";
type defaultValueProps = Partial<StaffFormData> & {
  imageUrl?: string;
};

type StaffFormProps = {
  defaultValues?: defaultValueProps;
  onSubmit: (data: StaffFormData) => Promise<void>;
  submitLabel?: string;
};

export default function StaffForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: StaffFormProps) {
  const t = useTranslations("Dashboard.Staff");
  const locale = useLocale().toUpperCase();
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    practiceAreaService.getAll().then(setPracticeAreas);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      bio: defaultValues?.bio ?? {},
      ...defaultValues,
    },
  });
  const handleTranslateBio = async () => {
    const sourceText = bio[activeLang];
    if (!sourceText) return;

    setTranslating(true);

    try {
      const newBio: Record<string, string> = { ...bio };

      for (const lang of LANGS.filter((l) => l !== activeLang)) {
        if (newBio[lang]) {
          const translated = await translateText(
            sourceText,
            activeLang.toLowerCase(),
            lang.toLowerCase()
          );
          newBio[lang] = translated;
        }
      }
      setValue("bio", newBio);
    } catch (err) {
      console.error("Bio translation failed:", err);
    } finally {
      setTranslating(false);
    }
  };

  useEffect(() => {
    if (defaultValues) {
      reset({
        bio: defaultValues.bio ?? {},
        ...defaultValues,
      });
    }
  }, [defaultValues, reset]);

  const [activeLang, setActiveLang] = useState(LANGS[0]);

  const bio = watch("bio") || {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
          {t("name")}
        </label>
        <input {...register("name")} className="text-input" />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Position */}
      <div>
        <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
          {t("position")}
        </label>
        <input {...register("position")} className="text-input" />
        {errors.position && (
          <p className="text-sm text-red-500">{errors.position.message}</p>
        )}
      </div>

      {/* Practice Area */}
      <div>
        <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
          {t("practiceArea")}
        </label>
        <select {...register("practiceAreaId")} className="text-input">
          <option value="">{t("selectPracticeArea")}</option>
          {practiceAreas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.title[locale] ?? Object.values(area.title)[0]}{" "}
              {/* fallback */}
            </option>
          ))}
        </select>
        {errors.practiceAreaId && (
          <p className="text-sm text-red-500">
            {errors.practiceAreaId.message}
          </p>
        )}
      </div>

      {/* Order */}
      <div>
        <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
          {t("order")}
        </label>
        <input
          type="number"
          {...register("order", { valueAsNumber: true })}
          className="text-input"
        />
      </div>

      {/* Bio with language tabs */}
      <div>
        <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
          {t("bio")}
        </label>
        <LanguageTabs
          languages={LANGS}
          activeLang={activeLang}
          onChange={setActiveLang}
        />
        <textarea
          key={`bio-${activeLang}`}
          className="text-input min-h-[250px]"
          value={bio[activeLang] || ""}
          onChange={(e) =>
            setValue("bio", { ...bio, [activeLang]: e.target.value })
          }
        />
        <button
          type="button"
          onClick={handleTranslateBio}
          disabled={translating}
          className={`mt-2 px-4 py-2 rounded text-white ${
            translating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[var(--color-accent)]"
          }`}
        >
          {translating ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              {t("translating")}
            </>
          ) : (
            t("translate")
          )}
        </button>
        {errors.bio && (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <p className="text-sm text-red-500">{errors.bio.message as any}</p>
        )}
      </div>

      {/* Image */}
      <div>
        <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
          {t("image")}
        </label>
        <CoverImageInput
          onChange={(file) => setValue("imageFile", file)}
          preview={
            watch("imageFile")
              ? URL.createObjectURL(watch("imageFile") as File)
              : defaultValues?.imageUrl || null
          }
        />
        {errors.imageFile && (
          <p className="text-sm text-red-500">{errors.imageFile.message}</p>
        )}
      </div>

      <button type="submit" className="btn_primary">
        {submitLabel || t("save")}
      </button>
    </form>
  );
}
