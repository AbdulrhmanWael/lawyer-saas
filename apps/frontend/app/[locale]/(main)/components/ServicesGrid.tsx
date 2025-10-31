"use client";

import { useSiteData } from "../../context/SiteContext";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ServicesGrid() {
  const { practiceAreas, siteSettings } = useSiteData();
  const locale = useLocale().toUpperCase();
  const t = useTranslations("Main.Home.services");

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[var(--color-primary)]">
        {t("title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {practiceAreas.map((service) => {
          // check for logo
          const logoUrl =
            service.logoUrl ||
            (siteSettings?.logoUrl ? siteSettings.logoUrl : null);

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="block bg-[var(--color-primary)] border border-[var(--form-border)] rounded-lg p-6 shadow transition-transform duration-500 transform hover:scale-[1.03] hover:shadow-lg h-full"
              >
                {/* Logo if available */}
                {logoUrl && (
                  <div className="w-28 h-28 mx-auto mb-4 relative">
                    <Image
                      src={process.env.NEXT_PUBLIC_BACKEND_URL + logoUrl}
                      alt={service.title[locale]}
                      fill
                      sizes="auto"
                      className="object-contain"
                    />
                  </div>
                )}

                {/* Service title */}
                <h3 className="text-xl font-semibold mb-3 text-[var(--color-bg)] text-center">
                  {service.title[locale]}
                </h3>

                {/* Excerpt */}
                <p
                  className={`text-sm text-gray-50 mb-4 line-clamp-4 text-center ${
                    locale === "AR" ? "text-right" : "text-left"
                  }`}
                >
                  {service.excerpt?.[locale]}
                </p>

                <span className="block text-center text-[var(--color-primary)] font-medium hover:underline">
                  {t("learnMore")}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
