export type OrderStatus = "pending" | "shipped" | "in_transit" | "delivered" | "cancelled";

export interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  product: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  trackingEvents: TrackingEvent[];
}

export interface DashboardStats {
  totalOrders: number;
  inTransit: number;
  delivered: number;
  revenue: number;
}
