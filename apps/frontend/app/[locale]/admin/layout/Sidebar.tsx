"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, Users, Settings, BookText } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();
  const t = useTranslations("Dashboard.Sidebar");

  const routes = [
    { label: t("overview"), href: "/admin", icon: Home },
    { label: t("blogs"), href:"/admin/blogs", icon: BookText},
    { label: t("users"), href: "/admin/users", icon: Users },
    { label: t("settings"), href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside
      className={`
        fixed top-0 h-full transition-all duration-300
        bg-[var(--color-bg)] border-[var(--color-secondary)]/20 shadow-md
        ${isOpen ? "w-64" : "w-20"}
        ltr:left-0 ltr:border-r
        rtl:right-0 rtl:border-l
      `}
    >
      {/* Logo / title */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <span
          className={`
            text-lg font-bold text-[var(--color-secondary)] transition-opacity
            [html[data-theme=dark]_&]:text-white
            ${isOpen ? "opacity-100" : "opacity-0"}
          `}
        >
          Dashboard
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-col space-y-2">
        {routes.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-md mx-2 transition-colors
                ${
                  active
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-secondary)] hover:bg-gray-100"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 ${
                  active ? "text-white" : "text-[var(--color-primary)]"
                }`}
              />
              {isOpen && (
                <span
                  className={`${
                    active ? "text-white" : "text-[var(--color-secondary)]"
                  }`}
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
