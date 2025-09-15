"use client";

import { Controller } from "react-hook-form";

interface ToggleSwitchProps {
  name: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any; // from useForm
  onChangeExtra?: (val: boolean) => void; // optional hook for exclusivity
}

export default function ToggleSwitch({
  name,
  label,
  control,
  onChangeExtra,
}: Readonly<ToggleSwitchProps>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <button
          type="button"
          onClick={() => {
            const newValue = !field.value;
            field.onChange(newValue);
            if (onChangeExtra) onChangeExtra(newValue);
          }}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          {/* Switch */}
          <div
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 
              ${field.value ? "bg-[var(--color-primary)]" : "bg-gray-300 dark:bg-gray-700"}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200
                ${field.value ? "translate-x-6" : "translate-x-0"}`}
            />
          </div>
          {/* Label */}
          <span className="text-sm">{label}</span>
        </button>
      )}
    />
  );
}
