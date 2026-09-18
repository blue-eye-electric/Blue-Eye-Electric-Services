import { useState, type FormEvent } from "react";
import { Check, Clipboard, Gift, X } from "lucide-react";

import { AppInput } from "../../../../atoms/AppInput";
import { PrimaryButton } from "../../../../atoms/PrimaryButton";
import { createReferral } from "../../../../services/referralService";

const ReferralSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");

  const openModal = () => {
    setName("");
    setMobileNumber("");
    setReferralCode("");
    setIsCopied(false);
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!isSubmitting) setIsModalOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await createReferral({
        name: name.trim(),
        phone: mobileNumber.replace(/\D/g, "").slice(0, 10),
      });
      const code = result.referral?.referralCode;

      if (!code) {
        throw new Error("Referral code was not returned. Please try again.");
      }

      setReferralCode(code);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to create referral code. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <section className="bg-primary/10 px-[6vw] py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-on-primary">
            <Gift className="h-8 w-8" />
          </div>

          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[1.5px] text-primary">
              Share the service you trust
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
              Refer a friend, earn 10% commission
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              Create your referral code and share it with others. When they book
              a service with us, you will get 10% commission.
            </p>
          </div>

          <PrimaryButton onClick={openModal} className="whitespace-nowrap">
            Create Referral Code
          </PrimaryButton>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            className="relative max-h-full w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="referral-modal-title"
          >
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              aria-label="Close referral form"
              className="absolute right-4 top-4 rounded-full p-2 text-muted transition hover:bg-slate-100 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

            <h2
              id="referral-modal-title"
              className="pr-8 text-2xl font-bold text-ink"
            >
              Create your referral code
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Enter your details to get a code you can share with others.
            </p>

            {referralCode ? (
              <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
                <p className="text-sm font-semibold text-muted">
                  Your referral code
                </p>
                <p className="mt-2 break-all text-3xl font-bold tracking-[2px] text-primary">
                  {referralCode}
                </p>
                <button
                  type="button"
                  onClick={copyReferralCode}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Clipboard className="h-4 w-4" />
                  )}
                  {isCopied ? "Copied" : "Copy code"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <AppInput
                  label="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                />
                <AppInput
                  label="Mobile number"
                  value={mobileNumber}
                  onChange={(event) => setMobileNumber(event.target.value)}
                  placeholder="Enter your mobile number"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  pattern="[0-9]{10}"
                  minLength={10}
                  maxLength={10}
                  required
                />

                {error && (
                  <p className="text-sm font-medium text-red-600">{error}</p>
                )}

                <PrimaryButton type="submit" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? "Creating code..." : "Create referral code"}
                </PrimaryButton>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReferralSection;
