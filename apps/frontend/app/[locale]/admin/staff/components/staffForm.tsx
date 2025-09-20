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

  useEffect(() => {
    practiceAreaService.getAll().then(setPracticeAreas);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      bio: defaultValues?.bio ?? {},
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      console.log(defaultValues);
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
          className="text-input min-h-[250px]"
          value={bio[activeLang] || ""}
          onChange={(e) =>
            setValue("bio", { ...bio, [activeLang]: e.target.value })
          }
        />
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
