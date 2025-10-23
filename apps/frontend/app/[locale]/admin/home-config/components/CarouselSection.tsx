"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ArrowUpDown, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import CarouselItemForm, { CarouselFormData } from "./CarouselForm";
import {
  carouselClient,
  CarouselItem,
  CarouselItemPayload,
} from "@/services/carouselService";

interface Props {
  activeLang: string;
}

export default function CarouselSection({ activeLang }: Props) {
  const t = useTranslations("Dashboard.CarouselItems");
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

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
          header:
            typeof item.header === "string"
              ? JSON.parse(item.header)
              : item.header,
          buttonText:
            typeof item.buttonText === "string"
              ? JSON.parse(item.buttonText)
              : item.buttonText,
        }));

        setItems(parsed);
      } catch (err) {
        console.error("Failed to load carousel items", err);
        alert("Error loading carousel items");
      }
    })();
  }, []);

  const getImageUrl = (path?: string) => {
    if (!path) return undefined;
    if (path.startsWith("blob:") || path.startsWith("data:")) return path;
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
  };

  const handleCreate = async (data: CarouselFormData) => {
    const payload: CarouselItemPayload = {
      buttonText: data.buttonText,
      buttonLink: data.buttonLink,
      header: data.header,
      paragraph: data.paragraph,
      order: items.length,
      isActive: true,
      image: data.imageFile,
    };

    try {
      setLoading(true);
      const created = await carouselClient.create(payload);
      setItems((prev) => [...prev, created]);
      setAdding(false);
    } catch (err) {
      console.error("Failed to save carousel item", err);
      alert("Error saving carousel item");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: CarouselFormData) => {
    const payload: CarouselItemPayload = {
      buttonText: data.buttonText,
      buttonLink: data.buttonLink,
      header: data.header,
      paragraph: data.paragraph,
      order: items.find((i) => i.id === id)?.order || 0,
      isActive: true,
      image: data.imageFile,
    };

    try {
      setLoading(true);
      const updated = await carouselClient.update(id, payload);

      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
      );
    } catch (err) {
      console.error("Failed to update carousel item", err);
      alert("Error updating carousel item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
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

      {/* Existing Items */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="carousel">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
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
                    >
                      <CarouselItemForm
                        activeLang={activeLang}
                        index={index}
                        defaultValues={{
                          header: item.header,
                          paragraph: item.paragraph,
                          buttonLink: item.buttonLink,
                          buttonText: item.buttonText,
                        }}
                        initialPreview={getImageUrl(item.imageUrl)}
                        onSubmit={(data) => handleUpdate(item.id, data)}
                        onDelete={() => handleDelete(item.id)}
                        loading={loading}
                      />
                      <span className="cursor-grab flex justify-end">
                        <ArrowUpDown className="w-4 h-4" />
                      </span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add New Item */}
      {adding ? (
        <CarouselItemForm
          activeLang={activeLang}
          onSubmit={handleCreate}
          loading={loading}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-4 px-4 py-2 rounded bg-[var(--color-accent)] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {t("addItem")}
        </button>
      )}
    </section>
  );
}
