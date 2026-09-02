import serviceBanners from "../../../../constants/serviceBanners";
import ServiceBannerCarousel from "../../../../organisms/ServiceBannerCarousel";

type PromotionBannerSectionProps = {
  onBook: () => void;
};

const PromotionBannerSection = ({ onBook }: PromotionBannerSectionProps) => {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-4">
        <ServiceBannerCarousel items={serviceBanners} onClick={onBook} />
      </div>
    </section>
  );
};

export default PromotionBannerSection;
