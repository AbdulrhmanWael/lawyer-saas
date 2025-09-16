"use client";

import { ChangeEvent, useRef } from "react";

interface AvatarInputProps {
  value?: File;
  preview?: string | null;
  onChange: (file: File | null) => void;
}

export default function AvatarInput({
  preview,
  onChange,
}: Readonly<AvatarInputProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center relative group"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="avatar preview"
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-gray-400 text-sm">No avatar</span>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition">
          Change
        </div>
      </button>

      {/* hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
