"use client";

import { Menu, Search, ChevronDown, LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSidebar } from "../context/SidebarContext";
import ThemeToggle from "../../../../components/common/ThemeToggle";
import LanguageSwitcher from "../../../../components/common/LanguageSwitcher";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Header({ userProp }: { userProp?: any }) {
  const t = useTranslations();
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const [query, setQuery] = useState("");
  const onSearchSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    const res = await fetch(
      `/api/search/routes?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    console.log("search results:", data);
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [user, setUser] = useState({
    name: t("UserMenu.nameUnknown"),
    email: t("UserMenu.emailUnknown"),
    avatarUrl: "",
  });

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "null")
        : null;

    if (storedUser) setUser(storedUser);
    else if (userProp) setUser(userProp);
  }, [userProp]);

  return (
    <header className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-[var(--color-bg)] transition-all">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-[var(--color-accent)]/10 transition"
        >
          <Menu className="w-5 h-5 text-[var(--color-primary)]" />
        </button>
        <form onSubmit={onSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Header.searchPlaceholder")}
            className="w-full py-2 pl-9 pr-4 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LanguageSwitcher />

        <div className="relative">
          <button
            onClick={() => setDropdownOpen((s) => !s)}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-[var(--color-accent)]/10 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-sm text-gray-700">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="p-3 border-b border-gray-100">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-gray-500 truncate">
                  {user.email}
                </div>
              </div>
              <div className="p-2">
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => {
                    router.push(`/admin/profile`);
                    setDropdownOpen(false);
                  }}
                >
                  {t("Header.profile")}
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-gray-100 text-red-600"
                  onClick={() => {
                    localStorage.removeItem("user");
                    document.cookie = "token=; Max-Age=0; path=/";
                    router.push(`/auth/signin`);
                  }}
                >
                  <LogOut className="w-4 h-4" /> {t("Header.logout")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
