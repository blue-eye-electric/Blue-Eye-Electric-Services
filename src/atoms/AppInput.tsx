import type { InputHTMLAttributes } from "react";

type AppInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function AppInput({ label, className = "", ...props }: AppInputProps) {
  return (
    <label
      className="
        flex
        flex-col
        gap-2
        text-sm
        font-semibold
        text-ink
      "
    >
      {label}

      <input
        {...props}
        className={`
          w-full
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          px-4
          py-3
          text-sm
          font-normal
          text-ink
          outline-none
          transition
          placeholder:text-slate-400
          focus:border-primary
          focus:bg-white
          focus:ring-2
          focus:ring-primary/10
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${className}
        `}
      />
    </label>
  );
}
