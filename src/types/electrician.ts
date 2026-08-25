export interface Electrician {
  id: string;
  name: string;
  email: string;
  mobile_number: string;
  current_address: string;
  latitude: number;
  longitude: number;
  profile_photo_url: string | null;
  valid_id_url: string | null;
  valid_id_number: string;
  valid_id_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}


export type ElectricianStatus =
  | 'pending'
  | 'approved'
  | 'rejected'

export interface CreateElectricianRequest {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  currentAddress: string;
  latitude: number;
  longitude: number;
  profilePhoto: File;
  validId: File;
  validIdNumber: string;
  validIdType: string;
}

export interface CreateElectricianResponse {
  success: boolean;
  electricianId: string;
}

export interface GetElectriciansResponse {
  success: boolean;
  electricians: Electrician[];
}
