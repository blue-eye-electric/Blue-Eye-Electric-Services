import { MessageCircle, ArrowUpRight } from "lucide-react";

import { PrimaryButton, SecondaryButton } from "../../../../atoms";

type CtaSectionProps = {
  onBook: () => void;
};

const CTASection = ({ onBook }: CtaSectionProps) => {
  return (
    <section className="bg-primary/70 px-[6vw] py-20 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[1.5px] text-disabled">
              Blue Eye Electric Service
            </p>

            <h2 className="font-display text-4xl font-semibold leading-tight text-on-primary md:text-5xl">
              Need an Electrician?
            </h2>

            <p className="mt-4 text-on-primary">
              Reliable electrical service for homes and businesses in Lakhisarai
              & Kankarbagh.
            </p>

            <div className="mt-7 space-y-1 text-on-primary">
              <p>Service Area: Lakhisarai & Kankarbagh</p>
              <p>Operating Hours: 8:00 AM - 8:00 PM</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <PrimaryButton
              onClick={() => onBook()}
              // className="bg-secondary border-secondary hover:bg-on-primary hover:border-on-primary"
            >
              Book a Service
              <ArrowUpRight className="h-4 w-4" />
            </PrimaryButton>

            <SecondaryButton
              onClick={() => {
                window.open("https://wa.me/916202372739", "_blank");
              }}
              icon={<MessageCircle className="h-4 w-4" />}
              className="border-on-primary text-on-primary hover:bg-on-primary hover:text-ink"
            >
              WhatsApp Us
            </SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
