import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useCallback } from "react";

interface CoverImageInputProps {
  value?: File | string;
  onChange: (file: File) => void;
  preview?: string | null;
}

export default function CoverImageInput({
  value,
  onChange,
  preview,
}: Readonly<CoverImageInputProps>) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        onChange(acceptedFiles[0]);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-[3px] h-[300px] flex justify-center items-center border-dashed rounded-md p-6 text-center cursor-pointer transition
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
      `}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative w-48 h-[300px] mx-auto">
          <Image
            src={
              typeof preview === "string"
                ? preview
                : URL.createObjectURL(preview)
            }
            alt="Cover preview"
            fill
            className="object-cover rounded"
          />
        </div>
      ) : (
        <p className="font-bold text-l text-[var(--color-text)]">Drop an image here or click to upload</p>
      )}
    </div>
  );
}
