"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

export default function GlobalSearch() {
  const t = useTranslations();
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    blogs: { title: Record<string, string>; id: string }[];
    users: { name: string; id: string }[];
  }>({ blogs: [], users: [] });
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch search results
  useEffect(() => {
    if (!query) {
      setResults({ blogs: [], users: [] });
      setDropdownOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/search?q=${encodeURIComponent(
          query
        )}&locale=${locale}`
      );
      const data = await res.json();
      setResults(data);
      setLoading(false);
      setDropdownOpen(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, locale]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Dashboard.Header.searchPlaceholder")}
          className="w-full py-2 pl-9 pr-4 rounded-md border border-[var(--color-primary)] bg-[var(--bg-color)]/90 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
      </div>

      {loading && (
        <p className="absolute mt-1 text-sm text-gray-500">Loading...</p>
      )}

      {dropdownOpen && (
        <div className="absolute bg-[var(--bg-color)] shadow-lg w-full max-h-80 overflow-y-auto mt-1 z-50 rounded-md border border-[var(--color-primary)]">
          {results.blogs.length === 0 && results.users.length === 0 ? (
            <p className="px-2 py-1 text-gray-500">
              {t("Dashboard.Header.noResults")}
            </p>
          ) : (
            <>
              {results.blogs.length > 0 && (
                <>
                  <h4 className="px-2 py-1 font-bold border-b border-[var(--color-primary)]">
                    Blogs
                  </h4>
                  {results.blogs.map((blog) => (
                    <button
                      key={blog.id}
                      className="px-2 py-1 hover:bg-gray-100 w-full text-left cursor-pointer"
                      onClick={() => {
                        router.push(`/admin/blogs/blog/${blog.id}`);
                        setDropdownOpen(false);
                      }}
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(blog.title[locale] || "", query),
                      }}
                    />
                  ))}
                </>
              )}

              {results.users.length > 0 && (
                <>
                  <h4 className="px-2 py-1 font-bold border-b border-[var(--color-primary)]">
                    Users
                  </h4>
                  {results.users.map((user) => (
                    <button
                      key={user.id}
                      className="px-2 py-1 hover:bg-gray-100 w-full text-left cursor-pointer"
                      onClick={() => {
                        router.push(`/admin/users/user/${user.id}`);
                        setDropdownOpen(false);
                      }}
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(user.name, query),
                      }}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
