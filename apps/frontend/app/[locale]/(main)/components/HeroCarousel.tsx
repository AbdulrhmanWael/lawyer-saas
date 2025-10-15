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
            const img = new window.Image();
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
    <section className="relative w-full h-[80vh] overflow-hidden text-center bg-[var(--color-bg)]">
      {/* Images */}
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
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Text */}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-4">
        <motion.div
          key={items[active].id + "-text"}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl flex flex-col items-center gap-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            {items[active].header?.[locale]}
          </h1>

          <motion.p
            className={`max-w-2xl text-lg md:text-xl text-gray-200 ${
              locale === "ar" ? "text-right" : "text-left"
            }`}
            initial={{ x: locale === "ar" ? 40 : -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: locale === "ar" ? -20 : 20, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {items[active].paragraph?.[locale]}
          </motion.p>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href={items[active].buttonLink || "/contact"}
              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg shadow-lg hover:bg-[var(--color-accent)] transition"
            >
              {items[active].buttonText[locale] || t("learnMore")}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
        {items.map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setActive(idx)}
            className={`w-3 h-3 rounded-full transition ${
              idx === active
                ? "bg-[var(--color-primary)] scale-110"
                : "bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
