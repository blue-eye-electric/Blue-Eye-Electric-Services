// Icons
import { CheckCircle2 } from "lucide-react";

// Components
import { Eyebrow } from "../../../atoms/Eyebrow";
import { AccentText } from "../../../atoms/Typography";
import { PrimaryButton } from "../../../atoms";

interface BookingSuccessProps {
  bookingId: string;
  onAnotherBooking: () => void;
}

const BookingSuccess = ({
  bookingId,
  onAnotherBooking,
}: BookingSuccessProps) => {
  return (
    <div className="flex min-h-[600px] flex-col justify-center">
      <div
        className="
          mx-auto
          mb-6
          grid
          h-16
          w-16
          place-items-center
          rounded-2xl
          bg-lime
          text-ink
        "
      >
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <div className="text-center">
        <Eyebrow>Booking received</Eyebrow>

        <h2
          className="
            mt-4
            text-4xl
            font-medium
            leading-[1]
            tracking-[-2px]
            text-ink
            md:text-5xl
          "
        >
          Your request
          <br />
          <AccentText>is with us.</AccentText>
        </h2>

        <p
          className="
            mx-auto
            mt-5
            text-sm
            leading-6
            text-muted
          "
        >
          Your booking has been successfully submitted. Our team will contact
          you shortly to arrange an electrician.
        </p>

        <div
          className="
            mx-auto
            mt-7
            max-w-lg
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            text-left
          "
        >
          <p className="text-xs font-medium text-muted">Booking ID</p>

          <p className="mt-1 text-xl font-bold text-ink">#{bookingId}</p>
        </div>

        <div className="mt-7">
          <PrimaryButton onClick={onAnotherBooking}>
            Make another booking
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
