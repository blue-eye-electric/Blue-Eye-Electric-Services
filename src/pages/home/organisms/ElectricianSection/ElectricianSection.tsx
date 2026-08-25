import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../../../atoms";

const ElectricianSection = () => {
  const navigate = useNavigate();

  return (
    <section className="px-5 py-8 md:py-10">
      <div
        className="
          mx-auto
          flex
          max-w-5xl
          items-center
          justify-between
          gap-6
          rounded-2xl
          px-6
          py-5
          text-primary
          max-sm:flex-col
          max-sm:items-start
          md:px-8
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              hidden
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white/15
              sm:flex
            "
          >
            <BriefcaseBusiness className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-bold leading-tight md:text-xl">
              Electrician? Join Our Network!
            </h2>

            <p className="mt-1 text-sm leading-5 text-primary/80 md:text-[15px]">
              Register today and connect with customers looking for trusted
              electrical services.
            </p>
          </div>
        </div>

        <PrimaryButton onClick={() => navigate("/electrician")}>
          Register Now
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </PrimaryButton>
      </div>
    </section>
  );
};

export default ElectricianSection;
