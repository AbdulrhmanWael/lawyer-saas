type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
};

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--form-text)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
      />
      {label}
    </label>
  );
}
