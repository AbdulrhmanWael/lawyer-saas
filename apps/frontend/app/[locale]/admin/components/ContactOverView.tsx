"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { apiClient } from "@/utils/apiClient";
import { ArrowRight, LucideMails } from "lucide-react";
import Link from "next/link";

export default function ContactOverviewCard() {
  const t = useTranslations("Dashboard.Overview");
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await apiClient.get<number>("/contact/count/unread");
      setUnreadCount(res);
    } catch (err) {
      console.error(err);
      setUnreadCount(1);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <div className="p-6 bg-[var(--color-bg)] rounded-2xl w-full md:w-3/12 shadow-lg flex flex-col items-center">
      <LucideMails size={50} />
      <h1 className="text-[var(--color-text)] mt-2 text-sm font-bold">
        {t("unreadMessages")}
      </h1>

      {unreadCount === 0 ? (
        <h2 className="text-[var(--color-primary)] text-lg mt-10 font-bold">
          {t("noMessages")}
        </h2>
      ) : (
        <>
          <h2 className="text-[var(--color-primary)] text-3xl mt-10 font-bold">
            {unreadCount}
          </h2>
          <Link
            href={"/admin/contacts"}
            className="text-[var(--color-text)] flex font-bold transition-colors duration-300 ease-in-out text-m hover:text-[var(--color-primary)]/85"
          >
            {t("readThem")}
            <ArrowRight></ArrowRight>
          </Link>
        </>
      )}
    </div>
  );
}
