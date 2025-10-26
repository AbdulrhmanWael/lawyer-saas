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
import { NavItem, navItemsClient } from "@/services/navItems";
import { FaEnvelope, FaPhone } from "react-icons/fa6";

type NavItemWithChildren = NavItem & { children?: NavItemWithChildren[] };

export default function Header() {
  const locale = useLocale().toUpperCase();
  const t = useTranslations("Main.nav");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { siteSettings, practiceAreas } = useSiteData();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavItemWithChildren[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await navItemsClient.getAll();
        setNavItems(data.filter((item) => item.visible));
      } catch (err) {
        console.error("Failed to load navigation", err);
      }
    })();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY != 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const buildTree = (items: NavItem[]): NavItemWithChildren[] => {
    const map = new Map<string, NavItemWithChildren>();
    const roots: NavItemWithChildren[] = [];

    for (const item of items) {
      map.set(item.id, { ...item, children: [] });
    }

    for (const item of items) {
      if (item.parentId) {
        const parent = map.get(item.parentId);
        if (parent) parent.children!.push(map.get(item.id)!);
      } else {
        roots.push(map.get(item.id)!);
      }
    }

    return roots;
  };

  const menuTree = buildTree(navItems);
  if (!siteSettings) {
    return (
      <header className="sticky top-0 z-50 bg-[var(--color-bg)]/90 border-b border-[var(--form-border)] shadow-sm"></header>
    );
  }
  return (
    <div className="fixed z-50 w-full">
      {/* Top Header */}
      <div
        className={`flex relative w-full bg-white justify-around z-51 items-center transition-all duration-700 ease-in-out ${
          scrolled
            ? "-top-[46px] pointer-events-none [transition-delay:0ms]"
            : "top-0 max-h-[120px] [transition-delay:0ms]"
        }`}
      >
        <div className="flex items-center">
          <span className="md:flex hidden items-center text-[var(--color-primary)]">
            <FaPhone /> &nbsp;
            <a href={`tel:${siteSettings.footer.phone}`}>
              <span>{siteSettings.footer.phone}</span>
            </a>
          </span>
          <span className="md:flex hidden items-center text-[var(--color-primary)]">
            &nbsp; | &nbsp;
            <FaEnvelope />
            &nbsp;
            <a href={`mailto:${siteSettings.footer.email}`}>
              {siteSettings.footer.email}
            </a>
          </span>
        </div>
        <div className="flex gap-x-5 items-center mt-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
      <header
        className={`fixed w-full z-40 transition-all duration-700 ease-in-out ${
          scrolled
            ? "top-0 bg-[var(--color-bg)] shadow-none [transition-delay:0ms]"
            : "top-10 bg-[var(--color-bg)]/90 shadow-sm"
        }`}
      >
        <div
          className={`container mx-auto flex items-center justify-between px-4 py-3`}
        >
          {/* Logo */}
          <div className="">
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
          {menuTree.length > 0 ? (
            <nav
              role="navigation"
              aria-label="Main Navigation"
              className="hidden md:flex gap-6 items-center font-semibold text-lg text-[var(--color-text)]"
            >
              {menuTree.map((item) => (
                <div key={item.id} className="relative">
                  {item.children!.length > 0 ? (
                    <>
                      <button
                        aria-haspopup="true"
                        aria-expanded={open === item.id.length > 0}
                        onClick={() => setOpen(!open)}
                        className="hover:text-[var(--color-accent)] flex transition"
                      >
                        {item.label[locale] ?? item.label.EN}
                        <ChevronUp
                          className={`${
                            open === item.id.length > 0 ? "" : "rotate-180"
                          } transition-all duration-300 ease-in-out`}
                        />
                      </button>

                      {open === item.id.length > 0 && (
                        <div className="absolute left-0 mt-2 w-56 bg-[var(--color-bg)] border border-[var(--form-border)] rounded-md shadow-lg z-50">
                          <ul className="py-2">
                            {item.children?.map((sub) => (
                              <li key={sub.id}>
                                <Link
                                  href={item.url + sub.url}
                                  className="block px-4 py-2 hover:bg-[var(--color-accent)]/10"
                                  onClick={() => setOpen(false)}
                                >
                                  {sub.label[locale] ?? sub.label.EN}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.url}
                      className="hover:text-[var(--color-accent)] transition"
                    >
                      {item.label[locale] ?? item.label.EN}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          ) : (
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
                href="/faq"
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
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-3">
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
            {menuTree.length > 0 ? (
              <ul className="flex flex-col p-4 space-y-3 font-medium text-[var(--color-text)]">
                {menuTree.map((item) => (
                  <li key={item.id}>
                    {item.children!.length > 0 ? (
                      <details>
                        <summary className="flex justify-between cursor-pointer">
                          {item.label[locale] ?? item.label.EN}
                        </summary>
                        <ul className="pl-4 mt-2 space-y-2">
                          {item.children!.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={sub.url}
                                onClick={() => setMobileOpen(false)}
                                className="block hover:text-[var(--color-accent)]"
                              >
                                {sub.label[locale] ?? sub.label.EN}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <Link
                        href={item.url}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label[locale] ?? item.label.EN}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
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
            )}
          </div>
        )}

        {/* Blog Categories Navbar */}
        {pathname.startsWith(`/${locale.toLowerCase()}/blogs`) &&
          categories.length > 0 && (
            <nav className="bg-[var(--color-primary)] flex justify-center text-center items-center no-scrollbar gap-6 h-12 p-0 overflow-x-auto">
              {categories.map((cat) => {
                const slug = slugify(cat.name.EN);
                const href = `/${locale.toLowerCase()}/blogs/${slug}?id=${cat.id}`;
                const isActive = pathname.includes(`/blogs/${slug}`);

                return (
                  <Link
                    key={cat.id}
                    href={href}
                    className={`font-medium px-3 py-3 h-full whitespace-nowrap transition-all duration-300 ${
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
    </div>
  );
}
