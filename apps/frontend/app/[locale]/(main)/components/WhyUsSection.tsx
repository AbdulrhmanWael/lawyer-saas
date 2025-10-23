"use client";

import { useEffect, useState } from "react";
import { whyUsService, WhyUs } from "@/services/whyUsService";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { ShieldCheck, Clock, Users, Scale, Lock } from "lucide-react";

const featureIcons = [ShieldCheck, Clock, Lock, Users, Scale];

export default function WhyUsSection() {
  const [item, setItem] = useState<WhyUs | null>(null);
  const locale = useLocale().toUpperCase();
  const t = useTranslations("Main.Home.whyUs");

  useEffect(() => {
    whyUsService.getAll().then((res) => setItem(res[0]));
  }, []);

  if (!item) return null;

  const features = t.raw("features") as {
    title: string;
    description: string;
  }[];

  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
          {item.title[locale]}
        </h2>
        <p
          className={`text-lg text-[var(--color-text)] mb-6 ${
            locale === "AR" ? "text-right" : "text-left"
          }`}
        >
          {item.paragraph[locale]}
        </p>
        <Link
          href="/about"
          className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-accent)] transition"
        >
          {item.buttonText[locale]}
        </Link>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {features.map((feat, idx) => {
          const Icon = featureIcons[idx];
          return (
            <motion.div
              key={idx + 1}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-[var(--color-bg)]/90 rounded-2xl
                         p-6 flex flex-col items-center text-center
                         shadow border border-[var(--form-border)]
                         hover:shadow-lg
                         transform transition-all duration-500
                         hover:scale-[1.05]"
            >
              {Icon && (
                <Icon className="w-12 h-12 text-[var(--color-primary)] mb-4" />
              )}
              <h3 className="font-semibold text-lg text-[var(--color-heading)] mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-[var(--color-text)]">
                {feat.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
