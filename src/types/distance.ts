
export interface ElectricianDistance {
  id: string;
  name: string;
  distanceKm: number;
  durationMinutes: number | null;
}

export interface FindDistanceResponse {
  orderId: string;
  electricians: ElectricianDistance[];
}