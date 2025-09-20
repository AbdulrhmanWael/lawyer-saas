"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Home,
  Users,
  Settings,
  BookText,
  PhoneCallIcon,
  MessageCircleQuestion,
  TagsIcon,
  ChevronsLeftRightIcon,
  LucideScrollText,
  LucideSettings2,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { useEffect, useState } from "react";
import { siteSettingsApi } from "@/services/siteSettings";

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();
  const t = useTranslations("Dashboard.Sidebar");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    siteSettingsApi
      .get()
      .then((res) => {
        if (res.logoUrl)
          setLogoUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}${res.logoUrl}`);
      })
      .catch(console.error);
  }, []);

  const routes = [
    { label: t("overview"), href: "/admin", icon: Home },
    { label: t("blogs"), href: "/admin/blogs", icon: BookText },
    {
      label: t("homeConfig"),
      href: "/admin/home-config",
      icon: ChevronsLeftRightIcon,
    },
    {
      label: t("practiceAreas"),
      href: "/admin/practice-areas",
      icon: TagsIcon,
    },
    { label: t("contacts"), href: "/admin/contacts", icon: PhoneCallIcon },
    { label: t("faq"), href: "/admin/faqs", icon: MessageCircleQuestion },
    {
      label: t("newsletter"),
      href: "/admin/newsletter",
      icon: LucideScrollText,
    },
    { label: t("users"), href: "/admin/users", icon: Users },
    { label: t("roleManagement"), href: "/admin/roles", icon: LucideSettings2 },
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
      <div className="flex items-center justify-center h-16 border-b border-[var(--color-secondary)]/20">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt="Logo"
            className={`h-10 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
          />
        ) : (
          <span
            className={`
              text-lg font-bold text-[var(--color-secondary)] transition-opacity
              ${isOpen ? "opacity-100" : "opacity-0"}
            `}
          >
            Dashboard
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-col space-y-2">
        {routes.map(({ label, href, icon: Icon }) => {
          const segments = pathname.split("/").filter(Boolean);
          const pathWithoutLocale = "/" + segments.slice(1).join("/");

          const active = pathWithoutLocale === href;

          return (
            <Link
              key={href}
              href={href}
              className={`
        flex items-center font-bold gap-3 px-5 py-4 rounded-md mx-2 transition-colors
        ${
          active
            ? "bg-[var(--color-primary)] text-white"
            : "text-[var(--color-text)] hover:bg-[var(--color-accent)]/10"
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
                  className={`${active ? "text-white" : "text-[var(--color-text)]"}`}
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
