export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  variantInfo?: string | null;
  imageUrl?: string | null;
  price: number;
  quantity: number;
  createdAt: Date;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string | null;
  customerNotes?: string | null;
  subtotal: number;
  discountAmount: number;
  total: number;
  couponId?: string | null;
  couponCode?: string | null;
  locale?: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
};

export type CheckoutFormData = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string;
  customerNotes?: string;
};
