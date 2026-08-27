import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
  UserRound,
  ChevronDown,
} from "lucide-react";

import { PrimaryButton } from "../../atoms/PrimaryButton";

import type { Electrician } from "../../services/electricianService";
import { getGoogleMapsUrl, getWhatsAppUrl } from "../../helpers/orderHelpers";
import type { Order } from "../../types/order";

type OrderCardProps = {
  order: Order;
  electricians?: Electrician[];
  onAssign?: () => void;
  onMarkComplete?: () => void;
  role: "admin" | "electrician";
};

const OrderCard = ({
  order,
  electricians = [],
  onAssign,
  onMarkComplete,
  role,
}: OrderCardProps) => {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const assignedElectrician = electricians.find(
    (electrician) => electrician.id === order.electrician_id,
  );

  return (
    <div
      className="
        rounded-3xl
        border
        border-primary
        bg-white
        p-5
        shadow-sm
        md:p-6
      "
    >
      {/* Top */}
      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-slate-100
          pb-5
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <div>
          <div className="flex items-center gap-3">
            <span
              className="
                rounded-lg
                bg-primary/10
                px-2.5
                py-1
                font-bold
                text-primary
              "
            >
              #{order.id}
            </span>

            <StatusBadge status={order.status} />
          </div>

          <p className="mt-2 text-sm text-muted">
            Received :{" "}
            {new Date(order.created_at).toLocaleString([], {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {order.status !== "completed" && role === "admin" && (
          <PrimaryButton onClick={onAssign}>
            {order.electrician_id ? "Change Electrician" : "Assign Electrician"}
          </PrimaryButton>
        )}

        {order.status !== "completed" && role === "electrician" && (
          <PrimaryButton onClick={onMarkComplete}>Mark Complete</PrimaryButton>
        )}
      </div>

      {/* Details */}
      <div
        className="
          mt-5
          grid
          gap-6
          md:grid-cols-2
          lg:grid-cols-4
        "
      >
        {/* Customer */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Customer
          </p>

          <div className="flex gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100">
              <UserRound className="h-6 w-6 text-slate-600" />
            </div>

            <div>
              <p className="text-md font-semibold text-ink">
                {order.customer_name}
              </p>

              <p className="mt-1 flex items-center gap-1 text-md text-muted">
                <Phone className="h-3 w-3" />
                {order.customer_phone}
              </p>
            </div>
          </div>
        </div>

        {/* Service */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Service
          </p>

          <p className="text-md font-semibold text-ink">
            {order.service_type || "Inspection Visit"}
          </p>

          {order.description && (
            <p className="mt-1 line-clamp-2 text-md text-muted">
              {order.description}
            </p>
          )}
        </div>

        {/* Schedule */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Schedule
          </p>

          <div className="space-y-2">
            <p className="flex items-center gap-2 text-md text-ink">
              <CalendarDays className="h-4 w-4 text-primary" />
              {order.service_date}
            </p>

            <p className="flex items-center gap-2 text-xs text-muted">
              <Clock3 className="h-4 w-4" />
              {order.service_time}
            </p>
          </div>
        </div>

        {/* Location */}
        <div
          className="cursor-pointer"
          onClick={() => {
            const url = getGoogleMapsUrl(order.latitude, order.longitude);

            if (url) {
              window.open(url, "_blank", "noopener,noreferrer");
            }
          }}
        >
          <div className="flex flex-row items-center mb-3 gap-2">
            <p className=" text-xs font-semibold uppercase tracking-wider text-muted">
              Location
            </p>
            <ExternalLink className="h-4 w-4 text-primary" />
          </div>

          <p className="flex gap-2 text-sm text-ink">
            <MapPin className=" h-6 w-6 shrink-0 text-primary" />

            <span className="line-clamp-3">{order.customer_address}</span>
          </p>
        </div>
      </div>

      {order.photo_urls && order.photo_urls.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Customer Photos
          </p>

          <div className="flex flex-wrap gap-3">
            {order.photo_urls.map((photo, index) => (
              <a
                key={`${photo}-${index}`}
                href={photo}
                target="_blank"
                rel="noreferrer"
                className="block h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                <img
                  src={photo}
                  alt={`Customer upload ${index + 1}`}
                  className="h-full w-full object-cover transition hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {role === "admin" &&
        order.status === "completed" &&
        typeof order.total_amount === "number" && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="flex flex-row justify-center items-center">
              <p className="text-sm text-ink">
                Payment Mode :{" "}
                <span className="font-bold">
                  {order.mode_of_payment === "UPI" ? "UPI" : "Cash"}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPaymentDetails((isVisible) => !isVisible)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Total Amount
              </span>
              <span className="flex items-center gap-2 text-lg font-bold text-primary">
                ₹{order.total_amount.toLocaleString("en-IN")}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showPaymentDetails ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            {showPaymentDetails && (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-[1fr_auto] bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                {(order.payment_details ?? []).map((detail, index) => (
                  <div
                    key={`${detail.description}-${index}`}
                    className="grid grid-cols-[1fr_auto] border-t border-slate-100 px-4 py-3 text-sm text-ink"
                  >
                    <span>{detail.description}</span>
                    <span>₹{detail.amount.toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 px-4 py-3 text-xs text-muted">
                  Payment: {order.mode_of_payment === "UPI" ? "UPI" : "Cash"}
                </div>
              </div>
            )}
          </div>
        )}

      {/* Assigned Electrician */}
      {assignedElectrician && (
        <div className="mt-5 rounded-2xl bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Assigned Electrician
              </p>

              <p className="mt-0.5 text-sm font-bold text-ink">
                {assignedElectrician.name}
              </p>

              <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                <Phone className="h-3 w-3" />
                {assignedElectrician.mobile_number}
              </p>
            </div>
          </div>

          {/* WhatsApp Actions */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {role === "admin" && (
              <>
                {/* Send to Customer */}
                <a
                  href={getWhatsAppUrl(
                    order.customer_phone,
                    order.status === "completed"
                      ? ""
                      : `Hello ${order.customer_name},

Your electrician has been assigned for your service request number *${order.id}*.

🔧 Electrician: ${assignedElectrician.name}
📞 Electrician Contact: ${assignedElectrician.mobile_number}

📋 Service: ${order.service_type || "Electrical Service"}
📅 Date: ${order.service_date}
⏰ Time: ${order.service_time}

📍 Address:
${order.customer_address}

You can contact the electrician directly on WhatsApp for any coordination.

Thank you,
Blue Eye Electric`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
          inline-flex
          flex-1
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-success
          px-4
          py-2.5
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-green-700
        "
                >
                  <MessageCircle className="h-4 w-4" />
                  {order.status === "completed"
                    ? "Chat with customer"
                    : "Send Details to Customer"}
                </a>

                {/* Send to Electrician */}
                <a
                  href={getWhatsAppUrl(
                    assignedElectrician.mobile_number,
                    order.status === "completed"
                      ? ""
                      : `Hello ${assignedElectrician.name},

You have been assigned a new service request.

👤 Customer: ${order.customer_name}
📞 Customer Contact: ${order.customer_phone}

📋 Service: ${order.service_type || "Electrical Service"}

${order.description ? `📝 Description:\n${order.description}\n` : ""}

📅 Date: ${order.service_date}
⏰ Time: ${order.service_time}

📍 Customer Address:
${order.customer_address}

📍 Google Maps Location:
${getGoogleMapsUrl(order.latitude, order.longitude)}

Please contact the customer and coordinate the visit.

Thank you,
Blue Eye Electric`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
          inline-flex
          flex-1
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-green-600
          px-4
          py-2.5
          text-sm
          font-semibold
          text-green-700
          transition
          hover:bg-green-50
        "
                >
                  <MessageCircle className="h-4 w-4" />
                  {order.status === "completed"
                    ? "Chat with Electrician"
                    : "Send Details to Electrician"}
                </a>
              </>
            )}

            {role === "electrician" && (
              <a
                href={getWhatsAppUrl(order.customer_phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="
        inline-flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-green-600
        px-4
        py-2.5
        text-sm
        font-semibold
        text-white
        transition
        hover:bg-green-700
      "
              >
                <MessageCircle className="h-4 w-4" />
                Chat with Customer
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
      {status}
    </span>
  );
}

export default OrderCard;
