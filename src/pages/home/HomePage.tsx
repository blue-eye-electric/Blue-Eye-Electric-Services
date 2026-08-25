import { useState } from "react";

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
import BookingModal from "../../organisms/BookingModal";

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentBookingService, setCurrentBookingService] = useState("");
  const [isInspectionBooking, setIsInspectionBooking] = useState(false);

  const openBooking = (service?: string, inspection = false) => {
    setCurrentBookingService(service || "");
    setIsInspectionBooking(inspection);
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
        <UspBar />
        <ServiceSection onBook={openBooking} />
        <GuaranteeSection />
        <HowItWorksSection />
        <WhyChooseUsSection />
        <ElectricianSection />

        <CtaSection onBook={openBooking} />
      </main>
      <BookingModal
        isOpen={isBookingOpen}
        onClose={closeBooking}
        service={currentBookingService}
        inspection={isInspectionBooking}
      />
    </div>
  );
}
