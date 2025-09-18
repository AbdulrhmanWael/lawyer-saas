"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { faqService, Faq, FaqGroup, TranslatableString } from "@/services/faq";
import { LANGS } from "../blogs/blog/components/BlogForm";
import { Trash2, Edit2 } from "lucide-react";
import LanguageTabs from "@/components/common/LanguageTabs";

interface FaqForm {
  question: TranslatableString;
  answer: TranslatableString;
  groupId?: string;
}

interface FaqGroupForm {
  title: TranslatableString;
}

export default function FaqManager({
  initialGroups,
}: {
  initialGroups: FaqGroup[];
}) {
  const t = useTranslations("Dashboard.Faqs");
  const [groups, setGroups] = useState<FaqGroup[]>(initialGroups);
  const [activeLang, setActiveLang] = useState(LANGS[0]);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [editingGroup, setEditingGroup] = useState<FaqGroup | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FaqForm>({ defaultValues: { question: {}, answer: {} } });

  const {
    register: registerGroup,
    handleSubmit: handleSubmitGroup,
    reset: resetGroup,
    setValue: setGroupValue,
    formState: { errors: groupErrors },
  } = useForm<FaqGroupForm>({ defaultValues: { title: {} } });

  const refreshGroups = async () => {
    try {
      const data = await faqService.getGroups();
      setGroups(data);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitFaq = async (data: FaqForm) => {
    try {
      if (!data.groupId) return alert(t("selectGroup"));
      if (editingFaq) {
        await faqService.updateFaq(editingFaq.id, data.question, data.answer);
      } else {
        await faqService.createFaq(data.groupId, data.question, data.answer);
      }
      reset();
      setEditingFaq(null);
      refreshGroups();
    } catch (err) {
      console.error(err);
    }
  };

  const onEditFaq = (faq: Faq, groupId: string) => {
    setEditingFaq(faq);
    setValue("groupId", groupId);
    LANGS.forEach((lang) => {
      setValue(`question.${lang}`, faq.question[lang] || "");
      setValue(`answer.${lang}`, faq.answer[lang] || "");
    });
  };

  const onDeleteFaq = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    await faqService.deleteFaq(id);
    refreshGroups();
  };

  const onSubmitGroup = async (data: FaqGroupForm) => {
    try {
      if (editingGroup) {
        await faqService.updateGroup(editingGroup.id, data.title);
      } else {
        await faqService.createGroup(data.title);
      }
      resetGroup();
      setEditingGroup(null);
      refreshGroups();
    } catch (err) {
      console.error(err);
    }
  };

  const onEditGroup = (group: FaqGroup) => {
    setEditingGroup(group);
    LANGS.forEach((lang) => {
      setGroupValue(`title.${lang}`, group.title[lang] || "");
    });
  };

  const onDeleteGroup = async (id: string) => {
    if (!confirm(t("confirmDeleteGroup"))) return;
    await faqService.deleteGroup(id);
    refreshGroups();
  };

  return (
    <div className="p-6 space-y-8">
      {/* FAQ Group Form */}
      <div className="bg-[var(--color-bg)] p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          {editingGroup ? t("editGroup") : t("addGroup")}
        </h2>
        <form onSubmit={handleSubmitGroup(onSubmitGroup)} className="space-y-4">
          <LanguageTabs
            languages={LANGS}
            activeLang={activeLang}
            onChange={setActiveLang}
          />
          <div>
            <input
              type="text"
              {...registerGroup(`title.${activeLang}`)}
              className="text-input w-full"
              placeholder={t("groupTitle")}
            />
            {groupErrors.title?.[activeLang] && (
              <p className="text-red-500 text-sm mt-1">
                {groupErrors.title[activeLang]?.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded"
          >
            {editingGroup ? t("update") : t("create")}
          </button>
        </form>
      </div>

      {/* FAQ Form */}
      <div className="bg-[var(--color-bg)] p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          {editingFaq ? t("editFaq") : t("addFaq")}
        </h2>
        <form onSubmit={handleSubmit(onSubmitFaq)} className="space-y-4">
          <LanguageTabs
            languages={LANGS}
            activeLang={activeLang}
            onChange={setActiveLang}
          />
          <div>
            <select {...register("groupId")} className="text-input w-full">
              <option value="">{t("selectGroup")}</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title[activeLang] || Object.values(g.title)[0]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>{t("question")}</label>
            <input
              type="text"
              {...register(`question.${activeLang}`)}
              className="text-input w-full"
            />
          </div>
          <div>
            <label>{t("answer")}</label>
            <textarea
              {...register(`answer.${activeLang}`)}
              className="text-input w-full resize-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--color-accent)] text-white rounded"
          >
            {editingFaq ? t("update") : t("create")}
          </button>
        </form>
      </div>

      {/* FAQ Groups & FAQs List */}
      <div className="space-y-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-[var(--color-row-alt)] p-4 rounded-lg shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-[var(--color-primary)]">
                {group.title[activeLang] || Object.values(group.title)[0]}
              </h3>
              <div className="flex gap-2">
                <button onClick={() => onEditGroup(group)}>
                  <Edit2 size={18} />
                </button>
                <button onClick={() => onDeleteGroup(group.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {group.faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-[var(--color-bg)] p-2 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">
                      {faq.question[activeLang] ||
                        Object.values(faq.question)[0]}
                    </p>
                    <p className="text-[var(--color-text)] text-sm">
                      {faq.answer[activeLang] || Object.values(faq.answer)[0]}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onEditFaq(faq, group.id)}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDeleteFaq(faq.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {group.faqs.length === 0 && (
                <p className="text-gray-400 text-sm">{t("noFaqs")}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
