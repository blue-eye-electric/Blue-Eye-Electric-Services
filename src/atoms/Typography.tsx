import type { ReactNode } from "react";

type SectionHeadingProps = {
  children: ReactNode;
  className?: string;
};

export function SectionHeading({
  children,
  className = "",
}: SectionHeadingProps) {
  return (
    <h2
      className={`
        text-[clamp(38px,5vw,63px)]
        font-medium
        leading-[0.98]
        tracking-[-2.5px]
        text-ink
        ${className}
      `}
    >
      {children}
    </h2>
  );
}

export function AccentText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <em className={`font-display font-semibold ${className}`}>{children}</em>
  );
}
