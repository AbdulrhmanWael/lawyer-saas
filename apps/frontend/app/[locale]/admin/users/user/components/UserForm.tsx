"use client";

import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import {
  createUser,
  updateUser,
  getUser,
  CreateUserDto,
  UpdateUserDto,
} from "@/services/users";
import AvatarInput from "@/components/common/AvatarInput";
import { Button } from "@/components/ui/forms/Button";

type UserFormData = {
  name: string;
  email: string;
  password?: string;
  roleName: string;
  avatarUrl?: File;
};

export default function UserForm() {
  const t = useTranslations("Dashboard.UserForm");
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = Boolean(params.id);

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const userSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z
      .union([
        z.string().length(0),
        z.string().min(8, "Password must be at least 8 characters"),
      ])
      .optional(),
    roleName: z.string().min(1, "Role is required"),
    avatarUrl: z.any().optional(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleName: "",
    },
  });

  useEffect(() => {
    if (params.id) {
      (async () => {
        setLoading(true);
        const user = await getUser(params.id!);
        reset({
          name: user.name,
          email: user.email,
          password: "",
          roleName: user.role,
          avatarUrl: undefined,
        });
        if (user.avatarUrl) {
          setPreview(process.env.NEXT_PUBLIC_BACKEND_URL + user.avatarUrl);
        }
        setLoading(false);
      })();
    }
  }, [params.id, reset]);

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      if (isEdit) {
        let updateDto: UpdateUserDto;
        if (data.password === "" || data.password === undefined) {
          updateDto = {
            name: data.name,
            email: data.email,
            roleName: data.roleName,
            avatarUrl:
              data.avatarUrl instanceof File ? data.avatarUrl : undefined,
          };
          await updateUser(params.id!, updateDto);
        } else {
          updateDto = {
            name: data.name,
            email: data.email,
            password: data.password,
            roleName: data.roleName,
            avatarUrl:
              data.avatarUrl instanceof File ? data.avatarUrl : undefined,
          };
          await updateUser(params.id!, updateDto);
        }
      } else {
        const createDto: CreateUserDto = {
          name: data.name,
          email: data.email,
          password: data.password!,
          roleName: data.roleName,
          avatarUrl:
            data.avatarUrl instanceof File ? data.avatarUrl : undefined,
        };
        await createUser(createDto);
      }
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center w-full">
      {/* Page header */}
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? t("editHeader") : t("createHeader")}
      </h1>

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
                  } else if (!isEdit) {
                    setPreview(null);
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
          <label className="block font-bold text-lg mb-2">{t("name")}</label>
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
          <label className="block font-bold text-lg mb-2">{t("email")}</label>
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
          <label className="block font-bold text-lg mb-2">
            {t("password")}
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full border rounded px-3 py-2"
            placeholder={isEdit ? t("passwordPlaceholder") : ""}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block font-bold text-lg mb-2">{t("role")}</label>
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
          disabled={loading}
          className="bg-[var(--color-primary)] text-[var(--color-bg)] rounded px-3 py-2 hover:bg-[var(--color-accent)]"
        >
          {loading ? t("loading") : isEdit ? t("update") : t("submit")}
        </Button>
      </form>
    </div>
  );
}
