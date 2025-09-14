// components/ui/forms/Dropzone.tsx
"use client";

import React, { useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, Control } from "react-hook-form";
import { X } from "lucide-react";
import FormField from "./FormField";

interface DropzoneProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  multiple?: boolean;
  accept?: { [mime: string]: string[] };
}

type FieldValue = File | File[] | null | undefined;

function DropzoneInput({
  value,
  onChange,
  multiple = true,
  accept,
}: Readonly<{
  value: FieldValue;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (v: any) => void;
  multiple?: boolean;
  accept?: { [mime: string]: string[] };
}>) {
  const handleDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        const existing = Array.isArray(value) ? value : [];
        onChange([...existing, ...acceptedFiles]);
      } else {
        onChange(acceptedFiles[0] ?? null);
      }
    },
    [onChange, multiple, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple,
    accept: accept ?? {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "video/*": [".mp4", ".webm"],
    },
  });

  const filesArray = useMemo<File[]>(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  }, [value]);

  const previews = useMemo(
    () =>
      filesArray.map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
      })),
    [filesArray]
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const removeFile = (file: File) => {
    if (multiple) {
      const filtered = filesArray.filter(
        (f) =>
          !(
            f.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified
          )
      );
      onChange(filtered);
    } else {
      onChange(null);
    }
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition bg-[var(--color-bg)] ${
          isDragActive ? "border-[var(--color-primary)]" : ""
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-500">
          Drag & drop files here or click to select
        </p>
      </div>

      {previews.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {previews.map(({ file, url }) => {
            const key = `${file.name}-${file.size}-${file.lastModified}`;

            return (
              <div
                key={key}
                className="relative group w-24 h-24 rounded-md border overflow-hidden"
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={14} />
                </button>

                {file.type.startsWith("image") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : file.type.startsWith("video") ? (
                  <video
                    src={url}
                    className="w-full h-full object-cover"
                    controls
                    aria-label={file.name}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-xs text-gray-600 p-2">
                    {file.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Dropzone({
  control,
  name,
  label,
  error,
  multiple = true,
  accept,
}: Readonly<DropzoneProps>) {
  return (
    <FormField label={label} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DropzoneInput
            value={field.value as FieldValue}
            onChange={field.onChange}
            multiple={multiple}
            accept={accept}
          />
        )}
      />
    </FormField>
  );
}
