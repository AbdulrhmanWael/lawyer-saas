"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Category } from "@/services/categories";
interface CategorySelectProps {
  categories: Category[];
  activeLang: string;
  value?: string;
  onChange: (id: string) => void;
  onAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
  placeholder?: string;
  t: (key: string) => string;
}

export default function CategorySelect({
  categories,
  activeLang,
  value,
  onChange,
  onAddCategory,
  onDeleteCategory,
  placeholder,
  t,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);

  const selectedCategory = categories.find((c) => c.id === value);

  return (
    <div className="relative w-full">
      {/* Field */}
      <button
        type="button"
        className="w-full border rounded px-3 py-2 flex justify-between items-center cursor-pointer bg-[var(--color-bg)]"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="truncate">
          {selectedCategory
            ? (selectedCategory.name[activeLang] ?? selectedCategory.name.EN)
            : (placeholder ?? t("selectCategory"))}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 mt-1 w-full border rounded bg-[var(--color-bg)] shadow-md max-h-60 overflow-auto">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex w-full justify-between items-center px-3 py-2 hover:bg-[var(--color-accent)]/10 cursor-pointer"
              onClick={() => {
                onChange(cat.id);
                setOpen(false);
              }}
            >
              <span>{cat.name[activeLang] ?? cat.name.EN}</span>
              <button
                type="button"
                className="text-red-500 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCategory(cat.id);
                }}
              >
                {t("delete")}
              </button>
            </div>
          ))}
          <button
            className="px-3 py-2 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => {
              setOpen(false);
              onAddCategory();
            }}
          >
            + {t("addCategory")}
          </button>
        </div>
      )}
    </div>
  );
}
