"use client";

import { JSX, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import LanguageTabs from "@/components/common/LanguageTabs";
import CarouselSection from "./home-config/components/CarouselSection";
import WhyUsSection from "./home-config/components/WhyUsSection";
import TestimonialsSection from "./home-config/components/TestimonialsSection";
import ClientsSection from "./home-config/components/ClientsSection";
import { useTranslations } from "next-intl";
import NavItemsSection from "./home-config/components/NavItemsSection";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const LANGS = ["EN", "AR", "DE", "RO", "RU", "ZH", "IT", "FR"];
  const [activeLang, setActiveLang] = useState(LANGS[0]);
  const [carouselOpen, setCarouselOpen] = useState(true);
  const [whyUsOpen, setWhyUsOpen] = useState(false);
  const [testimonialsOpen, setTestimonialsOpen] = useState(false);
  const [clientsOpen, setClientsOpen] = useState(false);
  const [navItemsOpen, setNavItemsOpen] = useState(false);

  const renderDropdown = (
    title: string,
    isOpen: boolean,
    toggle: () => void,
    content: JSX.Element
  ) => (
    <div className="mb-6 border rounded shadow-sm bg-[var(--color-bg)]">
      <button
        type="button"
        onClick={toggle}
        className="w-full flex justify-between items-center px-4 py-2 font-semibold text-[var(--color-primary)] bg-[var(--color-bg)] border-b border-[var(--color-accent)]"
      >
        {title}
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      {isOpen && <div className="p-4">{content}</div>}
    </div>
  );

  return (
    <div className="p-6">
      <LanguageTabs
        languages={LANGS}
        activeLang={activeLang}
        onChange={setActiveLang}
      />

      {renderDropdown(
        t("CarouselItems.carouselSection"),
        carouselOpen,
        () => setCarouselOpen((prev) => !prev),
        <CarouselSection activeLang={activeLang} />
      )}

      {renderDropdown(
        t("WhyUsSection.whyUsSection"),
        whyUsOpen,
        () => setWhyUsOpen((prev) => !prev),
        <WhyUsSection activeLang={activeLang} />
      )}

      {renderDropdown(
        t("TestimonialsSection.testimonialsSection"),
        testimonialsOpen,
        () => setTestimonialsOpen((prev) => !prev),
        <TestimonialsSection activeLang={activeLang} />
      )}

      {renderDropdown(
        t("ClientsSection.clientsSection"),
        clientsOpen,
        () => setClientsOpen((prev) => !prev),
        <ClientsSection />
      )}

      {renderDropdown(
        t("NavItemsSection.navItemsSection"),
        navItemsOpen,
        () => setNavItemsOpen((prev) => !prev),
        <NavItemsSection activeLang={activeLang} />
      )}
    </div>
  );
}
