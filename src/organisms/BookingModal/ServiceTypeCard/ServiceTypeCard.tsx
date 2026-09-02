// Icons
import { CheckCircle2, ArrowRight } from "lucide-react";

// Components
import { PrimaryButton, SecondaryButton } from "../../../atoms";

interface ServiceTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  active?: boolean;
  onClick?: () => void;
}

const ServiceTypeCard = ({
  icon,
  title,
  description,
  features,
  buttonText,
  active = false,
  onClick,
}: ServiceTypeCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex flex-col
        rounded-2xl
        border
        p-6
        transition-all
        duration-200
        cursor-pointer
        ${active ? "border-primary bg-primary/5" : "border-gray-200 bg-white"}
      `}
    >
      {/* Icon */}
      <div className="flex justify-center">
        <div
          className={`
            flex h-20 w-20 items-center justify-center
            rounded-full
            border
            ${
              active
                ? "border-primary text-primary"
                : "border-gray-200 text-primary"
            }
          `}
        >
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 text-center">
        <h3
          className={`
            text-lg font-bold
            ${active ? "text-primary" : "text-inked"}
          `}
        >
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-inked">{description}</p>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-dashed border-gray-200" />

      {/* Features */}
      <div className="flex-1 space-y-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-3 text-left text-xs text-[#263B56]"
          >
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-blue-600" />

            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="w-full mt-4">
        {/* Button */}
        {active ? (
          <PrimaryButton
            fullWidth
            className="text-xs"
            icon={<ArrowRight size={22} />}
          >
            {buttonText}
          </PrimaryButton>
        ) : (
          <SecondaryButton fullWidth className="text-xs">
            {buttonText}
          </SecondaryButton>
        )}
      </div>
    </div>
  );
};

export default ServiceTypeCard;
