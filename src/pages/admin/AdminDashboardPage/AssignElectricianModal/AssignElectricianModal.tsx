import { useEffect, useState } from "react";

// Icons
import { CheckCircle2, Clock, MapPin, Phone, UserRound, X } from "lucide-react";

// Components
import { PrimaryButton } from "../../../../atoms/PrimaryButton";

// Interfaces
import type { Order } from "../../../../types/order";
import type { Electrician } from "../../../../types/electrician";
import { findDistanceOfAllElectricians } from "../../../../services/distanceService";

type AssignElectricianModalProps = {
  isOpen: boolean;
  order: Order;
  electricians: Electrician[];
  isSubmitting: boolean;
  onClose: () => void;
  onAssign: (electricianId: string) => Promise<void>;
};

export default function AssignElectricianModal({
  isOpen,
  order,
  electricians,
  isSubmitting,
  onClose,
  onAssign,
}: AssignElectricianModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(order.electrician_id || "");
  const [electricianTravelMap, setElectricianTravelMap] = useState<
    Record<string, [number, number | null]>
  >({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchElectriciansDistance();
  }, [order.id]);

  const fetchElectriciansDistance = async () => {
    try {
      setIsLoading(true);

      const result = await findDistanceOfAllElectricians(order.id);

      if (result.electricians) {
        const electricianMap = result.electricians.reduce<
          Record<string, [number, number | null]>
        >((acc, electrician) => {
          acc[electrician.id] = [
            electrician.distanceKm,
            electrician.durationMinutes,
          ];

          return acc;
        }, {});

        setElectricianTravelMap(electricianMap);
      }
    } catch (error) {
      console.error("Failed to fetch electrician distances:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const handleAssign = async () => {
    if (!selectedId) {
      setError("Please select an electrician.");

      return;
    }

    try {
      setError("");

      await onAssign(selectedId);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to assign electrician.",
      );
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[60]
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-lg
          overflow-hidden
          rounded-3xl
          bg-paper
          shadow-2xl
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            px-6
            py-5
          "
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Order Assignment
            </p>

            <h2 className="mt-1 text-xl font-bold text-ink">
              Assign Electrician
            </h2>

            <p className="mt-1 text-xs text-muted">Order #{order.id}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              grid
              h-9
              w-9
              place-items-center
              rounded-full
              border
              border-slate-200
              bg-white
              text-slate-500
              hover:bg-slate-50
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center p-4 min-h-[200px]">
            Loading...
          </div>
        ) : (
          <>
            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              <p className="mb-4 text-sm font-semibold text-ink">
                Select an electrician
              </p>

              <div className="space-y-3">
                {electricians.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-6 text-center">
                    <UserRound className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-ink">
                      No electricians found
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      Register an electrician before assigning this order.
                    </p>
                  </div>
                ) : (
                  electricians.map((electrician) => {
                    const selected = selectedId === electrician.id;
                    const [distance, duration] = electricianTravelMap[
                      electrician.id
                    ] ?? [undefined, undefined];
                    return (
                      <button
                        key={electrician.id}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setSelectedId(electrician.id)}
                        className={`
                      flex
                      w-full
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition
                      ${
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }
                    `}
                      >
                        <div
                          className={`
    grid
    h-11
    w-11
    shrink-0
    place-items-center
    overflow-hidden
    rounded-xl
    ${
      selected
        ? "bg-primary text-white"
        : "bg-white text-primary border border-primary"
    }
  `}
                        >
                          {electrician.profile_photo_url ? (
                            <img
                              src={electrician.profile_photo_url}
                              alt={electrician.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserRound className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-ink">
                            {electrician.name}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                            <Phone className="h-3 w-3" />
                            {electrician.mobile_number}
                          </p>
                          {distance && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                              <MapPin className="h-3 w-3" />
                              Distance : {distance} Kms
                            </p>
                          )}
                          {duration && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                              <Clock className="h-3 w-3" />
                              Duration : {duration} min
                            </p>
                          )}
                        </div>

                        {selected && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {error && (
                <p className="mt-4 text-xs font-medium text-error">{error}</p>
              )}
            </div>

            {/* Footer */}
            <div
              className="
            border-t
            border-slate-200
            bg-slate-50/70
            p-5
          "
            >
              <PrimaryButton
                fullWidth
                disabled={
                  isSubmitting || electricians.length === 0 || !selectedId
                }
                onClick={handleAssign}
              >
                {isSubmitting ? "Assigning..." : "Assign Electrician"}
              </PrimaryButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
