"use client";

import { useTranslations } from "next-intl";
import { JSX } from "react";
import Link from "next/link";
import { useSiteData } from "../../context/SiteContext";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import Newsletter from "./Newsletter";

export default function Footer() {
  const t = useTranslations("Main.footer");
  const { siteSettings } = useSiteData();

  const year = new Date().getFullYear();
  const socialIcons: Record<
    string,
    { icon: JSX.Element; placeholder: string }
  > = {
    facebook: { icon: <FaFacebook />, placeholder: "Facebook URL" },
    whatsapp: { icon: <FaWhatsapp />, placeholder: "WhatsApp link" },
    instagram: { icon: <FaInstagram />, placeholder: "Instagram URL" },
    twitter: { icon: <FaXTwitter />, placeholder: "X (Twitter) URL" },
    linkedin: { icon: <FaLinkedin />, placeholder: "LinkedIn URL" },
  };

  return (
    <footer
      role="contentinfo"
      className="relative bg-[var(--color-primary)]  text-[var(--color-bg)] mt-16 bg-[url('/footer-bg.webp')] bg-cover bg-no-repeat bg-center"
    >
      <div className="relative container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6 py-16">
        {/* Column 1 - Logo */}
        <div className="space-y-5">
          {siteSettings?.logoUrl ? (
            <div className="relative">
              <Image
                src={
                  process.env.NEXT_PUBLIC_BACKEND_URL + siteSettings?.logoUrl
                }
                alt={`${siteSettings?.metaTitle} Logo`}
                width={200}
                height={115}
                priority
                className="ms-2"
              />
            </div>
          ) : (
            <h2 className="text-xl font-bold text-[var(--color-primary)] mb-4">
              Law Firm
            </h2>
          )}
          {/* Newsletter on mobile */}
          <div className="md:hidden">
            <Newsletter />
          </div>
        </div>

        {/* Column 2 - Contact Details */}
        <div>
          <h3 className="font-semibold mb-2">{t("contactHeading")}</h3>
          <hr className="mb-4 text-gray-300 w-10/12" />
          <ul className="space-y-5 text-sm">
            <li>
              <h6 className="mb-2">{t("address")} </h6>
              <div className="flex gap-x-2 items-center">
                <MapPin size={17} />
                {siteSettings?.footer.address}
              </div>
            </li>
            <li>
              <h6 className="mb-2">{t("callUs")} </h6>
              <a
                href={"tel:" + siteSettings?.footer.phone}
                className="hover:text-[var(--color-accent)]"
              >
                <div className="flex gap-x-2 items-center">
                  <Phone size={17} />
                  {siteSettings?.footer.phone}
                </div>
              </a>
            </li>
            <li>
              <h6 className="mb-2">{t("email")} </h6>
              <a
                href={"mailto:" + siteSettings?.footer.email}
                className="hover:text-[var(--color-accent)]"
              >
                <div className="flex gap-x-2 items-center">
                  <Mail size={17} />
                  {siteSettings?.footer.email}
                </div>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 - Information */}
        <div>
          <h3 className="font-semibold mb-2">{t("infoHeading")}</h3>
          <hr className="mb-4 text-gray-300 w-10/12" />
          <ul className="space-y-4 text-sm">
            <li>
              <Link href="/about" className="hover:text-[var(--color-accent)]">
                {t("aboutUs")}
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-[var(--color-accent)]"
              >
                {t("privacyPolicy")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-[var(--color-accent)]"
              >
                {t("contactUs")}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-[var(--color-accent)]">
                {t("faq")}
              </Link>
            </li>
            <li>
              <Link href="/blogs" className="hover:text-[var(--color-accent)]">
                {t("blogs")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 - Newsletter (moved here) */}
        <div className="hidden md:block">
          <h3 className="font-semibold mb-2">{t("newsletterHeading")}</h3>
          <hr className="mb-4 text-gray-300 w-10/12" />
          <Newsletter />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t bg-[var(--color-bg)] border-[var(--form-border)] px-4 sm:px-8 md:px-16 lg:px-32 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <p className="text-black">
          <a
            href="#top"
            className="me-1"
            style={{ color: "var(--color-accent)" }}
          >
            {siteSettings?.metaTitle}
          </a>
          {t("copyright", { year })}
        </p>
        <div className="flex gap-4 text-2xl">
          {Object.entries(siteSettings?.footer.social || {}).map(
            ([key, value]) => (
              <a
                key={key}
                href={value}
                target="_blank"
                className={`social-links social-${key}`}
                aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
              >
                {socialIcons[key].icon}
              </a>
            )
          )}
        </div>
      </div>

      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalService",
            name: siteSettings?.metaTitle,
            image: process.env.NEXT_PUBLIC_BACKEND_URL! + siteSettings?.logoUrl,
            address: {
              "@type": "PostalAddress",
              streetAddress: siteSettings?.footer.address,
            },
            telephone: siteSettings?.footer.phone,
            email: siteSettings?.footer.email,
            url: process.env.NEXT_PUBLIC_FRONTEND_URL,
            sameAs: Object.values(siteSettings?.footer.social || {}),
          }),
        }}
      />
    </footer>
  );
}
