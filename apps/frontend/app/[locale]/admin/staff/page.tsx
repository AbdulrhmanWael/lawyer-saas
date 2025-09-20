// app/[locale]/admin/staff/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import StaffForm from "./components/staffForm";
import {
  StaffMember,
  StaffMemberPayload,
  staffClient,
} from "@/services/staffService";
import { StaffFormData } from "./components/staffSchema";
import { useTranslations, useLocale } from "next-intl";
import InfiniteCarousel from "@/components/common/InfiniteCarousel";

export default function StaffPage() {
  const t = useTranslations("Dashboard.Staff");
  const locale = useLocale().toUpperCase();

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [editing, setEditing] = useState<StaffMember | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await staffClient.getAll();
        const normalized = data.map((m) => ({
          ...m,
          bio: safeParseBio(m.bio),
        }));
        setStaff(normalized);
      } catch (err) {
        console.error("Failed to load staff", err);
      }
    })();
  }, []);

  const safeParseBio = (bio: unknown) => {
    try {
      if (typeof bio === "string") {
        bio = JSON.parse(bio);
        return typeof bio === "string" ? JSON.parse(bio) : bio;
      }
    } catch {
      return {};
    }
  };

  const toPayload = (data: StaffFormData): StaffMemberPayload => ({
    name: data.name,
    position: data.position,
    order: data.order ?? 0,
    practiceAreaId: data.practiceAreaId ?? null,
    bio: data.bio ?? {},
    imageFile: data.imageFile ?? null,
  });

  const handleCreate = async (data: StaffFormData) => {
    try {
      const payload = toPayload(data);
      const created = await staffClient.create(payload);
      setStaff((prev) => [...prev, created]);
    } catch (err) {
      console.error("Failed to create staff", err);
      alert(t("errorCreate") ?? "Failed to create staff");
    }
  };

  const handleUpdate = async (data: StaffFormData) => {
    if (!editing) return;
    try {
      const payload = toPayload(data);
      const updated = await staffClient.update(editing.id, payload);
      setStaff((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setEditing(null);
    } catch (err) {
      console.error("Failed to update staff", err);
      alert(t("errorUpdate") ?? "Failed to update staff");
    }
  };

  return (
    <div className="space-y-10">
      {/* Create Form */}
      <div className="border border-[var(--color-accent)] shadow-lg/10 p-6 rounded-xl">
        <h2 className="text-xl mb-6 font-semibold">{t("createTitle")}</h2>
        <StaffForm onSubmit={handleCreate} submitLabel={t("create")} />
      </div>

      {/* Staff Carousel */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t("staffList")}</h2>

        <InfiniteCarousel
          items={staff}
          getId={(m) => String(m.id)}
          onReorder={(reordered) => {
            setStaff(reordered.map((m, i) => ({ ...m, order: i })));
            staffClient.reorder(
              reordered.map((m, i) => ({ id: m.id, order: i }))
            );
          }}
          renderItem={(member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => setEditing(member)}
              className="cursor-pointer flex flex-col items-center p-2 bg-[var(--color-bg)] rounded shadow focus:outline-none focus:ring-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  member.imageUrl
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${member.imageUrl}`
                    : "/placeholder.png"
                }
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <p className="mt-2 font-medium">{member.name}</p>
              <p className="text-sm text-[var(--color-secondary)]">
                {member.position}
              </p>

              {/* practiceAreaTitle (localized) */}
              {member.practiceAreaTitle ? (
                <p className="text-sm text-[var(--color-secondary)]">
                  {member.practiceAreaTitle[locale] ??
                    member.practiceAreaTitle.EN ??
                    ""}
                </p>
              ) : null}
            </button>
          )}
        />
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="border border-[var(--color-accent)] shadow-lg/10 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">{t("editTitle")}</h2>
          <StaffForm
            defaultValues={{
              name: editing.name,
              position: editing.position,
              practiceAreaId: editing.practiceAreaId ?? null,
              order: editing.order,
              bio: editing.bio ?? {},
              imageFile: null,
              imageUrl: editing.imageUrl
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${editing.imageUrl}`
                : "/placeholder.png",
            }}
            onSubmit={handleUpdate}
            submitLabel={t("update")}
          />
        </div>
      )}
    </div>
  );
}
