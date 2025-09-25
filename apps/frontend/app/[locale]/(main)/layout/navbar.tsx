"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import ThemeToggle from "@/components/common/ThemeToggle";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useEffect, useRef, useState } from "react";
import { useSiteData } from "../../context/SiteContext";
import Image from "next/image";
import { ChevronUp, Menu, X } from "lucide-react";
import { getCategories, Category } from "@/services/categories";
import { usePathname } from "next/navigation";
import { slugify } from "@/utils/slugify";

export default function Header() {
  const locale = useLocale().toUpperCase();
  const t = useTranslations("Main.nav");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { siteSettings, practiceAreas } = useSiteData();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    })();
  }, []);

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-bg)] border-b border-[var(--form-border)] shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div>
            <Link href="/">
              {siteSettings?.logoUrl ? (
                <Image
                  src={
                    process.env.NEXT_PUBLIC_BACKEND_URL + siteSettings?.logoUrl
                  }
                  alt={`${siteSettings?.metaTitle} Logo`}
                  width={200}
                  height={115}
                  priority
                  className="ms-2"
                />
              ) : (
                <span className="font-bold text-lg text-[var(--color-primary)]">
                  Law Firm
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="hidden md:flex gap-6 items-center font-semibold text-lg text-[var(--color-text)]"
          >
            <Link
              href="/"
              className="hover:text-[var(--color-accent)] transition"
            >
              {t("home")}
            </Link>
            <Link
              href="/about"
              className="hover:text-[var(--color-accent)] transition"
            >
              {t("about")}
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="hover:text-[var(--color-accent)] flex transition"
              >
                {t("services")}
                <ChevronUp
                  className={`${open ? "" : "rotate-180"} transition-all duration-300 ease-in-out`}
                />
              </button>
              {open && (
                <div className="absolute left-0 mt-2 w-56 bg-[var(--color-bg)] border border-[var(--form-border)] rounded-md shadow-lg z-50">
                  <ul className="py-2">
                    {practiceAreas.map((service) => (
                      <li key={service.id}>
                        <Link
                          href={`/services/${service.slug}`}
                          className="block px-4 py-2 hover:bg-[var(--color-accent)]/10"
                          onClick={() => setOpen(false)}
                        >
                          {service.title[locale] ?? service.slug}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link
              href="/blogs"
              className="hover:text-[var(--color-accent)] transition"
            >
              {t("blogs")}
            </Link>
            <Link
              href="/faqs"
              className="hover:text-[var(--color-accent)] transition"
            >
              {t("faqs")}
            </Link>
            <Link
              href="/contact"
              className="hover:text-[var(--color-accent)] transition"
            >
              {t("contact")}
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />

            {/* Hamburger for Mobile */}
            <button
              className="md:hidden text-[var(--color-text)]"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-[var(--form-border)] bg-[var(--color-bg)] shadow-lg"
          >
            <ul className="flex flex-col p-4 space-y-3 font-medium text-[var(--color-text)]">
              <li>
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={() => setMobileOpen(false)}>
                  {t("about")}
                </Link>
              </li>
              <li>
                <details>
                  <summary className="flex justify-between cursor-pointer">
                    {t("services")}
                  </summary>
                  <ul className="pl-4 mt-2 space-y-2">
                    {practiceAreas.map((service) => (
                      <li key={service.id}>
                        <Link
                          href={`/services/${service.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block hover:text-[var(--color-accent)]"
                        >
                          {service.title[locale] ?? service.slug}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
              <li>
                <Link href="/blogs" onClick={() => setMobileOpen(false)}>
                  {t("blogs")}
                </Link>
              </li>
              <li>
                <Link href="/faqs" onClick={() => setMobileOpen(false)}>
                  {t("faqs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={() => setMobileOpen(false)}>
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Blog Categories Navbar */}
        {categories.length > 0 && (
          <nav className="bg-[var(--color-primary)] flex justify-center text-center items-center no-scrollbar gap-6 h-12 p-0">
            {categories.map((cat) => {
              const slug = slugify(cat.name.EN);
              const href = `/blogs/${slug}?id=${cat.id}`;
              const isActive = pathname.includes(`/blogs/${slug}`);

              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={`font-medium px-3 py-3 h-full transition-all duration-300 ${
                    isActive
                      ? "bg-[var(--color-bg)] text-[var(--color-primary)]"
                      : "text-[var(--color-bg)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  {cat.name[locale] ?? cat.name.EN}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Schema for Navigation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              name: ["Home", "About", "Services", "Blogs", "FAQs", "Contact"],
              url: ["/", "/about", "/services", "/blogs", "/faqs", "/contact"],
            }),
          }}
        />
      </header>
    </>
  );
}
