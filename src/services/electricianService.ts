import { baseUrl } from "../constants/apiConstants";
import type {
  CreateElectricianRequest,
  CreateElectricianResponse,
  Electrician,
  GetElectriciansResponse,
} from "../types/electrician";

export type {
  CreateElectricianRequest,
  CreateElectricianResponse,
  Electrician,
  GetElectriciansResponse,
} from "../types/electrician";

export const createElectrician = async (
  data: CreateElectricianRequest,
): Promise<CreateElectricianResponse> => {

   const formData = new FormData();

  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('mobileNumber', data.mobileNumber);
  formData.append('password', data.password);
  formData.append('currentAddress', data.currentAddress);
  formData.append('latitude', String(data.latitude));
  formData.append('longitude', String(data.longitude));
  formData.append('validIdNumber', data.validIdNumber);
  formData.append('validIdType', data.validIdType);

  // Profile photo
  formData.append("profilePhoto", data.profilePhoto);
  // Actual document file
  formData.append('validId', data.validId);

  const response = await fetch(
    `${baseUrl}/api/electricians`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to create electrician',
    );
  }

  return result;
};

export const getElectricians = async (
  status?: string,
  id?: string,
  withDocument?: boolean
): Promise<Electrician[]> => {
  const url = new URL(
    `${baseUrl}/api/electricians`,
  );

  if (status) {
    url.searchParams.append('status', status);
  }

  if (id) {
    url.searchParams.append('id', id);
  }

  if (withDocument) {
    url.searchParams.append('withDocument', String(withDocument));
  }

  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const result: GetElectriciansResponse & {
    message?: string;
  } = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to fetch electricians',
    );
  }

  return result.electricians;
};

export const getElectricianById = async (
  id: string,
): Promise<Electrician> => {
  const electricians = await getElectricians(
    undefined,
    id,
    true
  );

  if (!electricians.length) {
    throw new Error('Electrician not found');
  }

  return electricians[0];
};

export const updateElectrician = async (
  id: string,
  data: {
    name?: string;
    current_address?: string;
    latitude?: number;
    longitude?: number;
    valid_id_number?: string;
    valid_id_type?: string;
    status?: string;
    password?: string;
    profilePhoto?: File;
    validId?: File;
  },
): Promise<Electrician> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append("name", data.name);
  }

  if (data.current_address !== undefined) {
    formData.append(
      "current_address",
      data.current_address,
    );
  }

  if (data.latitude !== undefined) {
    formData.append(
      "latitude",
      String(data.latitude),
    );
  }

  if (data.longitude !== undefined) {
    formData.append(
      "longitude",
      String(data.longitude),
    );
  }

  if (data.valid_id_number !== undefined) {
    formData.append(
      "valid_id_number",
      data.valid_id_number,
    );
  }

  if (data.valid_id_type !== undefined) {
    formData.append(
      "valid_id_type",
      data.valid_id_type,
    );
  }

  if (data.status !== undefined) {
    formData.append(
      "status",
      data.status,
    );
  }

  if (data.password) {
    formData.append(
      "password",
      data.password,
    );
  }

  // New profile photo
  if (data.profilePhoto) {
    formData.append(
      "profilePhoto",
      data.profilePhoto,
    );
  }

  // New valid ID
  if (data.validId) {
    formData.append(
      "validId",
      data.validId,
    );
  }

  const response = await fetch(
    `${baseUrl}/api/electricians/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to update electrician",
    );
  }

  return result.electrician;
};