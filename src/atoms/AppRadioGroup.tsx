import type { ChangeEvent } from "react";

type RadioOption = {
  value: string;
  label: string;
};

type AppRadioGroupProps = {
  label: string;
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function AppRadioGroup({
  label,
  name,
  value,
  options,
  onChange,
}: AppRadioGroupProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-ink">{label}</legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex
              cursor-pointer
              items-center
              gap-3
              rounded-xl
              border
              px-4
              py-3
              text-sm
              font-medium
              transition
              ${
                value === option.value
                  ? "border-primary bg-primary/5 text-ink"
                  : "border-slate-200 bg-slate-50 text-muted hover:border-primary hover:bg-white"
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="h-4 w-4 accent-primary"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
