import { createContext, useContext } from "react";
import type { CartItem } from "../../types/cart";

interface ICartContext {
    cartItems: CartItem[];
    totalPrice: number;
    isLoading: boolean;
    addItem: (productId: string, quantity: number) => Promise<void>;
    updateItem: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

export const CartContext = createContext<ICartContext>({
    cartItems: [],
    totalPrice: 0,
    isLoading: true,
    addItem: async () => {},
    updateItem: async () => {},
    removeItem: async () => {},
    clearCart: async () => {},
    refreshCart: async () => {},
});

export const useCart = () => useContext(CartContext);

