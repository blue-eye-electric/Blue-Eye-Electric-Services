import { useEffect, useState } from "react";
import { Check, MapPin, Phone, Trash2, X } from "lucide-react";

// Assets
import UPIqrImage from "../../assets/payment-qr.png";

// Services
import { completeOrder } from "../../services/orderService";

// Components
import { AppSelect, PrimaryButton, SecondaryButton } from "../../atoms";

// Interfaces
import type { Order, PaymentDetail } from "../../types/order";

type CompleteJobModalProps = {
  order: Order | null;
  onClose: () => void;
  onCompleted: () => void;
  showBlankPaymentDetails?: boolean;
};

const CompleteJobModal = ({
  order,
  onClose,
  onCompleted,
  showBlankPaymentDetails = false,
}: CompleteJobModalProps) => {
  const [completeLoading, setCompleteLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"cash" | "UPI">("cash");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>([]);
  const [paymentError, setPaymentError] = useState("");

  const initializePaymentDetails = (selectedOrder: Order) => {
    setPaymentMode("cash");
    setPaymentError("");

    setPaymentDetails(
      selectedOrder.service_type === null && !showBlankPaymentDetails
        ? [
            {
              description: "Inspection charge",
              amount: 99,
            },
            {
              description: "",
              amount: 0,
            },
          ]
        : [
            {
              description: "",
              amount: 0,
            },
          ],
    );
  };

  // Reset the form whenever the modal opens for an order.
  useEffect(() => {
    if (order) {
      initializePaymentDetails(order);
    }
  }, [order?.id]);

  if (!order) {
    return null;
  }

  const handleClose = () => {
    if (completeLoading) return;

    setPaymentError("");
    setPaymentDetails([]);
    onClose();
  };

  const handleMarkComplete = async () => {
    const hasInvalidPayment = paymentDetails.some(
      (detail) => !detail.description.trim() || detail.amount <= 0,
    );

    if (hasInvalidPayment) {
      setPaymentError(
        "Enter a description and a positive amount for each row.",
      );
      return;
    }

    const totalAmount = paymentDetails.reduce(
      (total, detail) => total + detail.amount,
      0,
    );

    try {
      setCompleteLoading(true);
      setPaymentError("");

      await completeOrder(order.id, {
        mode_of_payment: paymentMode,
        payment_details: paymentDetails,
        total_amount: totalAmount,
      });

      setPaymentDetails([]);
      setPaymentError("");

      onCompleted();
    } catch (error) {
      console.error("Mark complete error:", error);

      setPaymentError(
        error instanceof Error
          ? error.message
          : "Failed to mark job as completed",
      );
    } finally {
      setCompleteLoading(false);
    }
  };

  const updatePaymentDescription = (index: number, description: string) => {
    setPaymentDetails((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              description,
            }
          : item,
      ),
    );
  };

  const updatePaymentAmount = (index: number, amount: number) => {
    setPaymentDetails((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              amount: Math.abs(amount),
            }
          : item,
      ),
    );
  };

  const removePaymentRow = (index: number) => {
    setPaymentDetails((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const addPaymentRow = () => {
    setPaymentDetails((current) => [
      ...current,
      {
        description: "",
        amount: 0,
      },
    ]);
  };

  const totalAmount = paymentDetails.reduce(
    (total, detail) => total + (detail.amount || 0),
    0,
  );

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        px-5
        backdrop-blur-sm
      "
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-3xl
          bg-white
          p-6
          shadow-2xl
          md:p-8
        "
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div>
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-primary/10
                text-primary
              "
            >
              <Check className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-ink">Complete Job?</h3>

            <p className="mt-1 text-sm leading-6 text-muted">
              Are you sure you want to mark this job as completed?
            </p>
          </div>

          {/* Close */}
          <SecondaryButton onClick={handleClose} disabled={completeLoading}>
            <X className="h-5 w-5" />
          </SecondaryButton>
        </div>

        {/* Selected Order */}
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4
          "
        >
          <p className="text-sm font-bold text-ink">{order.customer_name}</p>

          <p className="mt-1 text-sm font-semibold text-primary">
            {order.service_type || "Inspection Visit"}
          </p>

          {order.customer_phone && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted">
              <Phone className="h-4 w-4" />

              <span>{order.customer_phone}</span>
            </div>
          )}

          {order.customer_address && (
            <div className="mt-2 flex items-start gap-2 text-sm text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

              <span>{order.customer_address}</span>
            </div>
          )}
        </div>

        {/* Payment Mode */}
        <div className="mt-6">
          <AppSelect
            label="Mode of Payment"
            value={paymentMode}
            onChange={(event) =>
              setPaymentMode(event.target.value as "cash" | "UPI")
            }
            disabled={completeLoading}
          >
            <option value="cash">Cash</option>
            <option value="UPI">UPI</option>
          </AppSelect>
        </div>

        {/* UPI QR */}
        {paymentMode === "UPI" && (
          <div className="flex justify-center pt-4">
            <img src={UPIqrImage} alt="UPI QR" className="h-[200px]" />
          </div>
        )}

        {/* Payment Details */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Payment Details
            </p>

            <p className="text-lg font-bold text-primary">
              Total: ₹{totalAmount.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            {/* Header */}
            <div
              className="
                grid
                grid-cols-[1fr_7rem_2rem]
                gap-2
                bg-slate-50
                px-3
                py-2
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-muted
              "
            >
              <span>Description</span>
              <span>Amount</span>
              <span />
            </div>

            {/* Rows */}
            {paymentDetails.map((detail, index) => {
              const isInspectionCharge =
                order.service_type === null &&
                !showBlankPaymentDetails &&
                index === 0;

              return (
                <div
                  key={index}
                  className="
                    grid
                    grid-cols-[1fr_7rem_2rem]
                    gap-2
                    border-t
                    border-slate-100
                    px-3
                    py-2
                  "
                >
                  {/* Description */}
                  <input
                    value={detail.description}
                    onChange={(event) =>
                      updatePaymentDescription(index, event.target.value)
                    }
                    disabled={isInspectionCharge || completeLoading}
                    placeholder="Service charge"
                    className="
                      min-w-0
                      rounded-lg
                      border
                      border-slate-200
                      px-2
                      py-2
                      text-sm
                      text-ink
                      outline-none
                      focus:border-primary
                      disabled:bg-slate-50
                    "
                  />

                  {/* Amount */}
                  <input
                    type="number"
                    min="1"
                    value={detail.amount || ""}
                    onChange={(event) =>
                      updatePaymentAmount(index, Number(event.target.value))
                    }
                    disabled={isInspectionCharge || completeLoading}
                    className="
                      min-w-0
                      rounded-lg
                      border
                      border-slate-200
                      px-2
                      py-2
                      text-sm
                      text-ink
                      outline-none
                      focus:border-primary
                      disabled:bg-slate-50
                    "
                  />

                  {/* Remove */}
                  <div
                    onClick={() => {
                      if (
                        isInspectionCharge ||
                        paymentDetails.length === 1 ||
                        completeLoading
                      )
                        return;
                      removePaymentRow(index);
                    }}
                    className="flex justify-center items-center cursor-pointer"
                    aria-label="Remove payment row"
                  >
                    <Trash2 className="h-5 w-5 text-error/70" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Row */}
          <SecondaryButton
            onClick={addPaymentRow}
            disabled={completeLoading}
            className="mt-3"
          >
            + Add payment row
          </SecondaryButton>
        </div>

        {/* Error */}
        {paymentError && (
          <p className="mt-3 text-sm text-error">{paymentError}</p>
        )}

        <p className="mt-4 text-xs leading-5 text-muted">
          Only mark this job as completed after the electrical work has been
          finished successfully.
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <SecondaryButton onClick={handleClose} disabled={completeLoading}>
            Cancel
          </SecondaryButton>

          <PrimaryButton
            onClick={handleMarkComplete}
            disabled={completeLoading}
            fullWidth
          >
            {completeLoading ? "Completing..." : "Yes, Complete"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default CompleteJobModal;
