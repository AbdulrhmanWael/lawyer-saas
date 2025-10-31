"use client";

import { useEffect, useState } from "react";
import { carouselClient, CarouselItem } from "@/services/carouselService";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function HeroCarousel() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const locale = useLocale().toUpperCase();
  const t = useTranslations("Main.Home.carousel");
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  useEffect(() => {
    (async () => {
      try {
        const data = await carouselClient.getAll();
        const parsed: CarouselItem[] = data.map((item: CarouselItem) => ({
          ...item,
          paragraph:
            typeof item.paragraph === "string"
              ? JSON.parse(item.paragraph)
              : item.paragraph,
          header:
            typeof item.header === "string"
              ? JSON.parse(item.header)
              : item.header,
          buttonText:
            typeof item.buttonText === "string"
              ? JSON.parse(item.buttonText)
              : item.buttonText,
        }));

        setItems(parsed);

        parsed.forEach((it) => {
          if (it.imageUrl) {
            const src = BASE + it.imageUrl;
            const img = new globalThis.Image();
            img.src = src;
            img.onload = () =>
              setLoaded((prev) => {
                const s = new Set(prev);
                s.add(src);
                return s;
              });
          }
        });
      } catch (err) {
        console.error("Failed to load carousel items", err);
      }
    })();
  }, [BASE]);

  useEffect(() => {
    if (!items.length) return;
    const timeout = setTimeout(() => {
      const next = (active + 1) % items.length;
      setActive(next);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [active, items]);

  if (!items.length) return null;

  return (
    <section className="relative w-full min-h-[70vh] lg:min-h-[85vh] overflow-hidden text-center bg-[var(--color-bg)]">
      {/* Background image */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.img
            key={items[active].id}
            src={items[active].imageUrl ? BASE + items[active].imageUrl : ""}
            alt={items[active].header?.[locale] ?? "Hero Slide"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Content */}
      <div className="relative flex flex-col justify-center items-center px-6 md:px-10 lg:px-20 text-center py-12 sm:py-16 md:py-20">
        <motion.div
          key={items[active].id + "-text"}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl flex flex-col pt-20 items-center gap-4 md:gap-6"
        >
          {/* Header */}
          <h1
            className={`font-bold text-white leading-tight ${
              locale === "AR" ? "text-right" : "text-center"
            } text-2xl sm:text-3xl md:text-4xl lg:text-5xl`}
          >
            {items[active].header?.[locale]}
          </h1>

          {/* Paragraph */}
          <motion.p
            className={`text-gray-200 leading-relaxed ${
              locale === "AR" ? "text-right" : "text-center"
            } text-sm sm:text-base md:text-lg max-w-2xl`}
            initial={{ x: locale === "AR" ? 40 : -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: locale === "AR" ? -20 : 20, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {items[active].paragraph?.[locale]}
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 sm:mt-6"
          >
            <Link
              href={items[active].buttonLink || "/contact"}
              className="inline-block px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-[var(--color-primary)] text-white rounded-lg shadow-lg hover:bg-[var(--color-accent)] transition-all duration-300 text-sm sm:text-base md:text-lg"
            >
              {items[active].buttonText[locale] || t("learnMore")}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center gap-2 sm:gap-3">
        {items.map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setActive(idx)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-transform duration-300 ${
              idx === active
                ? "bg-[var(--color-primary)] scale-110"
                : "bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
