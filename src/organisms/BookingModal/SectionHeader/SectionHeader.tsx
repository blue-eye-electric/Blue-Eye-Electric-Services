type SectionHeaderProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const SectionHeader = ({ icon, title, description }: SectionHeaderProps) => {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-primary/10
          text-primary
        "
      >
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-ink">{title}</h3>

        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
};

export default SectionHeader;
