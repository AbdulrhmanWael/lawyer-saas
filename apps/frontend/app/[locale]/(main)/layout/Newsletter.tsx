import { newsletterApi } from "@/services/newsletterService";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

export default function Newsletter() {
  const t = useTranslations("Main.footer");
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const handleSubscribe = async () => {
    if (!email) return;
    try {
      await newsletterApi.subscribe({ email });
      setSubscribed(true);
    } catch (err) {
      console.error("Subscription failed", err);
    }
  };

  return (
    <>
      <p className="mb-4 text-sm">{t("newsletterText")}</p>
      {subscribed ? (
        <p className="text-green-400 text-sm">Subscribed successfully!</p>
      ) : (
        <div className="flex">
          <label htmlFor="newsletter-email" className="sr-only">
            {t("subscribePlaceholder")}
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            placeholder={t("subscribePlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 border border-[var(--form-border)] bg-[var(--color-bg)] text-[var(--color-text)] w-full"
          />
          <button
            onClick={handleSubscribe}
            className="px-4 py-2 bg-[var(--color-primary)] border-[var(--color-bg)] border text-[var(--color-bg)] hover:bg-[var(--color-accent)] transition"
          >
            <Mail />
          </button>
        </div>
      )}
    </>
  );
}
