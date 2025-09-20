"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Trash2, ArrowUpDown } from "lucide-react";
import CoverImageInput from "@/components/common/DropzoneImage";
import { useTranslations } from "next-intl";
import {
  carouselClient,
  CarouselItem,
  CarouselItemPayload,
} from "@/services/carouselService";

interface Props {
  activeLang: string;
}
interface EditableCarouselItem extends Partial<CarouselItem> {
  imageFile?: File;
}

export default function CarouselSection({ activeLang }: Props) {
  const t = useTranslations("Dashboard.CarouselItems");
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [newItem, setNewItem] = useState<EditableCarouselItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await carouselClient.getAll();
        const parsed = data.map((item) => ({
          ...item,
          paragraph:
            typeof item.paragraph === "string"
              ? JSON.parse(item.paragraph)
              : item.paragraph,
        }));
        setItems(parsed);
      } catch (err) {
        console.error("Failed to load carousel items", err);
        alert("Error loading carousel items");
      }
    })();
  }, []);

  const getImageUrl = (path?: string) => {
    if (!path) return null;
    return path.startsWith("http")
      ? path
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
  };

  const addItem = () =>
    setNewItem({
      paragraph: {},
      order: items.length,
      isActive: true,
    });

  const saveItem = async () => {
    if (!newItem) return;
    const payload: CarouselItemPayload = {
      paragraph: newItem.paragraph || {},
      order: newItem.order || 0,
      isActive: newItem.isActive ?? true,
      image: newItem.imageFile,
    };

    try {
      setLoading(true);
      const created = await carouselClient.create(payload);
      setItems((prev) => [...prev, created]);
      setNewItem(null);
    } catch (err) {
      console.error("Failed to save carousel item", err);
      alert("Error saving carousel item");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await carouselClient.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Failed to delete carousel item", err);
      alert("Error deleting carousel item");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered.map((item, index) => ({ ...item, order: index })));
  };

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4">{t("carouselSection")}</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="carousel">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {items.map((item, index) => (
                <Draggable
                  key={String(item.id)}
                  draggableId={String(item.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-4 border rounded shadow-sm bg-[var(--color-bg)] flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center">
                        <strong>
                          {t("item")} #{index + 1}
                        </strong>
                        <div className="flex gap-2">
                          <button onClick={() => deleteItem(item.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                          <span className="cursor-grab">
                            <ArrowUpDown className="w-4 h-4" />
                          </span>
                        </div>
                      </div>

                      <label>{t("paragraph")}</label>
                      <textarea
                        value={item.paragraph[activeLang] || ""}
                        onChange={(e) =>
                          setItems((prev) =>
                            prev.map((ci) =>
                              ci.id === item.id
                                ? {
                                    ...ci,
                                    paragraph: {
                                      ...ci.paragraph,
                                      [activeLang]: e.target.value,
                                    },
                                  }
                                : ci
                            )
                          )
                        }
                        className="w-full border border-[var(--color-accent)] rounded p-2"
                      />

                      <label>{t("image")}</label>
                      <CoverImageInput
                        value={item.imageUrl}
                        preview={getImageUrl(item.imageUrl)}
                        onChange={(file) =>
                          setItems((prev) =>
                            prev.map((ci) =>
                              ci.id === item.id
                                ? {
                                    ...ci,
                                    imageFile: file,
                                    imageUrl: URL.createObjectURL(file),
                                  }
                                : ci
                            )
                          )
                        }
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {newItem ? (
        <div className="p-4 border rounded shadow-sm bg-[var(--color-bg)] mt-4 flex flex-col gap-2">
          <strong>{t("newItem")}</strong>
          <label>{t("paragraph")}</label>
          <textarea
            value={newItem.paragraph?.[activeLang] || ""}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                paragraph: {
                  ...newItem.paragraph,
                  [activeLang]: e.target.value,
                },
              })
            }
            className="w-full border border-[var(--color-accent)] rounded p-2"
          />
          <label>{t("image")}</label>
          <CoverImageInput
            value={newItem.imageUrl}
            preview={getImageUrl(newItem.imageUrl)}
            onChange={(file) =>
              setNewItem({
                ...newItem,
                imageFile: file,
                imageUrl: URL.createObjectURL(file),
              })
            }
          />
          <button
            onClick={saveItem}
            disabled={loading}
            className="px-4 py-2 rounded bg-[var(--color-primary)] text-white mt-2"
          >
            {loading ? "Saving..." : t("saveItem")}
          </button>
        </div>
      ) : (
        <button
          onClick={addItem}
          className="mt-4 px-4 py-2 rounded bg-[var(--color-accent)] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {t("addItem")}
        </button>
      )}
    </section>
  );
}
