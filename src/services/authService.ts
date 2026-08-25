import { baseUrl } from "../constants/apiConstants";

export type LoginCredentials = {
  email: string;
  password: string;
  pushSubscription?: PushSubscriptionJSON;
};

export type LoginResponse = {
  success: boolean;
  token: string;
  message?: string;
  name: string;
  notification?: {
    registered: boolean;
    vapidPublicKey: string;
  };
};

export type UserRole = "admin" | "electrician";

export type ValidateTokenResponse = {
  valid: boolean;
  role: UserRole | null;
};

export type ForgotPasswordResponse = {
  success: boolean;
  message: string;
};

const login = async (
  role: "admin" | "electrician",
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await fetch(`${baseUrl}/api/${role}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data: LoginResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Invalid email or password.");
  }

  return data;
};

export const loginAdmin = (
  credentials: LoginCredentials,
): Promise<LoginResponse> => login("admin", credentials);

export const loginElectrician = (
  credentials: LoginCredentials,
): Promise<LoginResponse> => login("electrician", credentials);

export const forgotPassword = async (
  email: string,
  role: UserRole,
): Promise<ForgotPasswordResponse> => {
  const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, role }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to send password reset email.");
  }

  return data;
};

export const validateToken = async (): Promise<ValidateTokenResponse> => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { valid: false, role: null };
  }

  const response = await fetch(`${baseUrl}/api/auth/validate-token`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to validate authentication token");
  }

  return response.json();
};
