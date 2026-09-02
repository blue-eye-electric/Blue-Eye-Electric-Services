import { PrimaryButton } from "../../../../atoms";
import { Eyebrow } from "../../../../atoms/Eyebrow";
import { AccentText, SectionHeading } from "../../../../atoms/Typography";
import { services } from "../../../../constants/services";
import ServiceCard from "./organisms/ServiceCard";

type ServiceSectionProps = {
  onBook: (service?: string, inspection?: boolean) => void;
};

const ServiceSection = ({ onBook }: ServiceSectionProps) => {
  return (
    <section
      id="services"
      className="
        mx-auto
        min-h-dvh 
        max-w-5xl
        px-8
        py-30
        max-md:py-[85px]
      "
    >
      <div
        className="
        mb-8
        flex
        items-end
        justify-between
        max-md:block
      "
      >
        <div>
          <Eyebrow>Our services</Eyebrow>

          <SectionHeading>
            Electrical help,
            <br />
            <AccentText className="text-primary">right at home.</AccentText>
          </SectionHeading>
        </div>

        <p
          className="
          mb-1
          max-w-xs
          text-[13px]
          leading-[1.6]
          text-muted
          max-md:mt-[25px]
        "
        >
          Choose a service you recognise or select “Book inspection” when you
          need help identifying the right solution.
        </p>
      </div>

      <div
        className="
        grid
        grid-cols-3
        gap-[17px]
        max-md:grid-cols-1
      "
      >
        {services.map((service) => (
          <ServiceCard
            key={service.label}
            icon={service.icon}
            title={service.label}
            description={service.description}
            onBook={() => onBook(service.label)}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 px-7 py-6 ">
        <div>
          <p className="mb-1 text-3xl font-bold text-primary">
            Not sure what&apos;s wrong?
          </p>
          <p className="mt-2 text-lg text-ink/">
            Don't worry. Our electrician can inspect the problem and help
            identify the required work.
          </p>
          <p className="text-sm text-ink mt-2">
            Book a ₹99 inspection and let our electrician identify the problem.
          </p>
        </div>
        <PrimaryButton
          onClick={() => onBook(undefined, true)}
          className="text-nowrap"
        >
          Book inspection ↗
        </PrimaryButton>
      </div>
    </section>
  );
};

export default ServiceSection;
