import type { ReactNode } from "react";

type BookingFormFieldProps = {
  children: ReactNode;
  className?: string;
};

export function BookingFormField({
  children,
  className = "",
}: BookingFormFieldProps) {
  return (
    <div className={`flex flex-col gap-[15px] ${className}`}>{children}</div>
  );
}
