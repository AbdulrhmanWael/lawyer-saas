"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("Dashboard.Auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmail = (e: { target: { value: string } }) => {
    console.log(e);
    setEmail(e.target.value);
  };
  const handlePassword = (e: { target: { value: string } }) => {
    console.log(e);
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/admin");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || t("invalidCredentials"));
      } else {
        setError(t("invalidCredentials"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[var(--color-bg)] border border-[var(--color-primary)] rounded-xl shadow-lg/30 p-6"
        dir={t("dir")}
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {t("loginTitle")}
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded text-center">
            {error}
          </p>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm mb-1">{t("email")}</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmail}
            className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
        </div>

        {/* Password with eye toggle */}
        <div className="mb-6 relative">
          <label className="block text-sm mb-1">{t("password")}</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handlePassword}
            className="w-full px-3 py-2 border rounded-md bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 top-5 right-3 flex items-center text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[var(--color-primary)] text-white rounded-md hover:opacity-90 transition"
        >
          {loading ? t("loading") : t("loginBtn")}
        </button>
      </form>
    </div>
  );
}
