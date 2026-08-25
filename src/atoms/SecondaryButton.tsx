import type { AnchorHTMLAttributes, ReactNode } from "react";

type SecondaryButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  icon?: ReactNode;
};

export function SecondaryButton({
  children,
  icon,
  className = "",
  ...props
}: SecondaryButtonProps) {
  return (
    <a
      {...props}
      className={`
        inline-flex
        items-center
        gap-2
        border
        border-primary
        rounded-xl
        px-4
        py-2
        text-lg
        font-bold
        text-ink
        no-underline
        transition
        duration-200
        hover:-translate-y-0.5
        cursor-pointer
        ${className}
      `}
    >
      {icon && <span aria-hidden="true">{icon}</span>}

      {children}
    </a>
  );
}
