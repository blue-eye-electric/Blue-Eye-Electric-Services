import { baseUrl } from "../constants/apiConstants";
import type { BookingPayload } from "../types/booking";
import type { CreateOrderResponse, GetOrdersParams, GetOrdersResponse } from "../types/order";

export const createOrder = async (
  data: BookingPayload,
): Promise<CreateOrderResponse> => {
  const formData = new FormData();

  formData.append("customerName", data.customerName);
  formData.append("customerPhone", data.customerPhone);
  formData.append("customerAddress", data.customerAddress);
  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("serviceDate", data.serviceDate);
  formData.append("serviceTime", data.serviceTime);
  formData.append("inspection", String(data.inspection));

  if (data.service !== null) {
    formData.append("service", data.service);
  }

  if (data.description !== null) {
    formData.append("description", data.description);
  }

  data.photos.forEach((photo) => {
    formData.append("photos", photo);
  });

  const response = await fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create order");
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