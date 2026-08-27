import { useEffect, useState, type FormEvent } from "react";

// Icons
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MapPin,
  Trash2,
  UserRound,
  X,
  Zap,
} from "lucide-react";

// Components
import { Eyebrow } from "../../atoms/Eyebrow";
import { AccentText } from "../../atoms/Typography";
import { AppInput } from "../../atoms/AppInput";
import { AppSelect } from "../../atoms/AppSelect";
import { AppTextarea } from "../../atoms/AppTextarea";
import { PrimaryButton } from "../../atoms/PrimaryButton";
import LocationPicker from "../../molecules/LocationPicker";
import { SecondaryButton } from "../../atoms";
import DocumentUpload from "../../atoms/DocumentUpload";
import SummaryRow from "./SummaryRow";
import SectionHeader from "./SectionHeader";

// Interfaces
import { initialBookingForm, type BookingForm } from "../../types/booking";

// Constants
import { serviceOptions, timeOptions } from "../../constants/services";

// Services
import { createOrder } from "../../services/orderService";

type BookingModalProps = {
  isOpen: boolean;
  service?: string;
  inspection?: boolean;
  onClose: () => void;
};

const BookingModal = ({
  isOpen,
  service = "",
  inspection = false,
  onClose,
}: BookingModalProps) => {
  const today = new Date();
  const minimumBookingDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const [form, setForm] = useState<BookingForm>(initialBookingForm);

  const [bookingId, setBookingId] = useState("");

  const [isSubmitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    setForm((current) => ({
      ...current,
      service,
      inspection: inspection ? "yes" : "no",
    }));
  }, [inspection, isOpen, service]);

  if (!isOpen) {
    return null;
  }

  const updateForm = <K extends keyof BookingForm>(
    field: K,
    value: BookingForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPhotos = Array.from(event.target.files ?? []);
    const imagePhotos = selectedPhotos.filter((photo) =>
      photo.type.startsWith("image/"),
    );

    if (imagePhotos.length !== selectedPhotos.length) {
      setError("Only image files can be uploaded.");
    }

    if (photos.length + imagePhotos.length > 5) {
      setError("You can upload a maximum of 5 photos.");
    }

    setPhotos((current) => [...current, ...imagePhotos].slice(0, 5));
    event.target.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        customerName: form.name.trim(),
        customerPhone: form.phone.replace(/\D/g, "").slice(0, 10),
        // Manually entered address
        customerAddress: form.address.trim(),
        // Map coordinates
        latitude: form.latitude,
        longitude: form.longitude,
        serviceDate: form.date,
        serviceTime: form.time,
        inspection: form.inspection === "yes",
        service: form.inspection === "yes" ? null : form.service || null,
        description: form.description.trim() || null,
        photos,
      };

      const result = await createOrder(payload);

      setBookingId(result.orderId);
    } catch (error) {
      console.error("Booking submission error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "We couldn't confirm the booking. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnotherBooking = () => {
    setBookingId("");
    setForm(initialBookingForm);
    setPhotos([]);
    setError("");
  };

  const handleClose = () => {
    if (isSubmitting) return;

    setBookingId("");
    setError("");
    onClose();
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        justify-end
        bg-[rgba(14,29,25,0.65)]
        backdrop-blur-[2px]
      "
      role="dialog"
      aria-modal="true"
      aria-label="Book an electrician"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="
          relative
          flex
          h-full
          w-full
          max-w-[620px]
          flex-col
          overflow-hidden
          bg-background
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
            md:px-8
          "
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Blue Eye Electric
            </p>

            <h3 className="mt-1 text-lg font-bold text-ink">Book a Service</h3>
          </div>

          <SecondaryButton onClick={() => onClose()}>
            <X className="h-5 w-5" />
          </SecondaryButton>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-8 md:px-8 md:py-10">
            {bookingId ? (
              /* ================= SUCCESS ================= */
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
                      max-w-[400px]
                      text-sm
                      leading-6
                      text-muted
                    "
                  >
                    Your booking has been successfully submitted. Our team will
                    contact you shortly to arrange an electrician.
                  </p>

                  <div
                    className="
                      mx-auto
                      mt-7
                      max-w-[360px]
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-5
                      text-left
                    "
                  >
                    <p className="text-xs font-medium text-muted">Booking ID</p>

                    <p className="mt-1 text-xl font-bold text-ink">
                      #{bookingId}
                    </p>
                  </div>

                  <div className="mt-7">
                    <PrimaryButton onClick={handleAnotherBooking}>
                      Make another booking
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Intro */}
                <div className="mb-8">
                  <Eyebrow>Book an electrician</Eyebrow>

                  <h2
                    className="
                      mt-3
                      text-4xl
                      font-medium
                      leading-[0.98]
                      tracking-[-2.5px]
                      text-ink
                      md:text-5xl
                    "
                  >
                    Tell us what's
                    <br />
                    <AccentText>going on.</AccentText>
                  </h2>

                  <p
                    className="
                      mt-4
                      max-w-[450px]
                      text-sm
                      leading-6
                      text-muted
                    "
                  >
                    Share a few details and we'll arrange a trusted electrician
                    for your requirement.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* ================= CUSTOMER ================= */}
                  <section>
                    <SectionHeader
                      icon={<UserRound className="h-4 w-4" />}
                      title="Customer Information"
                      description="Tell us who we should contact"
                    />

                    <div
                      className="
                        grid
                        gap-4
                        md:grid-cols-2
                      "
                    >
                      <AppInput
                        label="Full Name"
                        required
                        value={form.name}
                        onChange={(event) =>
                          updateForm("name", event.target.value)
                        }
                        placeholder="Your name"
                      />

                      <AppInput
                        label="Mobile Number"
                        required
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={form.phone}
                        onChange={(event) =>
                          updateForm(
                            "phone",
                            event.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                        placeholder="10-digit number"
                      />
                    </div>
                  </section>

                  {/* ================= LOCATION ================= */}
                  <section>
                    <SectionHeader
                      icon={<MapPin className="h-4 w-4" />}
                      title="Service Location"
                      description="Where should our electrician visit?"
                    />

                    <div className="space-y-4">
                      <AppInput
                        label="Address"
                        required
                        value={form.address}
                        onChange={(event) =>
                          updateForm("address", event.target.value)
                        }
                        placeholder="House / street / landmark"
                      />

                      <LocationPicker
                        address={form.mapAddress}
                        latitude={form.latitude}
                        longitude={form.longitude}
                        onChange={(location) => {
                          setForm((current) => ({
                            ...current,
                            mapAddress: location.address,
                            latitude: location.latitude,
                            longitude: location.longitude,
                          }));
                        }}
                      />
                    </div>
                  </section>

                  {/* ================= SCHEDULE ================= */}
                  <section>
                    <SectionHeader
                      icon={<CalendarDays className="h-4 w-4" />}
                      title="Schedule Visit"
                      description="Choose your preferred date and time"
                    />

                    <div
                      className="
                        grid
                        gap-4
                        md:grid-cols-2
                      "
                    >
                      <AppInput
                        label="Preferred Date"
                        required
                        type="date"
                        min={minimumBookingDate}
                        value={form.date}
                        onChange={(event) =>
                          updateForm("date", event.target.value)
                        }
                      />

                      <AppSelect
                        label="Preferred Time"
                        required
                        value={form.time}
                        onChange={(event) =>
                          updateForm("time", event.target.value)
                        }
                      >
                        <option value="">Choose a time</option>

                        {timeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </AppSelect>
                    </div>
                  </section>

                  {/* ================= SERVICE ================= */}
                  <section>
                    <SectionHeader
                      icon={<Zap className="h-4 w-4" />}
                      title="Service Details"
                      description="Tell us what kind of help you need"
                    />

                    <div className="space-y-4">
                      <AppSelect
                        label="Inspection Visit"
                        value={form.inspection}
                        onChange={(event) =>
                          updateForm(
                            "inspection",
                            event.target.value as "yes" | "no",
                          )
                        }
                      >
                        <option value="no">No, I know what needs fixing</option>

                        <option value="yes">
                          Yes, please inspect the issue
                        </option>
                      </AppSelect>

                      {form.inspection === "yes" && (
                        <div
                          className="
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            border-slate-200
                            bg-primary/5
                            p-4
                          "
                        >
                          <div
                            className="
                              grid
                              h-9
                              w-9
                              shrink-0
                              place-items-center
                              rounded-xl
                              bg-primary/10
                              text-primary
                            "
                          >
                            <ClipboardList className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-ink">
                              ₹99 inspection visit
                            </p>

                            <p className="mt-1 text-xs leading-5 text-muted">
                              An electrician will visit, inspect the issue and
                              recommend the required repair.
                            </p>
                          </div>
                        </div>
                      )}

                      {form.inspection === "no" && (
                        <>
                          <AppSelect
                            label="Service Type"
                            required
                            value={form.service}
                            onChange={(event) =>
                              updateForm("service", event.target.value)
                            }
                          >
                            <option value="">Select a service</option>

                            {serviceOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </AppSelect>

                          <AppTextarea
                            label="What's the problem?"
                            required
                            value={form.description}
                            onChange={(event) =>
                              updateForm("description", event.target.value)
                            }
                            placeholder="A short description helps us prepare"
                            rows={4}
                          />
                        </>
                      )}

                      <div className="space-y-3">
                        <div>
                          <DocumentUpload
                            multiple
                            label="Add photos"
                            file={photos}
                            onChange={handlePhotoChange}
                            disabled={photos.length >= 5}
                          />
                          <p className="mt-1 text-xs text-muted">
                            Optional, up to 5 images
                          </p>
                        </div>

                        {photos.length > 0 && (
                          <div className="space-y-2">
                            {photos.map((photo, index) => (
                              <div
                                key={`${photo.name}-${photo.lastModified}-${index}`}
                                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
                              >
                                <span className="min-w-0 flex-1 truncate text-xs text-ink">
                                  {photo.name}
                                </span>
                                <button
                                  type="button"
                                  aria-label={`Remove ${photo.name}`}
                                  onClick={() =>
                                    setPhotos((current) =>
                                      current.filter(
                                        (_, photoIndex) => photoIndex !== index,
                                      ),
                                    )
                                  }
                                  className="text-muted transition hover:text-orange"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* ================= SUMMARY ================= */}
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
                      <SummaryRow
                        label="Customer"
                        value={form.name || "Not provided"}
                      />

                      <SummaryRow
                        label="Service"
                        value={
                          form.inspection === "yes"
                            ? "₹99 Inspection"
                            : form.service || "Not selected"
                        }
                      />

                      <SummaryRow
                        label="Date"
                        value={form.date || "Not selected"}
                      />

                      <SummaryRow
                        label="Time"
                        value={form.time || "Not selected"}
                        last
                      />
                    </div>
                  </section>

                  {/* Error */}
                  {error && (
                    <div
                      className="
                        rounded-xl
                        border
                        border-orange/20
                        bg-orange/5
                        px-4
                        py-3
                      "
                    >
                      <p className="text-xs font-medium text-orange">{error}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <div>
                    <PrimaryButton
                      type="submit"
                      disabled={isSubmitting}
                      fullWidth
                      className="
                        justify-between
                        text-left
                      "
                      icon={isSubmitting ? undefined : "→"}
                    >
                      {isSubmitting
                        ? "Confirming..."
                        : form.inspection === "yes"
                          ? "Confirm ₹99 inspection"
                          : "Book service"}
                    </PrimaryButton>

                    <p
                      className="
                        mt-3
                        text-center
                        text-[10px]
                        leading-5
                        text-[#8b918a]
                      "
                    >
                      We'll only use your details to arrange this service.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
