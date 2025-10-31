"use client";

import { useEffect, useState } from "react";
import { testimonialClient, Testimonial } from "@/services/testimonialsService";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const t = useTranslations("Main.Home.testimonials");
  const locale = useLocale().toUpperCase();

  useEffect(() => {
    testimonialClient.getAll().then(setTestimonials);
  }, []);

  if (!testimonials.length) return null;

  const settings = {
    dots: true,
    infinite: testimonials.length > 1,
    autoplay: testimonials.length > 1,
    autoplaySpeed: 5000,
    speed: 600,
    slidesToShow: Math.min(testimonials.length, 3),
    slidesToScroll: 1,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(testimonials.length, 2),
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const getQuote = (test: Testimonial) => {
    let parsed: Record<string, string> = {};
    try {
      parsed =
        typeof test.quote === "string" ? JSON.parse(test.quote) : test.quote;
    } catch {
      parsed = {};
    }

    return (
      parsed[locale] || parsed["EN"] || parsed["AR"] || t("noQuoteAvailable")
    );
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
          {t("title")}
        </h2>
        <p className="text-lg text-[var(--color-text)]">{t("intro")}</p>
      </div>

      <Slider {...settings} className="testimonial-slider -mx-3 sm:mx-0">
        {testimonials.map((test, idx) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="p-3"
          >
            <div className="bg-[var(--color-bg)]/90 rounded-2xl shadow-lg hover:shadow-xl p-6 sm:p-8 flex border border-[var(--form-border)] flex-col justify-between max-h-[320px] min-h-[280px]">
              {/* Quote */}
              <p className="italic text-[var(--color-text)] mb-6 text-center line-clamp-5">
                “{getQuote(test)}”
              </p>

              {/* Person info */}
              <div className="flex items-start gap-3 mt-auto">
                {test.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={process.env.NEXT_PUBLIC_BACKEND_URL + test.imageUrl}
                    alt={test.person}
                    className="w-12 h-12 object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-[var(--color-heading)] leading-tight">
                    {test.person}
                  </h3>
                  <div className="flex mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i + 1}
                        className={`w-4 h-4 ${
                          i < test.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </Slider>
    </section>
  );
}
