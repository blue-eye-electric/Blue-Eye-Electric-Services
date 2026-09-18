
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

export type Referral = {
  name: string;
  phone: string;
  referralCode?: string;
  commission: number;
  createdAt?: string;
};

export interface UpdateReferralPayload {
  name?: string;
  commission?: number;
}

export interface UpdateReferralResponse {
  success: boolean;
  message?: string;
  referral?: Referral;
}

export interface GetReferralsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetReferralsResponse {
  success: boolean;
  message?: string;
  referrals: Referral[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}