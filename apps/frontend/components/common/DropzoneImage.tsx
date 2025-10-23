import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useCallback, useRef } from "react";

interface CoverImageInputProps {
  value?: File | string;
  onChange: (file: File) => void;
  preview?: string | null;
}

export default function CoverImageInput({
  onChange,
  preview,
}: Readonly<CoverImageInputProps>) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        onChange(acceptedFiles[0]);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    noClick: true,
  });

  const handleClick = () => {
    open();
  };

  return (
    <div
      {...getRootProps({
        onClick: handleClick,
      })}
      className={`border-[3px] h-[300px] flex justify-center items-center border-dashed rounded-md p-6 text-center cursor-pointer transition
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-[var(--color-primary)]"}
      `}
    >
      <input {...getInputProps()} ref={inputRef} />
      {preview ? (
        <div className="relative w-full h-[300px] pointer-events-none">
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
        <p className="font-bold text-l text-[var(--color-text)]">
          Drop an image here or click to upload
        </p>
      )}
    </div>
  );
}
