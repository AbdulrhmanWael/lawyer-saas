"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Eye, EyeOff } from "lucide-react";
import { updateUser, updatePassword, User } from "@/services/users";
import { fi } from "zod/v4/locales";

export default function AdminSettings() {
  const t = useTranslations("Dashboard.ProfileSettings");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user")!) as User;
  const [profile, setProfile] = useState({
    name: storedUser.name,
    email: storedUser.email,
    role: storedUser.role,
    password: "",
    avatarUrl: storedUser.avatarUrl,
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const updated = await updateUser(storedUser.id, {
        name: profile.name,
        email: profile.email,
        password: profile.password || undefined,
      });
      localStorage.setItem("user", JSON.stringify(updated));
      setProfile((p) => ({ ...p, ...updated, password: "" }));
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await updatePassword({
        email: storedUser.email,
        oldPassword: passwordForm.current,
        newPassword: passwordForm.new,
      });
      alert("Password updated successfully");
      setPasswordForm({ current: "", new: "", confirm: "" });
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Error changing password:", err);
      alert("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setLoading(true);

      const updated = await updateUser(storedUser.id, {
        name: profile.name,
        email: profile.email,
        roleName: profile.role?.name,
        avatarUrl: file,
      });

      localStorage.setItem("user", JSON.stringify(updated));
      setProfile((p) => ({ ...p, avatarUrl: updated.avatarUrl }));
    } catch (err) {
      console.error("Error uploading avatar:", err);
      alert("Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 text-[var(--color-text)] bg-[var(--color-bg)]">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <hr />

      <div className="space-y-6">
        <div className="flex mt-6 items-center gap-6">
          {/* Avatar */}
          <div className="relative w-36 h-36">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                profile.avatarUrl
                  ? process.env.NEXT_PUBLIC_BACKEND_URL! + profile.avatarUrl
                  : "https://www.shutterstock.com/image-vector/blank-profile-picture-placeholder-design-260nw-1681883869.jpg"
              }
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 end-0 bg-[var(--color-primary)] text-white p-2 rounded-full shadow hover:bg-[var(--color-accent)]"
              disabled={loading}
            >
              <Pencil size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarUpload(file);
              }}
            />
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            {["name", "email", "role", "password"].map((field) => (
              <div key={field} className="relative">
                <label className="block text-sm mb-1">
                  {t(field)}
                  <input
                    type={
                      field === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : field === "email"
                          ? "email"
                          : "text"
                    }
                    value={profile[field as keyof typeof profile] as string}
                    disabled={field === "role" || !isEditingProfile}
                    className="w-full px-3 py-2 border rounded-md text-[var(--color-text)] bg-white disabled:bg-gray-100 disabled:text-gray-400"
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, [field]: e.target.value }))
                    }
                  />
                  {field === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute top-8 end-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          {isEditingProfile ? (
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="bg-[var(--color-primary)] text-[var(--color-bg)] rounded px-3 py-2 hover:bg-[var(--color-accent)]"
            >
              {loading ? t("saving") : t("done")}
            </button>
          ) : (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="bg-[var(--color-primary)] text-[var(--color-bg)] rounded px-3 py-2 hover:bg-[var(--color-accent)]"
            >
              {t("editProfile")}
            </button>
          )}
        </div>

        {/* Change Password */}
        {isEditingProfile && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("changePassword")}
            </h3>
            <div className="space-y-4">
              {["current", "new", "confirm"].map((field) => (
                <div key={field}>
                  <label className="block text-sm mb-1">
                    {t(field + "Password")}
                    <input
                      type="password"
                      value={passwordForm[field as keyof typeof passwordForm]}
                      onChange={(e) =>
                        setPasswordForm((f) => ({
                          ...f,
                          [field]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-[var(--color-secondary)] text-[var(--color-bg)] rounded px-3 py-2 hover:bg-[var(--color-secondary)]/90"
                onClick={() => setIsEditingProfile(false)}
              >
                {t("cancel")}
              </button>
              <button
                className="bg-[var(--color-primary)] text-[var(--color-bg)] rounded px-3 py-2 hover:bg-[var(--color-accent)]"
                onClick={handleChangePassword}
                disabled={loading}
              >
                {loading ? t("saving") : t("changePasswordBtn")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
