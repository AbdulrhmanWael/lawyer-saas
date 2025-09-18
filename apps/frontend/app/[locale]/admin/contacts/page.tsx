"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MailOpen, MailIcon, Trash2 } from "lucide-react";
import { apiClient } from "@/utils/apiClient";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  details: string;
  read: boolean;
  createdAt: string;
};

export default function MessagesList() {
  const t = useTranslations("Dashboard.Contacts");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<ContactMessage[]>("/contact", { sort });
      setMessages(res);
    } catch (err) {
      console.error(err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => {
    fetchMessages();
  }, [sort, fetchMessages]);

  const markAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };

  const markAsUnread = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: false } : msg))
    );
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  if (loading) return <p className="text-gray-400">{t("loadingMessages")}</p>;
  if (!messages.length)
    return <p className="text-gray-400 text-center">{t("noMessages")}</p>;

  const unreadMessages = messages.filter((msg) => !msg.read);
  const readMessages = messages.filter((msg) => msg.read);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const MessageCard = ({
    msg,
    read,
  }: {
    msg: ContactMessage;
    read: boolean;
  }) => (
    <div
      key={msg.id}
      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
        read
          ? "bg-[var(--color-row-alt)] border-[var(--color-border)]"
          : "bg-[var(--color-accent)]/10 border-[var(--color-accent)]"
      }`}
      onClick={() => (read ? markAsUnread(msg.id) : markAsRead(msg.id))}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-[var(--color-primary)] font-semibold truncate">
            {msg.title}
          </h3>
          <p className="text-[var(--color-text)] text-sm truncate">
            {msg.name} &lt;{msg.email}&gt; {msg.phone && `| ${msg.phone}`}
          </p>
          <p className="text-[var(--color-text)] mt-1 line-clamp-2">
            {msg.details}
          </p>
          <p className="text-gray-400 text-xs mt-1 text-right">
            {formatDate(msg.createdAt)}
          </p>
        </div>
        <div className="flex flex-col gap-1 ml-4 items-end">
          <button
            className="p-1 text-[var(--color-accent)] hover:text-[var(--color-primary)]"
            onClick={(e) => {
              e.stopPropagation();
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              read ? markAsUnread(msg.id) : markAsRead(msg.id);
            }}
          >
            {read ? <MailOpen size={18} /> : <MailIcon size={18} />}
          </button>
          <button
            className="p-1 text-red-600 hover:text-red-800"
            onClick={(e) => {
              e.stopPropagation();
              deleteMessage(msg.id);
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-[var(--color-bg)] rounded-2xl shadow-lg flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-[var(--color-primary)]">
          {t("messages")}
        </h2>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "asc" | "desc")}
          className="p-1 border rounded"
        >
          <option value="desc">{t("sortDesc")}</option>
          <option value="asc">{t("sortAsc")}</option>
        </select>
      </div>

      {/* Unread Messages */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-accent)] mb-2">
          {t("unread")}
        </h3>
        {unreadMessages.length === 0 ? (
          <p className="text-gray-400">{t("noUnread")}</p>
        ) : (
          <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-[var(--color-accent)] scrollbar-track-[var(--color-bg)]">
            {unreadMessages.map((msg) => (
              <MessageCard key={msg.id} msg={msg} read={false} />
            ))}
          </div>
        )}
      </div>

      {/* Read Messages */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
          {t("read")}
        </h3>
        {readMessages.length === 0 ? (
          <p className="text-gray-400">{t("noRead")}</p>
        ) : (
          <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-[var(--color-accent)] scrollbar-track-[var(--color-bg)]">
            {readMessages.map((msg) => (
              <MessageCard key={msg.id} msg={msg} read={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
