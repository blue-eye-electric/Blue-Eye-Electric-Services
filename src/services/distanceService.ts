import { baseUrl } from "../constants/apiConstants";
import type { FindDistanceResponse } from "../types/distance";


export const findDistanceOfAllElectricians = async (
  orderId: string,
): Promise<FindDistanceResponse> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const url = new URL(
    `${baseUrl}/api/admin/findDistance`,
  );

  url.searchParams.append("orderId", orderId);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result: FindDistanceResponse & {
    message?: string;
  } = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to calculate electrician distances",
    );
  }

  return result;
};
