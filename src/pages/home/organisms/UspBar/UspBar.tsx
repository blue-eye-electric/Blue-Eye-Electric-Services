type StatItemProps = {
  value: string;
  lines: string[];
};

const StatItem = ({ value, lines }: StatItemProps) => {
  return (
    <div className="flex items-center gap-3 border-b border-primary pb-3 md:border-b-0 md:pb-0">
      <strong className="text-5xl font-semibold text-primary">{value}</strong>

      <span className="text-sm leading-[1.3] text-muted font-display">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </span>
    </div>
  );
};

const UspBar = () => {
  return (
    <section className="min-h-25 pt-10">
      <div
        className="
        max-w-5xl 
        mx-auto
        flex
        md:flex-row
        md:items-center
        gap-2
        md: gap-6
        px-[5%]
        flex-col
        "
      >
        <div className="flex w-full flex-col gap-2 md:flex-row md:gap-6">
          <StatItem value="₹99" lines={["Inspection at Just ₹99"]} />

          <StatItem value="14" lines={["day service guarantee"]} />

          <StatItem value="2h" lines={["electrician response time"]} />
        </div>
        <div
          className="
        md:ml-auto
        text-xs
        tracking-[0.5px]
        text-muted
      "
        >
          <span className="mr-2 text-lg">✦</span>
          Lakhisarai & Expanding to Kankarbagh, Patna Soon
        </div>
      </div>
    </section>
  );
};
export default UspBar;
