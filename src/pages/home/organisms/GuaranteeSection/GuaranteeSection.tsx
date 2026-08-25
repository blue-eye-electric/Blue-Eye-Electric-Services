import { ShieldCheck } from "lucide-react";

const GuaranteeSection = () => {
  return (
    <section className="flex px-[6vw] py-16 min-h-dvh">
      <div className="mx-auto flex flex-col md:flex-row max-w-5xl items-center justify-between gap-10">
        <div className="flex-1 shrink-0 rounded-full border border-primary bg-primary p-10 md:p-20 text-on-primary">
          <ShieldCheck className="h-full w-full" />
        </div>
        <div className="flex-5">
          <p className="mb-3 text-xl font-bold uppercase tracking-[1.5px]">
            Our Guarantee
          </p>

          <h2 className="text-5xl font-bold text-primary md:text-7xl">
            14 Days Work Guarantee
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-muted text-xl md:text-3xl">
            We stand behind the electrical work performed through Blue Eye
            Electric Service.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
