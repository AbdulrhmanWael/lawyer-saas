"use client";

import { forwardRef } from "react";
import { FieldError } from "react-hook-form";
import FormField from "./FormField";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: FieldError;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }, ref) => (
    <FormField label={label} error={error}>
      <input
        ref={ref}
        {...props}
        className="w-full px-3 py-2 border rounded-md
          border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)]
          focus:outline-none text-sm bg-[var(--color-bg)]"
      />
    </FormField>
  )
);

Input.displayName = "Input";
export default Input;
