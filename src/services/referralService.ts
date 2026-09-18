import { baseUrl } from "../constants/apiConstants";

export type CreateReferralPayload = {
  name: string;
  phone: string;
};

export type CreateReferralResponse = {
  success: boolean;
  message?: string;
  referral?: {
    name: string;
    phone: string;
    referralCode: string;
  };
};

export const createReferral = async (
  payload: CreateReferralPayload,
): Promise<CreateReferralResponse> => {
  const response = await fetch(`${baseUrl}/api/referrals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as CreateReferralResponse;

  if (!response.ok) {
    throw new Error(result.message || "Failed to create referral code");
  }

  return result;
};