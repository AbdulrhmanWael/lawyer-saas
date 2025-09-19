"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Eye, EyeOff } from "lucide-react";
import { updateUser, updatePassword, getUser, User } from "@/services/users";

export default function AdminSettings() {
  const t = useTranslations("Dashboard.ProfileSettings");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    role?: User["role"];
    password: string;
    avatarUrl?: string;
  }>({ name: "", email: "", role: "", password: "", avatarUrl: "" });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [storedUser, setStoredUser] = useState<{
    id: string;
    name: string;
    avatarUrl: string;
    role: string;
    email: string;
    createdAt: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const user = JSON.parse(localStorage.getItem("user") || "null");
    setStoredUser(user);
  }, []);
  useEffect(() => {
    if (!storedUser?.id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await getUser(storedUser.id);
        setProfile({
          name: user.name,
          email: user.email,
          role: user.role,
          password: "",
          avatarUrl: user.avatarUrl,
        });
        localStorage.setItem("user", JSON.stringify(user));
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [storedUser?.id]);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const updated = await updateUser(storedUser!.id, {
        name: profile.name,
        email: profile.email,
        password: profile.password || undefined,
      });
      setProfile((p) => ({ ...p, ...updated, password: "" }));
      localStorage.setItem("user", JSON.stringify(updated));
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
        email: profile.email,
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

      const updated = await updateUser(storedUser!.id, {
        name: profile.name,
        email: profile.email,
        roleName: profile.role,
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
                    key={field}
                    type={
                      field === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : "text"
                    }
                    value={
                      (profile[field as keyof typeof profile] as string) || ""
                    }
                    disabled={field === "role" || !isEditingProfile}
                    className="w-full px-3 py-2 border rounded-md text-[var(--color-text)] bg-white disabled:bg-gray-100 disabled:text-gray-400"
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
              className="btn_primary"
            >
              {loading ? t("saving") : t("done")}
            </button>
          ) : (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="btn_primary"
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
              {["current", "new", "confirm"].map((field) => {
                const key = field as keyof typeof showPasswordFields;
                const show = showPasswordFields[key];
                return (
                  <div key={field} className="relative">
                    <label className="block text-sm mb-1">
                      {t(field + "Password")}
                      <input
                        type={show ? "text" : "password"}
                        value={passwordForm[key]}
                        onChange={(e) =>
                          setPasswordForm((f) => ({
                            ...f,
                            [key]: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswordFields((s) => ({
                            ...s,
                            [key]: !s[key],
                          }))
                        }
                        className="absolute top-7.5 right-2 text-gray-500 hover:text-gray-700"
                      >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-[var(--color-secondary)] text-[var(--color-bg)] rounded px-3 py-2 hover:bg-[var(--color-secondary)]/90"
                onClick={() => setIsEditingProfile(false)}
              >
                {t("cancel")}
              </button>
              <button
                className="btn_primary"
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
