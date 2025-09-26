"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { CarouselItem } from "@/services/carouselService";
import { Link } from "lucide-react";

export default function HeroCarouselClient({
  items,
}: {
  items: CarouselItem[];
}) {
  const [active, setActive] = useState(0);
  const locale = useLocale().toUpperCase();
  const t = useTranslations("Main.Home.carousel");
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [active, items]);

  return (
    <section className="relative w-full h-[80vh] overflow-hidden bg-[var(--color-bg)]">
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
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Text */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
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
            className="max-w-2xl text-lg md:text-xl text-gray-200"
            initial={{ x: locale === "AR" ? 40 : -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: locale === "AR" ? -20 : 20, opacity: 0 }}
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
