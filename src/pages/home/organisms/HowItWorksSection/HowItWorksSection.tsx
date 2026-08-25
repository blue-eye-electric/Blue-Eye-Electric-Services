import { Eyebrow } from "../../../../atoms/Eyebrow";
import { AccentText } from "../../../../atoms/Typography";
import { StepItem } from "./molecules/StepItem";

const HowItWorksSection = () => {
  return (
    <section
      id="how"
      className="
        bg-primary/10
        px-[9vw]
        py-16
        min-h-dvh 
        max-md:px-[7vw]
        max-md:py-20
      "
    >
      <div className="flex flex-col justify-content mx-auto max-w-5xl">
        <Eyebrow>How Blue Eye Works</Eyebrow>

        <h2
          className="
            mt-4
            max-w-[700px]
            text-[clamp(38px,5vw,63px)]
            font-medium
            leading-[0.98]
            tracking-[-2.5px]
            text-ink
          "
        >
          Simple booking.
          <br />
          <AccentText className="text-primary">Reliable service.</AccentText>
        </h2>

        <div className="mt-[60px]">
          <StepItem
            number="01"
            title="Book a Service"
            description="Tell us what electrical help you need."
          />

          <StepItem
            number="02"
            title="We Receive Your Request"
            description="Your request reaches the Blue Eye team."
          />

          <StepItem
            number="03"
            title="Electrician Assigned"
            description="Our admin assigns an available electrician."
          />

          <StepItem
            number="04"
            title="Electrician Connects With You"
            description="The electrician contacts you and visits your location."
          />

          <StepItem
            number="05"
            title="Work Completed"
            description="Electrical work is completed and covered by our 14 Days Work Guarantee."
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
