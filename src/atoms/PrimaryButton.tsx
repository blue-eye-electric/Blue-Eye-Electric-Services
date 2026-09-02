import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
};

export function PrimaryButton({
  children,
  icon,
  fullWidth = false,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={`
        inline-flex
        cursor-pointer
        items-center
        justify-center
        gap-4
        border
        border-primary
        bg-primary
        rounded-full
        px-6
        py-3
        text-lg
        font-bold
        tracking-[0.2px]
        text-white
        transition
        duration-200
        hover:-translate-y-0.5
        hover:bg-primary/80
        hover:border-primary
        disabled:cursor-auto
        disabled:bg-slate-500
        disabled:border-slate-500
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {children}

      {icon && <span className="text-lg leading-none">{icon}</span>}
    </button>
  );
}
