import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { SecondaryButton } from "../../../../../../atoms";

type ServiceCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  onBook: () => void;
};

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  onBook,
}: ServiceCardProps) => {
  return (
    <article
      className="
        flex
        min-h-[300px]
        flex-col
        bg-primary
        border
        border-primary
        text-on-primary
        hover:text-primary
        px-6
        pt-8
        pb-4
        rounded-2xl
        transition
        duration-200
        hover:-translate-y-1
        hover:bg-primary/10
        cursor-pointer
      "
      onClick={() => onBook()}
    >
      <Icon size={30} className="mb-3" />
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>

      <p className="max-w-sm leading-[1.55] mb-4">{description}</p>

      <SecondaryButton className="mt-auto w-fit bg-on-primary text-primary">
        Book this service
        <ArrowUpRight className="ml-2 h-6 w-6" />
      </SecondaryButton>
    </article>
  );
};

export default ServiceCard;
