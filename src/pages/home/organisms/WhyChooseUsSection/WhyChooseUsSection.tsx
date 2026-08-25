import { Clock3, ShieldCheck, UserCheck, MessageCircle } from "lucide-react";

const benefits = [
  {
    icon: Clock3,
    title: "Quick Response",
    description: "Electrician service within 2 hours",
  },
  {
    icon: ShieldCheck,
    title: "14 Days Guarantee",
    description: "Extra confidence after service",
  },
  {
    icon: UserCheck,
    title: "Verified Electricians",
    description: "Professionals assigned through Blue Eye",
  },
  {
    icon: MessageCircle,
    title: "Easy Booking",
    description: "Book online or contact us directly",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section
      id="trust"
      className="flex justify-center items-center px-[6vw] py-20 md:py-24 min-h-dvh"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[1.5px] text-primary">
            Why Blue Eye
          </p>

          <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
            Why Choose Blue Eye?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="
                bg-background
                p-7
                transition
                duration-200
                hover:bg-light-green
              "
            >
              <Icon className="mb-5 h-10 w-10 text-primary" />

              <h3 className="mb-2 text-lg font-bold text-ink">{title}</h3>

              <p className="text-sm leading-relaxed text-muted">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
