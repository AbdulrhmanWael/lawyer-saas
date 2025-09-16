"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { createUser } from "@/services/users";
import AvatarInput from "@/components/common/AvatarInput";
import { Button } from "@/components/ui/forms/Button";

const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleName: z.string().min(1, "Role is required"),
  avatarUrl: z.any().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserForm() {
  const t = useTranslations("Dashboard.UserForm");
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleName: "",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    await createUser(data);
    router.push("/admin/users");
  };

  return (
    <div className="flex justify-center flex-col items-center w-full">
      {/* Page header */}
      <h1 className="text-2xl font-bold mb-6">{t("createHeader")}</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 w-[500px]"
        encType="multipart/form-data"
      >
        {/* Avatar upload */}
        <div className="flex flex-col items-center">
          <Controller
            name="avatarUrl"
            control={control}
            render={({ field }) => (
              <AvatarInput
                value={field.value}
                preview={preview}
                onChange={(file) => {
                  field.onChange(file);
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            )}
          />
          {errors.avatarUrl && (
            <p className="text-red-500 text-sm mt-1">
              {errors.avatarUrl.message?.toString()}
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
            {t("name")}
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
            {t("email")}
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
            {t("password")}
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block font-bold text-lg text-[var(--color-text)] mb-2">
            {t("role")}
          </label>
          <input
            type="text"
            {...register("roleName")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.roleName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.roleName.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="bg-[var(--color-primary)] text-[var(--color-bg)] rounded px-3 py-2 hover:bg-[var(--color-accent)]"
        >
          {t("submit")}
        </Button>
      </form>
    </div>
  );
}
