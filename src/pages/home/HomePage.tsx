import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { BookingMode } from "../../types/booking";

// Components
import Navbar from "../../organisms/Navbar";
import HeroSection from "./organisms/HeroSection";
import UspBar from "./organisms/UspBar";
import PromotionBannerSection from "./organisms/PromotionBannerSection";

const BookingModal = lazy(() => import("../../organisms/BookingModal"));
const ServiceSection = lazy(() => import("./organisms/ServiceSection"));
const GuaranteeSection = lazy(() => import("./organisms/GuaranteeSection"));
const HowItWorksSection = lazy(() => import("./organisms/HowItWorksSection"));
const WhyChooseUsSection = lazy(() => import("./organisms/WhyChooseUsSection"));
const ElectricianSection = lazy(
  () => import("./organisms/ElectricianSection/ElectricianSection"),
);
const CtaSection = lazy(() => import("./organisms/CtaSection"));
const ReferralSection = lazy(() => import("./organisms/ReferralSection"));

type DeferredSectionProps = {
  children: ReactNode;
  minHeight?: string;
};

function DeferredSection({
  children,
  minHeight = "min-h-48",
}: DeferredSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(
    () => !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (shouldRender) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: "700px 0px" },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={sectionRef} className={!shouldRender ? minHeight : undefined}>
      {shouldRender ? (
        <Suspense fallback={<div className={minHeight} aria-hidden="true" />}>
          {children}
        </Suspense>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentBookingService, setCurrentBookingService] = useState("");
  const [isInspectionBooking, setIsInspectionBooking] = useState(false);
  const [currentBookingType, setCurrentBookingType] =
    useState<BookingMode>("electrician");

  const openBooking = (
    service?: string,
    inspection = false,
    bookingType: BookingMode = "electrician",
  ) => {
    setCurrentBookingService(service || "");
    setIsInspectionBooking(inspection);
    setCurrentBookingType(bookingType);
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-ink">
      <Navbar />

      <main>
        <HeroSection onBook={openBooking} />
        <PromotionBannerSection onBook={openBooking} />
        <UspBar />
        <DeferredSection minHeight="min-h-dvh">
          <ServiceSection onBook={openBooking} />
        </DeferredSection>
        <DeferredSection minHeight="min-h-dvh">
          <GuaranteeSection />
        </DeferredSection>
        <DeferredSection minHeight="min-h-dvh">
          <HowItWorksSection />
        </DeferredSection>
        <DeferredSection minHeight="min-h-dvh">
          <WhyChooseUsSection />
        </DeferredSection>
        <DeferredSection>
          <ElectricianSection />
        </DeferredSection>

        <DeferredSection>
          <ReferralSection />
        </DeferredSection>

        <DeferredSection>
          <CtaSection onBook={openBooking} />
        </DeferredSection>
      </main>
      {isBookingOpen && (
        <Suspense fallback={null}>
          <BookingModal
            isOpen={isBookingOpen}
            onClose={closeBooking}
            service={currentBookingService}
            inspection={isInspectionBooking}
            bookingType={currentBookingType}
          />
        </Suspense>
      )}
    </div>
  );
}
