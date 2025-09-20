"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { useTranslations } from "next-intl";

type Permission = {
  id: string;
  name: string;
};

type Role = {
  id: string;
  name: string;
  permissions: Permission[];
};

function formatPermissionName(name: string) {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const permissionGroups: Record<string, string[]> = {
  Blog: [
    "view_blog",
    "create_blog",
    "update_blog",
    "delete_blog",
    "publish_blog",
    "unpublish_blog",
  ],
  "Carousel Items": [
    "view_carousel_item",
    "create_carousel_item",
    "update_carousel_item",
    "delete_carousel_item",
  ],
  Category: [
    "view_category",
    "create_category",
    "update_category",
    "delete_category",
  ],
  "Client Logos": [
    "view_client_logo",
    "create_client_logo",
    "update_client_logo",
    "delete_client_logo",
  ],
  "Contact Messages": [
    "view_contact_message",
    "delete_contact_message",
    "mark_contact_message_read",
  ],
  "FAQ": [
    "view_faq",
    "create_faq",
    "update_faq",
    "delete_faq",
    "view_faq_group",
    "create_faq_group",
    "update_faq_group",
    "delete_faq_group",
  ],
  Newsletter: [
    "subscribe_newsletter",
    "view_subscribers",
    "unsubscribe_newsletter",
    "send_newsletter",
    "update_newsletter_settings",
    "view_newsletter_settings",
  ],
  Page: ["view_page", "create_page", "update_page", "delete_page"],
  "Page Views": ["track_page_view", "view_traffic_summary", "stream_traffic"],
  Permissions: ["view_permission", "create_permission"],
  "Practice Areas": [
    "view_practice_area",
    "create_practice_area",
    "update_practice_area",
    "delete_practice_area",
  ],
  Role: ["view_role", "create_role", "update_role_permissions"],
  Search: ["search"],
  "Site Settings": ["view_site_settings", "update_site_settings"],
  "Staff Members": [
    "view_staff_member",
    "create_staff_member",
    "update_staff_member",
    "delete_staff_member",
    "reorder_staff_member",
  ],
  Testimonial: [
    "view_testimonial",
    "create_testimonial",
    "update_testimonial",
    "delete_testimonial",
  ],
  Users: [
    "view_user",
    "create_user",
    "update_user",
    "delete_user",
    "update_password",
  ],
  "Why Us": ["view_why_us", "create_why_us", "update_why_us", "delete_why_us"],
};

export default function RolesPage() {
  const t = useTranslations("Dashboard.Roles");
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [rolesRes, permsRes] = await Promise.all([
          apiClient.get<Role[]>("/roles"),
          apiClient.get<Permission[]>("/permissions"),
        ]);
        setRoles(rolesRes);
        setPermissions(permsRes);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleCreateRole() {
    if (!newRoleName.trim()) return;
    const role = await apiClient.post<Role>("/roles", {
      name: newRoleName,
      permissionIds: selectedPermissions,
    });
    setRoles((prev) => [...prev, role]);
    setNewRoleName("");
    setSelectedPermissions([]);
  }

  async function handleUpdatePermissions(role: Role) {
    const updated = await apiClient.patch<Role>(
      `/roles/${role.id}/permissions`,
      { permissionIds: selectedPermissions }
    );
    setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditingRole(null);
    setSelectedPermissions([]);
  }

  if (loading) {
    return <div className="p-6 text-[var(--color-text)]">{t("loading")}</div>;
  }

  function renderPermissionGroups() {
    return Object.entries(permissionGroups).map(([groupName, permNames]) => {
      const groupPerms = permissions.filter((p) => permNames.includes(p.name));

      if (groupPerms.length === 0) return null;

      return (
        <div key={groupName} className="border rounded-xl p-4 my-4 border-[var(--color-accent)]">
          <h3 className="font-bold text-[var(--color-primary)] mb-2">{groupName}</h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {groupPerms.map((perm) => (
              <label key={perm.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(perm.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPermissions((prev) => [...prev, perm.id]);
                    } else {
                      setSelectedPermissions((prev) =>
                        prev.filter((id) => id !== perm.id)
                      );
                    }
                  }}
                />
                <span>{formatPermissionName(perm.name)}</span>
              </label>
            ))}
          </div>
        </div>
      );
    });
  }

  return (
    <div className="p-6 bg-[var(--color-bg)] text-[var(--color-text)]">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      {/* Create new role */}
      <div className="border p-4 rounded-lg mb-6 bg-[var(--form-bg)]">
        <h2 className="text-lg font-semibold mb-2">{t("createRole")}</h2>
        <input
          type="text"
          placeholder={t("roleName")}
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          className="w-full p-2 border rounded mb-3 bg-[var(--form-bg)] text-[var(--form-text)] border-[var(--form-border)] focus:border-[var(--form-border-focus)]"
        />

        <div className="space-y-4 max-h-60 overflow-y-auto">
          {renderPermissionGroups()}
        </div>

        <button
          onClick={handleCreateRole}
          className="px-4 py-2 rounded bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)]"
        >
          {t("save")}
        </button>
      </div>

      {/* Existing roles */}
      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="border p-4 rounded-lg bg-[var(--form-bg)]"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{role.name}</h2>
              <button
                onClick={() => {
                  setEditingRole(role);
                  setSelectedPermissions(role.permissions.map((p) => p.id));
                }}
                className="text-sm px-3 py-1 rounded bg-[var(--color-accent)] text-white hover:bg-[var(--color-primary)]"
              >
                {t("editPermissions")}
              </button>
            </div>
            <p className="text-sm mt-2">
              {t("assignedPermissions")}:{" "}
              {role.permissions
                .map((p) => formatPermissionName(p.name))
                .join(", ") || "-"}
            </p>

            {editingRole?.id === role.id && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">
                  {t("availablePermissions")}
                </h3>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {renderPermissionGroups()}
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleUpdatePermissions(role)}
                    className="px-4 py-2 rounded bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)]"
                  >
                    {t("update")}
                  </button>
                  <button
                    onClick={() => {
                      setEditingRole(null);
                      setSelectedPermissions([]);
                    }}
                    className="px-4 py-2 rounded bg-gray-300 text-black hover:bg-gray-400"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
