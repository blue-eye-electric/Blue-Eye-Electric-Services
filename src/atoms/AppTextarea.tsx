import type { TextareaHTMLAttributes } from "react";

type AppTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function AppTextarea({
  label,
  className = "",
  ...props
}: AppTextareaProps) {
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

      <textarea
        {...props}
        className={`
          min-h-20
          w-full
          resize-y
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          px-4
          py-3
          text-sm
          font-normal
          leading-6
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
