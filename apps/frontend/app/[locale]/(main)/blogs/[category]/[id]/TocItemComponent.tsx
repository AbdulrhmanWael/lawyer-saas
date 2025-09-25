import { useState } from "react";
import { TocItem } from "./page";

export function TocList({ items }: { items: TocItem[] }) {
  return (
    <ul className="space-y-1 text-sm">
      {items.map((item) => (
        <TocItemComponent key={item.id} item={item} />
      ))}
    </ul>
  );
}
function TocItemComponent({ item }: { item: TocItem }) {
  const [open, setOpen] = useState(true);

  return (
    <li className="leading-snug mb-3">
      <button
        type="button"
        className="flex items-center cursor-pointer"
        onClick={() => item.children && setOpen(!open)}
        style={{ marginLeft: `${(item.level - 1) * 16}px` }}
      >
        {item.children && (
          <span className="mr-2 text-xs text-gray-500">{open ? "▾" : "▸"}</span>
        )}
        <a
          href={`#${item.id}`}
          className="text-[var(--color-primary)] hover:underline"
        >
          {item.number} {item.text}
        </a>
      </button>

      {item.children && open && <TocList items={item.children} />}
    </li>
  );
}
