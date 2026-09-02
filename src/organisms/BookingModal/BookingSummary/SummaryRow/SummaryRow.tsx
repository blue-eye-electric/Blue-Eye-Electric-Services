type SummaryRowProps = {
  label: string;
  value: string;
  last?: boolean;
};

const SummaryRow = ({ label, value, last = false }: SummaryRowProps) => {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-4
        py-3
        ${!last ? "border-b border-slate-100" : ""}
      `}
    >
      <span className="text-xs text-muted">{label}</span>

      <span className="max-w-[60%] text-right text-xs font-semibold text-ink">
        {value}
      </span>
    </div>
  );
};

export default SummaryRow;
