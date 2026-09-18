import { baseUrl } from "../constants/apiConstants";
import type { CreateReferralPayload, CreateReferralResponse, GetReferralsParams, GetReferralsResponse, Referral, UpdateReferralPayload, UpdateReferralResponse } from "../types/referral";


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
export const getReferrals = async (
  params?: GetReferralsParams,
): Promise<GetReferralsResponse> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  // Construct query parameters
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);

  const queryString = queryParams.toString();
  const url = `${baseUrl}/api/referrals${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = (await response.json()) as GetReferralsResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load referrals");
  }

  return result;
};

export const updateReferral = async (
  phone: string,
  payload: UpdateReferralPayload
): Promise<Referral> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`${baseUrl}/api/referrals/${phone}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as UpdateReferralResponse;

  if (!response.ok) {
    throw new Error(result.message || "Failed to update referral");
  }

  // Return the updated referral object or fallback data if not wrapped
  return result.referral || (result as unknown as Referral);
};