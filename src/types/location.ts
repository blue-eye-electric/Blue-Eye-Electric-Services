export interface ReverseGeocodeResult {
  address: string;
};

export type LocationPickerProps = {
  address: string;
  latitude: string;
  longitude: string;
  onChange: (location: {
    address: string;
    latitude: string;
    longitude: string;
  }) => void;
};

export type Position = {
  latitude: number;
  longitude: number;
};