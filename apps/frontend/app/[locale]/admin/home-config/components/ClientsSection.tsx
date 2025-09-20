"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, Edit } from "lucide-react";
import CoverImageInput from "@/components/common/DropzoneImage";
import { useTranslations } from "next-intl";
import { clientClient, Client, ClientPayload } from "@/services/clientService";


export default function ClientsSection() {
  const t = useTranslations("Dashboard.ClientsSection");
  const [clients, setClients] = useState<Client[]>([]);
  const [editing, setEditing] = useState<
    (Partial<Client> & { imageFile?: File }) | null
  >(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await clientClient.getAll();
        setClients(data);
      } catch (err) {
        console.error("Failed to load clients", err);
        alert("Error loading clients");
      }
    })();
  }, []);

  // Close form if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setEditing(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAdd = () => setEditing({ name: "", isActive: true });

  const handleSave = async () => {
    if (!editing) return;

    try {
      const payload: ClientPayload = {
        name: editing.name || "",
        isActive: editing.isActive ?? true,
        image: editing.imageFile,
      };

      if (editing.id) {
        const updated = await clientClient.update(editing.id, payload);
        setClients((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
      } else {
        const created = await clientClient.create(payload);
        setClients((prev) => [...prev, created]);
      }

      setEditing(null);
    } catch (err) {
      console.error("Failed to save client", err);
      alert("Error saving client");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;

    try {
      await clientClient.delete(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete client", err);
      alert("Error deleting client");
    }
  };

  const handleEditClick = (client: Client) => {
    // Toggle: close if same client clicked again
    if (editing?.id === client.id) {
      setEditing(null);
    } else {
      setEditing(client);
    }
  };

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4">{t("clientsSection")}</h2>

      {editing && (
        <div
          ref={formRef}
          className="p-4 border rounded bg-[var(--color-bg)] flex flex-col gap-2"
        >
          <label>{t("name")}</label>
          <input
            type="text"
            value={editing.name}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            className="w-full border border-[var(--color-accent)] rounded p-2"
          />

          <label>{t("image")}</label>
          <CoverImageInput
            value={editing.imageUrl}
            preview={
              editing.imageFile
                ? URL.createObjectURL(editing.imageFile)
                : editing.imageUrl
                  ? process.env.NEXT_PUBLIC_BACKEND_URL! + editing.imageUrl
                  : null
            }
            onChange={(file) => setEditing({ ...editing, imageFile: file })}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editing.isActive}
              onChange={(e) =>
                setEditing({ ...editing, isActive: e.target.checked })
              }
            />
            {t("isActive")}
          </label>

          <button
            onClick={handleSave}
            className="mt-2 px-4 py-2 rounded bg-[var(--color-primary)] text-white"
          >
            {t("submit")}
          </button>
        </div>
      )}

      {!editing && (
        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded bg-[var(--color-accent)] text-white flex items-center gap-2 mb-4"
        >
          + {t("addClient")}
        </button>
      )}

      <div className="space-y-2">
        {clients.map((c) => (
          <div
            key={c.id}
            className="p-2 border rounded flex justify-between items-center bg-[var(--color-bg)]"
          >
            <p className="font-semibold">{c.name}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEditClick(c)}>
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(c.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
