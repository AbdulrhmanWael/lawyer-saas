"use client";

import React, { useMemo, useCallback } from "react";
import { Edit, Trash, ChevronUp, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export type Column<T> = {
  header: string;
  accessor: keyof T;
};

export type TableProps<T extends { id?: string | number }> = {
  columns: Column<T>[];
  data: T[];
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  sortable?: boolean;
};

export default function Table<T extends { id?: string | number }>({
  columns,
  data,
  limit,
  onEdit,
  onDelete,
  sortable = true,
}: Readonly<TableProps<T>>) {
  const t = useTranslations("Dashboard.Blogs.table");

  const [sortBy, setSortBy] = React.useState<keyof T | null>(null);
  const [page, setPage] = React.useState(1);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const handleSort = (accessor: keyof T) => {
    if (!sortable) return;
    if (sortBy === accessor) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(accessor);
      setSortOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortBy) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (valA == null) return 1;
      if (valB == null) return -1;
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortBy, sortOrder]);

  const paginatedData = useMemo(() => {
    if (!limit) return sortedData;
    const start = (page - 1) * limit;
    return sortedData.slice(start, start + limit);
  }, [sortedData, page, limit]);

  const getCellValue = useCallback(
    (item: T, accessor: keyof T): React.ReactNode => {
      const value = item[accessor];
      if (value == null) return "-";

      if (typeof value === "boolean") {
        return (
          <span
            className={`px-2 py-1 rounded text-sm font-semibold ${
              value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {value ? "True" : "False"}
          </span>
        );
      }

      if (typeof value === "object") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ("name" in value && typeof (value as any).name === "string") {
          return (value as { name: string }).name;
        }
        return JSON.stringify(value);
      }
      return String(value);
    },
    []
  );

  const totalPages = limit ? Math.ceil(data.length / limit) : 0;

  return (
    <div className="overflow-x-auto rounded-md shadow-md bg-[var(--color-bg)]">
      <table className="w-full text-start border-collapse">
        <thead className="bg-[var(--color-accent)]/15">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="px-4 py-2 text-sm font-bold text-[var(--color-primary)] cursor-pointer select-none"
                onClick={() => handleSort(col.accessor)}
              >
                <div className="flex items-center justify-between gap-1">
                  <span>{col.header}</span>
                  <span className="w-4 h-4 flex items-center justify-center">
                    {(() => {
                      let icon;
                      if (sortBy === col.accessor) {
                        icon =
                          sortOrder === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          );
                      } else {
                        icon = <ChevronUp className="w-4 h-4 opacity-0" />;
                      }
                      return icon;
                    })()}
                  </span>
                </div>
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 text-sm font-bold py-2">{t("actions")}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className="text-center py-4"
              >
                {t("noData")}
              </td>
            </tr>
          ) : (
            paginatedData.map((item, idx) => (
              <tr
                key={item.id ?? JSON.stringify(item)}
                className={`hover:bg-[var(--color-accent)]/5 ${
                  idx % 2 === 0 ? "bg-[var(--color-row-alt)]" : ""
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.accessor)}
                    className="px-4 py-2 text-sm border-t border-[var(--color-border)]"
                  >
                    {getCellValue(item, col.accessor)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="justify-center items-center px-4 py-2 flex gap-2 border-t border-[var(--color-border)]">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1 rounded hover:bg-[var(--color-accent)]/20"
                      >
                        <Edit className="w-4 h-4 text-[var(--color-primary)]" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1 rounded hover:bg-red-100"
                      >
                        <Trash className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {limit && totalPages > 1 && (
        <div className="flex justify-end gap-2 p-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded border hover:bg-[var(--color-accent)]/10 disabled:opacity-50"
          >
            {t("prev")}
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNumber = idx + 1;
            return (
              <button
                key={`page-${pageNumber}`}
                onClick={() => setPage(pageNumber)}
                className={`px-3 py-1 rounded border ${
                  page === pageNumber
                    ? "bg-[var(--color-primary)] text-white"
                    : "hover:bg-[var(--color-accent)]/10"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded border hover:bg-[var(--color-accent)]/10 disabled:opacity-50"
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
}
