"use client";

import { useEffect, useState, useCallback } from "react";
import { faqService, FaqGroup, Faq } from "@/services/faq";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import debounce from "lodash.debounce";

export default function FaqPage() {
  const [groups, setGroups] = useState<FaqGroup[]>([]);
  const [searchResults, setSearchResults] = useState<Faq[]>([]);
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const t = useTranslations("Main.Faq");
  const locale = useLocale().toUpperCase();

  useEffect(() => {
    faqService.getGroups().then(setGroups);
  }, []);

  const searchFaqs = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await faqService.searchFaqs(q);
      setSearchResults(results);
    }, 400),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    searchFaqs(val);
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className="container mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-[var(--color-text)]">{t("intro")}</p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg mx-auto mb-12">
        <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
          <Search className="mx-2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={handleSearchChange}
            className="flex-1 px-2 py-2 outline-none"
          />
        </div>
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border mt-2 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            {searchResults.map((faq) => (
              <button
                key={faq.id}
                onClick={() => {
                  setQuery(faq.question[locale]);
                  setSearchResults([]);
                  setOpenFaq(faq.id);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {faq.question[locale]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FAQs Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {groups.map((group) => (
          <div key={group.id}>
            <h2 className="text-xl font-semibold text-[var(--color-heading)] mb-4">
              {group.title[locale]}
            </h2>
            <div className="space-y-3">
              {group.faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border rounded-lg overflow-hidden bg-[var(--color-bg)]"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-[var(--color-heading)]"
                  >
                    <span>{faq.question[locale]}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        openFaq === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === faq.id && (
                      <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { height: "auto", opacity: 1 },
                          collapsed: { height: 0, opacity: 0 },
                        }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-sm text-[var(--color-text)]">
                          {faq.answer[locale]}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
