"use client";

import React, { useEffect, useState } from "react";
import { newsletterApi } from "@/services/newsletterService";
import Table from "@/components/common/Table";
import { useTranslations } from "next-intl";

type Subscriber = {
  id: number;
  email: string;
  active: boolean;
};

export default function SubscribersPage() {
  const t = useTranslations("Dashboard.Newsletter.subscribers");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubs = async () => {
      setLoading(true);
      try {
        const res = await newsletterApi.getSubsrcribers();
        setSubscribers(res);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setSubscribers([]);
        } else {
          console.error("Failed to fetch subscribers:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  const toggleActive = async (sub: Subscriber) => {
    if (sub.active) {
      await newsletterApi.unsubscribe(sub.email);
    } else {
      await newsletterApi.subscribe({ email: sub.email });
    }
    setSubscribers((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, active: !sub.active } : s))
    );
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-[var(--color-primary)]">
        {t("title")}
      </h1>
      {loading ? (
        <p>{t("loading")}</p>
      ) : (
        <Table
          columns={[
            { header: t("email"), accessor: "email" },
            { header: t("active"), accessor: "active" },
          ]}
          data={subscribers}
          limit={10}
          onEdit={(sub) => toggleActive(sub)}
          showActions={false}
          sortable
        />
      )}
    </div>
  );
}
