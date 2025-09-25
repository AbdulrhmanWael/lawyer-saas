"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Modal from "@/components/common/Modal";
import {
  PracticeArea,
  practiceAreaService,
} from "@/services/practiceAreaService";
import { useLocale, useTranslations } from "next-intl";
import { usePracticeAreas } from "../context/PracticeAreaContext";
import { normalizeField } from "./edit/[slug]/PracticeAreaForm";

interface Props {
  practiceAreas: PracticeArea[];
}

export default function PracticeAreasTable({ practiceAreas }: Props) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Dashboard.PracticeAreas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { setSelectedPracticeArea } = usePracticeAreas();

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    await practiceAreaService.delete(selectedId);
    router.refresh();
    setIsModalOpen(false);
  };

  const isRTL = ["ar", "he", "fa", "ur"].includes(locale);

  return (
    <>
      <h1 className="mb-5 text-[var(--color-text)] text-2xl font-bold">
        {t("heading")}
      </h1>

      <div className="flex flex-col gap-4">
        {practiceAreas.map((pa) => {
          const normalizedTitle = normalizeField(pa.title);
          const normalizedExcerpt = normalizeField(pa.excerpt);

          return (
            <div
              key={pa.id}
              className="flex justify-between items-start gap-4 p-4 border border-[var(--color-accent)] rounded-md shadow-sm bg-[var(--color-bg)]"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="flex flex-col gap-1 max-w-[80%]">
                <h2 className="text-lg font-semibold text-[var(--color-primary)]">
                  {normalizedTitle?.[locale.toUpperCase()] ||
                    normalizedTitle?.EN ||
                    ""}
                </h2>
                <p className="text-sm text-[var(--color-secondary)]">
                  {normalizedExcerpt?.[locale.toUpperCase()] ||
                    normalizedExcerpt?.EN ||
                    ""}
                </p>
              </div>

              <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button
                  onClick={() => {
                    setSelectedPracticeArea({
                      ...pa,
                      title: normalizedTitle,
                      excerpt: normalizedExcerpt,
                    });
                    router.push(`/admin/practice-areas/edit/${pa.slug}`);
                  }}
                  className="px-3 py-2 rounded bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90 flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" /> {t("edit")}
                </button>

                <button
                  onClick={() => handleDelete(pa.id)}
                  className="px-3 py-2 rounded bg-[var(--form-error)] text-white hover:bg-[var(--form-error)]/90 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> {t("delete")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        title={t("confirmDeleteTitle")}
        isConfirm
        confirmText={t("delete")}
        cancelText={t("cancel")}
        onClose={() => setIsModalOpen(false)}
        onSubmit={confirmDelete}
      />
    </>
  );
}
