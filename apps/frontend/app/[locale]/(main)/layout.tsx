"use client";

import { useEffect, useState } from "react";
import Footer from "./layout/footer";
import Header from "./layout/navbar";
import "../globals.css";
import { FaFacebookMessenger, FaWhatsapp } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hideButtons, setHideButtons] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setHideButtons(entry.isIntersecting));
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />

      <main className="flex-1">{children}</main>

      {/* Floating buttons */}
      {!hideButtons && (
        <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-50">
          {/* WhatsApp */}
          <a
            href="https://wa.me/201234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="w-18 h-18 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <FaWhatsapp className="text-4xl text-white" />
          </a>

          {/* Messenger */}
          <a
            href="https://m.me/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            className="w-18 h-18 rounded-full bg-blue-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <FaFacebookMessenger className="text-white text-4xl" />
          </a>
        </div>
      )}

      {hideButtons && (
        <button className="w-10 text-[var(--color-bg)] fixed ms-5 right-5 bottom-5 flex items-center justify-center h-10 rounded-lg z-50 bg-[var(--color-primary)]">
          <FaArrowUp />
        </button>
      )}

      <Footer />
    </div>
  );
}
