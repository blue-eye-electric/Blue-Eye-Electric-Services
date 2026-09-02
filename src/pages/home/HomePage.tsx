import { lazy, Suspense, useState } from "react";

import type { BookingMode } from "../../types/booking";

// Components
import Navbar from "../../organisms/Navbar";
import HeroSection from "./organisms/HeroSection";
import ServiceSection from "./organisms/ServiceSection";
import UspBar from "./organisms/UspBar";
import HowItWorksSection from "./organisms/HowItWorksSection";
import GuaranteeSection from "./organisms/GuaranteeSection";
import WhyChooseUsSection from "./organisms/WhyChooseUsSection";
import CtaSection from "./organisms/CtaSection";
import ElectricianSection from "./organisms/ElectricianSection/ElectricianSection";
import PromotionBannerSection from "./organisms/PromotionBannerSection";

const BookingModal = lazy(() => import("../../organisms/BookingModal"));

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
        <ServiceSection onBook={openBooking} />
        <GuaranteeSection />
        <HowItWorksSection />
        <WhyChooseUsSection />
        <ElectricianSection />

        <CtaSection onBook={openBooking} />
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
