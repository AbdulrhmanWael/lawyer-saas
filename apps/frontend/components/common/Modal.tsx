"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

type FieldType = "text" | "date" | "date-time";

type ModalProps = {
  isOpen: boolean;
  title?: string;
  fields?: FieldType[];
  labels?: string[];
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (values: Record<string, any>) => void;
  confirmText?: string;
  cancelText?: string;
  isConfirm?: boolean;
};

export default function Modal({
  isOpen,
  title,
  fields = [],
  labels = [],
  onClose,
  onSubmit,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isConfirm = false,
}: Readonly<ModalProps>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [values, setValues] = useState<Record<string, any>>({});

  const handleChange = (field: FieldType, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(values);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--color-bg)] rounded-md shadow-lg w-full max-w-md p-6 animate-scaleIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            {title}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-[var(--color-secondary)]" />
          </button>
        </div>

        {!isConfirm &&
          fields.map((field, idx) => (
            <div key={field} className="mb-3">
              <label className="block text-sm font-medium mb-1 capitalize text-[var(--color-primary)]">
                {labels[idx]}
              </label>
              {field === "text" && (
                <input
                  type="text"
                  value={values[field] || ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              )}
              {field === "date" && (
                <input
                  type="date"
                  value={values[field] || ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              )}
              {field === "date-time" && (
                <input
                  type="datetime-local"
                  value={values[field] || ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              )}
            </div>
          ))}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-[var(--color-accent)]/10"
          >
            {cancelText}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
          >
            {isConfirm ? confirmText : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
