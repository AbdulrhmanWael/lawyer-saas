"use client";

import { ReactNode } from "react";
import { FieldError } from "react-hook-form";

export default function FormField({
  label,
  children,
  error,
}: {
  readonly label: string;
  readonly children: ReactNode;
  readonly error?: FieldError;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 text-[var(--color-secondary)]">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}
