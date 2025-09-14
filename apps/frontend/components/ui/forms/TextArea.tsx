"use client";

import { forwardRef } from "react";
import { FieldError } from "react-hook-form";
import FormField from "./FormField";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: FieldError;
};

const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, error, ...props }, ref) => (
    <FormField label={label} error={error}>
      <textarea
        ref={ref}
        {...props}
        className="w-full px-3 py-2 border rounded-md
          border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)]
          focus:outline-none text-sm bg-[var(--color-bg)]"
      />
    </FormField>
  )
);

TextArea.displayName = "TextArea";
export default TextArea;
