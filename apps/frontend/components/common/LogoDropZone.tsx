"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

export default function LogoDropzone({
  onFileSelected,
  initialUrl,
}: Readonly<{
  onFileSelected: (file: File) => void;
  initialUrl?: string;
}>) {
  const [preview, setPreview] = useState(initialUrl || "");

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFileSelected(file);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    noClick: true,
  });

  return (
    <div
      {...getRootProps({
        onClick: () => open(),
      })}
      className={`border-2 min-h-[120px] border-dashed flex justify-center items-center rounded-lg p-6 text-center cursor-pointer transition ${
        isDragActive
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
          : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <Image
          src={preview}
          alt="Logo Preview"
          width={120}
          height={120}
          className="mx-auto rounded"
        />
      ) : (
        <p className="text-gray-500">Drag & drop or click to upload logo</p>
      )}
    </div>
  );
}
