"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FieldError } from "react-hook-form";
import FormField from "./FormField";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: FieldError;
};

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <FormField label={label} error={error}>
        <div className="relative">
          <input
            ref={ref}
            type={visible ? "text" : "password"}
            {...props}
            className="w-full px-3 py-2 border rounded-md 
              border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] 
              focus:outline-none text-sm bg-[var(--color-bg)]"
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </FormField>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
