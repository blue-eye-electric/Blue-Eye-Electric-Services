import { useEffect, useState } from "react";

// Icons
import type { LucideIcon } from "lucide-react";

interface BannerItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ServiceBannerCarouselProps {
  items: BannerItem[];
  autoPlayInterval?: number;
  onClick: () => void;
}

const ServiceBannerCarousel = ({
  items,
  autoPlayInterval = 3500,
  onClick,
}: ServiceBannerCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items.length) return null;

  const goTo = (index: number) => {
    setActiveIndex((index + items.length) % items.length);
  };

  //   const previous = () => {
  //     goTo(activeIndex - 1);
  //   };

  //   const next = () => {
  //     goTo(activeIndex + 1);
  //   };

  // Auto change
  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [items.length, autoPlayInterval]);

  return (
    <div className="w-full overflow-hidden">
      {/* Banners */}
      <div className="relative flex items-center justify-center">
        {/* Previous */}
        {/* <button
          type="button"
          onClick={previous}
          className="
            absolute left-0 z-10
            w-[82%] sm:w-[55%] lg:w-[42%]
            -translate-x-[82%] sm:-translate-x-[78%] lg:-translate-x-[75%]
            cursor-pointer
            opacity-70
            transition-opacity duration-300
            hover:opacity-100
          "
        >
          <BannerCard
            item={items[(activeIndex - 1 + items.length) % items.length]}
          />
        </button> */}

        {/* Active */}
        <div
          key={activeIndex}
          className="
            relative z-20
            w-[85%]
            animate-banner-in
          "
        >
          <BannerCard item={items[activeIndex]} onClick={onClick} />
        </div>

        {/* Next */}
        {/* <button
          type="button"
          onClick={next}
          className="
            absolute right-0 z-10
            w-[82%] sm:w-[55%] lg:w-[42%]
            translate-x-[82%] sm:translate-x-[78%] lg:translate-x-[75%]
            cursor-pointer
            opacity-70
            transition-opacity duration-300
            hover:opacity-100
          "
        >
          <BannerCard item={items[(activeIndex + 1) % items.length]} />
        </button> */}
      </div>

      {/* Dots */}
      <div className="mt-5 flex justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            className={`
              h-2 rounded-full
              transition-all duration-300
              ${activeIndex === index ? "w-6 bg-primary" : "w-2 bg-primary/10"}
            `}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const BannerCard = ({
  item,
  onClick,
}: {
  item: BannerItem;
  onClick: () => void;
}) => {
  const Icon = item.icon;

  return (
    <div
      onClick={onClick}
      className="
        flex min-h-[170px] items-center gap-5
        rounded-2xl
        px-6 py-6 text-primary
        shadow-lg
        sm:min-h-[200px] sm:px-8
        bg-primary/10
        cursor-pointer
      "
    >
      {/* Icon */}
      <div
        className="
          flex h-16 w-16 shrink-0
          items-center justify-center
          rounded-xl bg-primary/10
        "
      >
        <Icon size={32} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="text-left">
        <h3 className="text-lg font-bold sm:text-xl">{item.title}</h3>

        <p className="mt-2 text-sm leading-5 text-primary/75 sm:text-base">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default ServiceBannerCarousel;
