"use client";

import { useEffect, useState } from "react";
import { staffClient, StaffMember } from "@/services/staffService";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function StaffSection() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const t = useTranslations("Main.Home.staff");
  const locale = useLocale().toUpperCase();

  useEffect(() => {
    staffClient.getAll().then((res) => {
      const sorted = [...res].sort((a, b) => a.order - b.order);
      setStaff(sorted.slice(0, 3)); // or all staff if you want full slider
    });
  }, []);

  if (!staff.length) return null;
  const settings = {
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <section className="container mx-auto px-4 py-14">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-2">
          {t("title")}
        </h2>
        <p className="text-base text-[var(--color-text)]">{t("intro")}</p>
      </div>

      <Slider {...settings}>
        {staff.map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ scale: 1.03 }}
            className="flex justify-center items-center"
          >
            <div
              className="rounded-lg overflow-hidden shadow-md hover:shadow-lg
                      bg-[var(--color-bg)]/90 transition-transform border border-[var(--form-border)] duration-300
                      flex flex-col w-[250px]"
            >
              {member.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={process.env.NEXT_PUBLIC_BACKEND_URL + member.imageUrl}
                  alt={member.name}
                  className="w-full aspect-[4/5] object-cover"
                />
              )}
              <div className="p-3 text-center bg-[var(--color-bg)]">
                <h3 className="text-base font-bold text-[var(--color-heading)] mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-[var(--color-primary)] font-medium mb-0.5">
                  {member.position}
                </p>
                {member.practiceAreaTitle && (
                  <p className="text-xs text-[var(--color-primary)]">
                    {member.practiceAreaTitle[locale]}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </Slider>
    </section>
  );
}
