export interface ServiceArea {
  id: string;
  area_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceAreasResponse {
  success: boolean;
  serviceAreas: ServiceArea[];
  message?: string;
}

export interface ServiceAreaResponse {
  success: boolean;
  serviceArea: ServiceArea;
  message?: string;
}