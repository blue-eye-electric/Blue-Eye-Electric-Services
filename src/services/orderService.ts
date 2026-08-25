import { baseUrl } from "../constants/apiConstants";
import type { BookingPayload } from "../types/booking";

export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
}

export interface Order {
  id: string;
  electrician_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  latitude: number | null;
  longitude: number | null;
  service_date: string;
  service_time: string;
  service_type: string | null;
  description: string | null;
  status: string;
  created_at: string;
}

export interface GetOrdersResponse {
  success: boolean;
  orders: Order[];
}

export interface GetOrdersParams {
  electricianId?: string;
  status?: string;
}

export const createOrder = async (
  data: BookingPayload,
): Promise<CreateOrderResponse> => {
  const response = await fetch(
    `${baseUrl}/api/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  console.log(response)
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create order",
    );
  }

  return result;
};

export const getOrders = async (
  params?: GetOrdersParams,
): Promise<GetOrdersResponse> => {

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const searchParams = new URLSearchParams();

  if (params?.status) {
    searchParams.append("status", params.status);
  }

  const queryString = searchParams.toString();

  const response = await fetch(
    `${baseUrl}/api/orders${
      queryString ? `?${queryString}` : ""
    }`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch orders",
    );
  }

  return result;
};

type AssignElectricianResponse = {
  success: boolean;
  message: string;
};

export const assignElectrician = async ({
  orderId,
  electricianId,
}: {
  orderId: string;
  electricianId: string;
}): Promise<AssignElectricianResponse> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/orders/${orderId}/assign`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          electricianId,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to assign electrician",
      );
    }

    return data;
  } catch (error) {
    console.error("Assign electrician error:", error);

    throw error;
  }
};

export const completeOrder = async (orderId: string): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }
  const response = await fetch(`${baseUrl}/api/orders/complete/${orderId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to mark job as completed");
  }
};