export interface OrderItem {
  productName: string;
  productImage: string;
  productPrice: number;
  productQuantity: number;
}

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  address: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
