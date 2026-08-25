
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
  photo_urls: File[]
}

export interface GetOrdersResponse {
  success: boolean;
  orders: Order[];
}

export interface GetOrdersParams {
  electricianId?: string;
  status?: string;
}
