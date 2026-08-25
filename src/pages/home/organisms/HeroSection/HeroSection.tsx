import { ArrowRight, Check, Clock3, ShieldCheck, Users } from "lucide-react";

import { PrimaryButton } from "../../../../atoms/PrimaryButton";
import { AccentText } from "../../../../atoms/Typography";
import heroBg from "../../../../assets/hero-bg.png";
import heroElectricianImg from "../../../../assets/electrician.png";

type HeroSectionProps = {
  onBook: () => void;
};

const HeroSection = ({ onBook }: HeroSectionProps) => {
  return (
    <section
      id="hero"
      className="relative flex flex-col justify-center items-center pt-25 md:pt-25"
    >
      <div className="absolute inset-y-0 right-0 overflow-hidden">
        <img
          src={heroBg}
          alt=""
          className="h-full w-full object-cover object-center"
        />

        {/* Fade image into white */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
      </div>
      <div
        className="
        flex
        flex-row
        items-center
        justify-center
        mx-auto
        max-w-5xl
        overflow-hidden
        z-[10]
        "
      >
        {/* LEFT CONTENT */}
        <div
          className="
            flex
            flex-col
            flex-1
            justify-center
            px-4
            pt-16
            md:px-3
            max-md:px-5
          "
        >
          {/* Heading */}
          <h1
            className="
              max-w-2xl
              text-[clamp(38px,5vw,68px)]
              font-bold
              leading-[1.03]
              tracking-[-2px]
              text-ink
              max-md:text-3xl
              max-md:tracking-[-1.5px]
            "
          >
            Fast & Reliable{" "}
            <AccentText className="text-primary font-display">
              Electrician
            </AccentText>{" "}
            Services
          </h1>

          {/* Description */}
          <p
            className="
              mt-6
              max-w-lg
              text-sm
              md:text-xl
              leading-7
              text-slate-600
              max-md:mt-4
              max-md:leading-5
            "
          >
            Expert electricians at your doorstep. Safe service, transparent
            pricing and 100% customer satisfaction.
          </p>

          {/* Benefits */}
          <div
            className="
              mt-7
              flex
              flex-col
              gap-4
              max-md:mt-5
              max-md:gap-3
            "
          >
            {/* Benefit 1 */}
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-primary
                  text-white
                
                "
              >
                <Clock3 className="h-5 w-5 max-md:h-4 max-md:w-4" />
              </div>

              <span
                className="
                  text-xs
                  md:text-md
                  font-semibold
                  text-slate-800
                "
              >
                Service within 2 Hours
              </span>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-primary
                  text-white
          
                "
              >
                <ShieldCheck className="h-5 w-5 max-md:h-4 max-md:w-4" />
              </div>

              <span
                className="
                  text-xs
                  md:text-md
                  font-semibold
                  text-slate-800
                "
              >
                14 Days Work Guarantee
              </span>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-primary
                  text-white
                
                "
              >
                <Users className="h-5 w-5 max-md:h-4 max-md:w-4" />
              </div>

              <span
                className="
                  text-xs
                  md:text-md
                  font-semibold
                  text-slate-800
                "
              >
                Verified & Experienced Experts
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="hidden md:block mt-8 max-md:mt-6">
            <PrimaryButton
              onClick={() => onBook()}
              icon={
                <ArrowRight className="h-10 w-10 bg-white rounded-full text-primary p-2" />
              }
            >
              Book a Service
            </PrimaryButton>
          </div>

          {/* Trust */}
          <div
            className="
              mt-4
              hidden md:flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-success
              max-md:mt-3
              max-md:text-sm
            "
          >
            <span
              className="
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                max-md:h-4
                max-md:w-4
              "
            >
              <Check className="h-3.5 w-3.5 max-md:h-3 max-md:w-3" />
            </span>
            Trusted by 500+ Happy Customers
          </div>
        </div>

        {/* RIGHT ELECTRICIAN IMAGE */}
        <div
          className="
          flex
          flex-1
          items-end
          justify-center
          "
        >
          <img
            src={heroElectricianImg}
            alt="Professional Blue Eye electrician"
            className="
              flex-1
              md:h-full
              
              w-auto
              object-contain
              object-bottom
              md:h-[88%]
            "
          />
        </div>
      </div>
      <div className="md:hidden w-full p-4 z-[10]">
        <PrimaryButton
          onClick={() => onBook()}
          fullWidth
          className=""
          icon={
            <ArrowRight className=" h-10 w-10 bg-white rounded-full text-primary p-2" />
          }
        >
          Book a Service
        </PrimaryButton>
      </div>
      {/* Trust */}
      <div
        className="
              flex
              md:hidden
              items-center
              gap-2
              text-sm
              font-semibold
              text-success
              max-md:mt-3
              max-md:text-sm
              z-[10]
              pb-10
            "
      >
        <span
          className="
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
              "
        >
          <Check className="h-3.5 w-3.5 " />
        </span>
        Trusted by 500+ Happy Customers
      </div>
    </section>
  );
};

export default HeroSection;
