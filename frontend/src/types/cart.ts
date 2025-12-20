import type { Product } from "./products";

export interface CartItem {
  _id: string;
  product: string | Product;
  unitPrice: number;
  quantity: number;
}

export type CartStatus = "active" | "completed";

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: CartStatus;
}