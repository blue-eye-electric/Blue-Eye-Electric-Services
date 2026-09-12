import { baseUrl } from "../constants/apiConstants";
import type {
  ServiceArea,
  ServiceAreaResponse,
  ServiceAreasResponse,
} from "../types/serviceArea";

export const getServiceAreas = async (): Promise<ServiceArea[]> => {
   
  const response = await fetch(`${baseUrl}/api/service-areas`, {
    method: "GET",
     headers: {   
      "Content-Type": "application/json",
    },
  });

  const result: ServiceAreasResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch service areas");
  }

  return result.serviceAreas ?? [];
};


export const createServiceArea = async (
  serviceArea: string,
): Promise<ServiceArea> => {
    const token = localStorage.getItem("token");
if (!token) {
    throw new Error("Authentication token not found");
  }
  const response = await fetch(`${baseUrl}/api/service-areas`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ serviceArea }),
  });

  const result: ServiceAreaResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create service area");
  }

  return result.serviceArea;
};

export const updateServiceArea = async (
  id: string,
  serviceArea: string,
): Promise<ServiceArea> => {
    const token = localStorage.getItem("token");
if (!token) {
    throw new Error("Authentication token not found");
  }
  const response = await fetch(`${baseUrl}/api/service-areas/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ serviceArea }),
  });

  const result: ServiceAreaResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update service area");
  }

  return result.serviceArea;
};