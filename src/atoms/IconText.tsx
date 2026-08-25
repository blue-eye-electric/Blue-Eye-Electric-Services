import type { ReactNode } from "react";

type IconTextProps = {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
};

export function IconText({ icon, children, className = "" }: IconTextProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden="true">{icon}</span>

      {children}
    </span>
  );
}
