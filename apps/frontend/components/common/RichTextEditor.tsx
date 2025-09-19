"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";
import "@/styles/editor.css";
import { ImageDownIcon } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}
type level = 1 | 2 | 3 | 4 | 5 | 6;
export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: Readonly<RichTextEditorProps>) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
      }),
      TextStyle,
      Color,
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "Write something…" }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border border-[var(--color-primary)] p-2 bg-[var(--color-bg)] rounded-t-md">
        {/* Headings */}
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as level })
                .run()
            }
            className={`px-2 py-1 rounded ${
              editor.isActive("heading", { level })
                ? "bg-[var(--color-primary)]"
                : ""
            }`}
          >
            H{level}
          </button>
        ))}

        {/* Text styles */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded font-bold ${
            editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded italic ${
            editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded underline ${
            editor.isActive("underline") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
        >
          U
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded line-through ${
            editor.isActive("strike") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
        >
          S
        </button>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
        >
          1. List
        </button>

        {/* Blocks */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("blockquote") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
        >
          ❝
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 rounded font-mono ${
            editor.isActive("codeBlock") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
        >
          {"</>"}
        </button>
        <button
          type="button"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result as string;
                editor.chain().focus().setImage({ src: base64 }).run();
              };
              reader.readAsDataURL(file);
            };
            input.click();
          }}
          className="px-2 py-1 rounded"
        >
          <ImageDownIcon />
        </button>

        {/* Colors */}
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 p-0 border rounded cursor-pointer"
        />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="px-2 py-1 rounded"
        >
          ↺
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="px-2 py-1 rounded"
        >
          ↻
        </button>
      </div>

      {/* Editor */}
      <div className="border border-[var(--color-primary)] rounded-b-md bg-[var(--color-bg)]">
        <EditorContent
          editor={editor}
          className="tiptap px-3 py-2 min-h-[200px]"
        />
      </div>
    </div>
  );
}
