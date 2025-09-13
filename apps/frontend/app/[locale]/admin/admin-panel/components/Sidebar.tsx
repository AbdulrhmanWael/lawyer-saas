"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const links = [
  {
    labelKey: "sidebar.siteSettings",
    href: "/admin/admin-panel/site-settings",
  },
  {
    labelKey: "sidebar.practiceAreas",
    href: "/admin/admin-panel/practice-areas",
  },
  { labelKey: "sidebar.carousel", href: "/admin/admin-panel/carousel" },
  { labelKey: "sidebar.staff", href: "/admin/admin-panel/staff-members" },
  { labelKey: "sidebar.testimonials", href: "/admin/admin-panel/testimonials" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 font-bold text-xl border-b border-gray-200">
        Admin Panel
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded hover:bg-gray-100 ${
              pathname === link.href ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            {t(link.labelKey)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
