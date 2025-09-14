"use client";

import { Controller } from "react-hook-form";
import FormField from "./FormField";

export default function Toggle({
  control,
  name,
  label,
  error,
}: Readonly<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}>) {
  return (
    <FormField label={label} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <button
            type="button"
            onClick={() => field.onChange(!field.value)}
            className={`w-12 h-6 rounded-full p-1 transition
              ${field.value ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow transform transition
                ${field.value ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
        )}
      />
    </FormField>
  );
}
