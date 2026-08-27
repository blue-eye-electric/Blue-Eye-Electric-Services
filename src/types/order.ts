
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
  photo_urls: string[];
  mode_of_payment: "cash" | "UPI" | null;
  payment_details: PaymentDetail[];
  total_amount: number | null;
}

export interface PaymentDetail {
  description: string;
  amount: number;
}

export interface GetOrdersResponse {
  success: boolean;
  orders: Order[];
}

export interface GetOrdersParams {
  electricianId?: string;
  status?: string;
  month?: number;
  year?: number;
}

export interface CompleteOrderPayload {
  mode_of_payment: "cash" | "UPI";
  payment_details: PaymentDetail[];
  total_amount: number;
}
