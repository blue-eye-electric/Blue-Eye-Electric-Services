// Icons
import { Clock3 } from "lucide-react";

// Components
import SectionHeader from "../SectionHeader";
import SummaryRow from "./SummaryRow";

interface BookingSummaryProps {
  name: string;
  inspection: string;
  service: string;
  date: string;
  time: string;
  isProjectDiscussion: boolean;
}

const BookingSummary = ({
  name,
  inspection,
  service,
  date,
  time,
  isProjectDiscussion,
}: BookingSummaryProps) => {
  const getServiceName = () => {
    if (inspection === "yes") {
      return "₹99 Inspection";
    }

    if (isProjectDiscussion) {
      return "Project Discussion";
    }

    return service || "Not selected";
  };

  return (
    <section>
      <SectionHeader
        icon={<Clock3 className="h-4 w-4" />}
        title="Booking Summary"
        description="Review your request before submitting"
      />

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
        "
      >
        <SummaryRow label="Customer" value={name || "Not provided"} />

        <SummaryRow label="Service" value={getServiceName()} />

        <SummaryRow label="Date" value={date || "Not selected"} />

        <SummaryRow label="Time" value={time || "Not selected"} last />
      </div>
    </section>
  );
};

export default BookingSummary;
