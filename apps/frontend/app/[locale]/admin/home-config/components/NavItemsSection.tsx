"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTranslations } from "next-intl";
import { Plus, ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";
import { navItemsClient, NavItem } from "@/services/navItems";
import { translateText } from "@/utils/translate";
import { LANGS } from "../../blogs/blog/components/BlogForm";

interface Props {
  activeLang: string;
}

export default function NavItemsSection({ activeLang }: Props) {
  const t = useTranslations("Dashboard.NavItemsSection");
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState<Omit<NavItem, "id">>({
    label: {},
    url: "",
    order: 0,
    parentId: null,
    visible: true,
  });

  useEffect(() => {
    async function fetchNavItems() {
      try {
        const items = await navItemsClient.getAll();
        setNavItems(items);
      } catch (err) {
        console.error("Failed to load nav items:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNavItems();
  }, []);

  const getChildren = (parentId: string | null) =>
    navItems
      .filter((n) => n.parentId === parentId)
      .sort((a, b) => a.order - b.order);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleChange = <K extends keyof NavItem>(
    id: string | null,
    field: K,
    value: NavItem[K]
  ) => {
    if (id) {
      setNavItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    } else {
      setNewItem((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleLabelChange = (id: string | null, value: string) => {
    if (id) {
      setNavItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, label: { ...item.label, [activeLang]: value } }
            : item
        )
      );
    } else {
      setNewItem((prev) => ({
        ...prev,
        label: { ...prev.label, [activeLang]: value },
      }));
    }
  };

  const handleSave = async (id?: string) => {
    try {
      if (id) {
        const item = navItems.find((n) => n.id === id);
        if (!item) return;
        await navItemsClient.update(id, item);
      } else {
        const created = await navItemsClient.create({
          ...newItem,
          order: getChildren(newItem.parentId).length,
        });
        setNavItems((prev) => [...prev, created]);
        setNewItem({
          label: {},
          url: "",
          order: 0,
          visible: true,
          parentId: null,
        });
        setAdding(false);
      }
    } catch (err) {
      console.error("Failed to save nav item:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await navItemsClient.delete(id);
      setNavItems((prev) =>
        prev.filter((n) => n.id !== id && n.parentId !== id)
      ); // remove children too
    } catch (err) {
      console.error("Failed to delete nav item:", err);
    }
  };

  const handleTranslate = async (id: string | null) => {
    setTranslating(true);
    try {
      const target = id ? navItems.find((n) => n.id === id) : newItem;
      if (!target) return;

      const sourceText = target.label[activeLang];
      if (!sourceText) return;

      for (const lang of LANGS.filter((l) => l !== activeLang)) {
        const translated = await translateText(
          sourceText,
          activeLang.toLowerCase(),
          lang.toLowerCase()
        );
        if (id) {
          setNavItems((prev) =>
            prev.map((n) =>
              n.id === id
                ? { ...n, label: { ...n.label, [lang]: translated } }
                : n
            )
          );
        } else {
          setNewItem((prev) => ({
            ...prev,
            label: { ...prev.label, [lang]: translated },
          }));
        }
      }
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setTranslating(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = async (result: any, parentId: string | null) => {
    if (!result.destination) return;
    const children = getChildren(parentId);
    const reordered = Array.from(children);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    setNavItems((prev) =>
      prev.map((item) => {
        const newOrder = reordered.findIndex((i) => i.id === item.id);
        return newOrder !== -1 ? { ...item, order: newOrder } : item;
      })
    );

    for (let i = 0; i < reordered.length; i++) {
      await navItemsClient.update(reordered[i].id, { order: i });
    }
  };

  const renderItems = (parentId: string | null, level = 0) => {
    const children = getChildren(parentId);
    if (children.length === 0) return null;

    return (
      <DragDropContext onDragEnd={(result) => handleDragEnd(result, parentId)}>
        <Droppable droppableId={`droppable-${parentId || "root"}`}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`pl-${level * 4} mt-${level+2}`}
            >
              {children.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="border border-[var(--color-accent)] rounded-lg p-3 mb-2 bg-[var(--color-bg)] shadow-sm"
                    >
                      <div className="flex gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span {...provided.dragHandleProps}>
                              <ArrowUpDown className="w-4 h-4 text-[var(--color-accent)] cursor-grab" />
                            </span>
                            {getChildren(item.id).length > 0 && (
                              <button
                                onClick={() => toggleExpand(item.id)}
                                className="text-[var(--color-primary)]"
                              >
                                {expandedIds.includes(item.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                            )}

                            {/* Label input */}
                            <input
                              key={`label-${item.id}-${activeLang}`}
                              type="text"
                              value={item.label[activeLang] || ""}
                              onChange={(e) =>
                                handleLabelChange(item.id, e.target.value)
                              }
                              className="border border-[var(--color-accent)] rounded p-1 text-sm"
                              placeholder={t("label")}
                            />
                            <input
                              type="text"
                              value={item.url}
                              onChange={(e) =>
                                handleChange(item.id, "url", e.target.value)
                              }
                              className="border border-[var(--color-accent)] rounded p-1 text-sm ml-6"
                              placeholder={t("url")}
                            />
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2">
                            <button
                              className="text-xs px-2 py-1 bg-[var(--color-primary)] text-white rounded"
                              onClick={() => handleSave(item.id)}
                            >
                              {t("save")}
                            </button>
                            <button
                              className="text-xs px-2 py-1 bg-[var(--color-accent)] text-white rounded"
                              onClick={() => handleTranslate(item.id)}
                              disabled={translating}
                            >
                              {translating ? t("translating") : t("translate")}
                            </button>
                            <button
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                              onClick={() => handleDelete(item.id)}
                            >
                              {t("delete")}
                            </button>
                            <button
                              className="text-xs px-2 py-1 bg-gray-500 text-white rounded"
                              onClick={() =>
                                setNewItem({
                                  label: {},
                                  url: "",
                                  order: getChildren(item.id).length,
                                  visible: true,
                                  parentId: item.id,
                                })
                              }
                            >
                              {t("addSubItem")}
                            </button>
                          </div>
                        </div>
                      </div>

                      {expandedIds.includes(item.id) &&
                        renderItems(item.id, level + 1)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  if (loading) return <p>{t("loading")}</p>;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4">{t("navItemsSection")}</h2>

      {renderItems(null)}

      {adding || newItem.parentId ? (
        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-semibold mb-3">
            {newItem.parentId ? t("addSubItem") : t("addNew")}
          </h3>
          <input
            key={`new-${activeLang}`}
            type="text"
            value={newItem.label[activeLang] || ""}
            onChange={(e) => handleLabelChange(null, e.target.value)}
            className="w-full border border-[var(--color-accent)] rounded p-2 mb-2"
            placeholder={t("label")}
          />
          <input
            type="text"
            value={newItem.url}
            onChange={(e) => handleChange(null, "url", e.target.value)}
            className="w-full border border-[var(--color-accent)] rounded p-2 mb-2"
            placeholder={t("url")}
          />

          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded"
              onClick={() => handleSave()}
            >
              {t("save")}
            </button>
            <button
              className="px-4 py-2 bg-[var(--color-accent)] text-white rounded"
              onClick={() => handleTranslate(null)}
            >
              {translating ? t("translating") : t("translate")}
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => {
                setNewItem({
                  label: {},
                  url: "",
                  order: 0,
                  visible: true,
                  parentId: null,
                });
                setAdding(false);
              }}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-4 px-4 py-2 bg-[var(--color-accent)] text-white rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {t("addNew")}
        </button>
      )}
    </section>
  );
}
