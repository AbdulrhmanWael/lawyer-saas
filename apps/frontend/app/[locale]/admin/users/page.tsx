"use client";

import { useCallback, useEffect, useState } from "react";
import { getUsers, deleteUser, User } from "@/services/users";
import Table from "@/components/common/Table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import Modal from "@/components/common/Modal";

export default function UsersPage() {
  const t = useTranslations("Dashboard.Users");

  const [users, setUsers] = useState<User[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    const data = await getUsers();
    const filtered = debouncedSearch
      ? data.filter(
          (u) =>
            u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      : data;
    const formatted = filtered.map((u) => ({
      ...u,
      createdAt: new Date(u.createdAt)
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(",", " -"),
    }));

    setUsers(formatted);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, fetchUsers]);

  const confirmDelete = (id: string, name: string) => {
    setUser({ id, name });
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!user?.id) return;
    await deleteUser(user.id);
    fetchUsers();
    setDeleteModalOpen(false);
    setUser(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">
          {t("title")}
        </h1>
        <Link
          className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
          href="users/user"
        >
          {t("create")}
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full py-2 pl-9 pr-4 rounded-md border border-[var(--color-primary)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>

        <button
          onClick={() => fetchUsers()}
          className={`px-4 py-2 rounded-lg font-medium transition-colors bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90`}
        >
          {t("searchButton")}
        </button>
      </div>

      {/* Table */}
      <Table<User>
        columns={[
          { header: t("table.name"), accessor: "name" },
          { header: t("table.email"), accessor: "email" },
          { header: t("table.role"), accessor: "role" },
          { header: t("table.createdAt"), accessor: "createdAt" },
        ]}
        data={users}
        onEdit={(u) => router.push(`users/user/${u.id}`)}
        onDelete={(u) => confirmDelete(u.id, u.name)}
        limit={10}
      />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        title={`${t("deleteConfirm")}\n${user?.name}`}
        isConfirm={false}
        onClose={() => setDeleteModalOpen(false)}
        onSubmit={handleDelete}
      />
    </div>
  );
}
