// import { PrimaryButton } from "../../../../atoms/PrimaryButton";

type CtaSectionProps = {
  onBook: () => void;
};

// const CtaSection = ({ onBook }: CtaSectionProps) => {
//   return (
//     <section
//       className="
//         flex
//         items-center
//         justify-between
//         gap-10
//         bg-primary
//         px-[6vw]
//         py-20
//         max-md:block
//         max-md:py-[65px]
//       "
//     >
//       <div>
//         <Eyebrow className="text-on-primary">Blue Eye Electric Service</Eyebrow>

//         <h2
//           className="
//             mt-3
//             text-[clamp(38px,5vw,63px)]
//             font-medium
//             leading-[0.98]
//             tracking-[-2.5px]
//             text-on-primary
//           "
//         >
//           Need an electrician?
//           <br />
//           <AccentText>We’re ready to help.</AccentText>
//         </h2>

//         <div
//           className="
//             mt-6
//             space-y-1
//             text-sm
//             text-on-primary/80
//           "
//         >
//           <p>Service Area: Lakhisarai</p>
//           <p>Operating Hours: 8:00 AM – 8:00 PM</p>
//         </div>
//       </div>

//       <div className="flex flex-col gap-3 max-md:mt-[35px] max-sm:flex-col">
//         <PrimaryButton
//           className="
//             bg-secondary
//             border-secondary
//             text-ink
//             hover:bg-on-primary
//             hover:border-on-primary
//           "
//           icon="→"
//           onClick={onBook}
//         >
//           Book a service
//         </PrimaryButton>

//         <a
//           href="tel:+916202372739"
//           className="
//             inline-flex
//             items-center
//             justify-center
//             rounded-xl
//             border
//             border-on-primary
//             px-5
//             py-4
//             text-xs
//             font-bold
//             text-on-primary
//             no-underline
//             transition
//             duration-200
//             hover:bg-on-primary
//             hover:text-ink
//           "
//         >
//           Call Us
//         </a>

//         <a
//           href="https://wa.me/916202372739"
//           target="_blank"
//           rel="noreferrer"
//           className="
//             inline-flex
//             items-center
//             justify-center
//             rounded-xl
//             border
//             border-on-primary
//             px-5
//             py-4
//             text-xs
//             font-bold
//             text-on-primary
//             no-underline
//             transition
//             duration-200
//             hover:bg-on-primary
//             hover:text-ink
//           "
//         >
//           WhatsApp Us
//         </a>
//       </div>
//     </section>
//   );
// };

// export default CtaSection;

import { MessageCircle, ArrowUpRight } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "../../../../atoms";

const CTASection = ({ onBook }: CtaSectionProps) => {
  return (
    <section className="bg-muted px-[6vw] py-20 md:py-24">
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
              Reliable electrical service for homes and businesses in
              Lakhisarai.
            </p>

            <div className="mt-7 space-y-1 text-on-primary">
              <p>Service Area: Lakhisarai</p>
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
