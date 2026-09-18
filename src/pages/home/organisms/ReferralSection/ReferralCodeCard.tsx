import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Check, Clipboard, Download, Share2 } from "lucide-react";

import { showSnackbar } from "../../../../atoms/AppSnackBar";
import logo from "../../../../assets/logo.webp";

type ReferralCodeCardProps = {
  referralCode: string;
};

export default function ReferralCodeCard({
  referralCode,
}: ReferralCodeCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const referralCardRef = useRef<HTMLDivElement>(null);

  const copyReferralCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 2000);
  };

  const generateReferralCard = async () => {
    if (!referralCardRef.current) return null;

    const dataUrl = await toPng(referralCardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      skipFonts: true,
    });

    const response = await fetch(dataUrl);
    return response.blob();
  };

  const downloadReferralCard = async () => {
    try {
      const blob = await generateReferralCard();
      if (!blob) return;

      const link = document.createElement("a");
      link.download = `blue-eye-electric-referral-${referralCode}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      showSnackbar.error("Failed to create referral card. Please try again.");
    }
  };

  const shareReferralCard = async () => {
    try {
      const blob = await generateReferralCard();
      if (!blob) return;

      const file = new File(
        [blob],
        `blue-eye-electric-referral-${referralCode}.png`,
        { type: "image/png" },
      );

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Blue Eye Electric Service Referral",
          text: `Use my referral code ${referralCode} when booking a service with Blue Eye Electric.`,
          files: [file],
        });
        return;
      }

      await downloadReferralCard();
    } catch (shareError) {
      if (shareError instanceof Error && shareError.name === "AbortError") {
        return;
      }

      await downloadReferralCard();
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <div
        ref={referralCardRef}
        className="overflow-hidden rounded-2xl border border-primary bg-primary/5 text-center"
      >
        <img
          src={logo}
          alt=""
          className="pointer-events-none inset-0 h-20 m-auto object-contain "
        />
        <div className="bg-primary px-5 py-4 text-white">
          <p className="text-xs font-bold uppercase tracking-[1.5px]">
            Blue Eye Electric Service
          </p>
        </div>

        <div className="px-5 py-7">
          <p className="text-lg font-semibold text-muted">My Referral Code</p>
          <p className="mt-3 text-6xl font-bold tracking-[4px] text-primary">
            {referralCode}
          </p>
          <p className="mt-4 text-sm leading-5 text-muted">
            Use this code when booking your electrical service.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={copyReferralCode}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
      >
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Clipboard className="h-4 w-4" />
        )}
        {isCopied ? "Copied" : "Copy code"}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={downloadReferralCard}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-bold text-ink transition hover:border-primary hover:text-primary"
        >
          <Download className="h-4 w-4" />
          Save image
        </button>
        <button
          type="button"
          onClick={shareReferralCard}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary/80"
        >
          <Share2 className="h-4 w-4" />
          Share image
        </button>
      </div>
    </div>
  );
}
