type StepItemProps = {
  number: string;
  title: string;
  description: string;
};

export function StepItem({ number, title, description }: StepItemProps) {
  return (
    <div
      className="
      flex
      gap-4
      border-t
      border-[#c9cbbd]
      py-[22px]
    "
    >
      <span className="text-xl text-primary">{number}</span>

      <p className="text-sm leading-[1.6] text-muted">
        <b className="text-lg text-ink">{title}</b>

        <br />

        {description}
      </p>
    </div>
  );
}
