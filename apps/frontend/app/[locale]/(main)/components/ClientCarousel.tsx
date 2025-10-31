"use client";

import { useEffect, useState } from "react";
import { clientClient, Client } from "@/services/clientService";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ClientsCarousel() {
  const [clients, setClients] = useState<Client[]>([]);
  const t = useTranslations("Main.Home.clients");

  useEffect(() => {
    clientClient.getAll().then((res) => {
      setClients(res.filter((c) => c.isActive));
    });
  }, []);

  if (!clients.length) return null;

  const settings = {
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
          {t("title")}
        </h2>
        <p className="text-lg text-[var(--color-text)]">{t("intro")}</p>
      </div>

      <Slider {...settings}>
        {clients.map((client) => (
          <motion.div
            key={client.id}
            whileHover={{ scale: 1.05 }}
            className="px-6 py-4 flex justify-center items-center"
          >
            {client.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={process.env.NEXT_PUBLIC_BACKEND_URL + client.imageUrl}
                alt={client.name}
                className="h-48 sm:h-56 md:h-64 object-contain"
              />
            ) : (
              <span className="text-[var(--color-heading)] font-semibold text-lg sm:text-xl">
                {client.name}
              </span>
            )}
          </motion.div>
        ))}
      </Slider>
    </section>
  );
}
