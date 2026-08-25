type TrustItemProps = {
  icon: string;
  title: string;
  description: string;
};

export function TrustItem({ icon, title, description }: TrustItemProps) {
  return (
    <div
      className="
      flex
      gap-[23px]
      border-t
      border-[#567063]
      py-[25px]
    "
    >
      <span className="text-[22px] text-lime">{icon}</span>

      <p className="text-xs leading-[1.6] text-[#bbcbc1]">
        <b className="text-[14px] text-white">{title}</b>

        <br />

        {description}
      </p>
    </div>
  );
}
