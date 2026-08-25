export type InspectionOption = "yes" | "no";

export type BookingForm = {
  name: string;
  phone: string;
  address: string;
  mapAddress: string;
  latitude: string;
  longitude: string;
  date: string;
  time: string;
  inspection: "yes" | "no";
  service: string;
  description: string;
};

export type BookingPayload = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  latitude: string;
  longitude: string;
  serviceDate: string;
  serviceTime: string;
  inspection: boolean;
  service: string | null;
  description: string | null;
  photos: File[];
};

export type BookingResult = {
  success: boolean;
  bookingId: string;
};

export const initialBookingForm: BookingForm = {
  name: "",
  phone: "",
  address: "",
  mapAddress: "",
  latitude: "",
  longitude: "",
  date: "",
  time: "",
  inspection: "no",
  service: "",
  description: "",
};