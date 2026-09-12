export type InspectionOption = "yes" | "no";
export type BookingMode = "projectDiscussion" | "electrician";

export type BookingForm = {
  name: string;
  phone: string;
  address: string;
  serviceArea: string;
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
  serviceArea: string;
  latitude: string;
  longitude: string;
  serviceDate: string;
  serviceTime: string;
  inspection: boolean;
  isProjectDiscussion: boolean;
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
  serviceArea: "",
  mapAddress: "",
  latitude: "",
  longitude: "",
  date: "",
  time: "",
  inspection: "no",
  service: "",
  description: "",
};