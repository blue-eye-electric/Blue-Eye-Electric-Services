import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  pulse?: boolean;
  className?: string;
};

export function Eyebrow({
  children,
  pulse = false,
  className = "",
}: EyebrowProps) {
  return (
    <p
      className={`mb-6 text-sm font-bold uppercase tracking-[2.2px] text-muted ${className}`}
    >
      {pulse && (
        <span className="mr-2 inline-block h-[7px] w-[7px] rounded-full bg-success shadow-[0_0_0_4px_#dfe9cb]" />
      )}

      {children}
    </p>
  );
}
