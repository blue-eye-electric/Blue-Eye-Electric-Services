import type { SelectHTMLAttributes } from "react";

type AppSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export function AppSelect({
  label,
  children,
  className = "",
  ...props
}: AppSelectProps) {
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

      <select
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
          focus:border-primary
          focus:bg-white
          focus:ring-2
          focus:ring-primary/10
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${className}
        `}
      >
        {children}
      </select>
    </label>
  );
}
