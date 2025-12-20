import type { FC, PropsWithChildren } from "react";
import { useState, useEffect } from "react";
import { CartContext } from "./cartContext";
import type { Cart, CartItem } from "../../types/cart";
import { BASE_URL } from "../../constants/baseUrl";
import { useAuth } from "../auth/authContext";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    const fetchCart = async () => {
      if (!token) {
        if (!ignore) {
          setCartItems([]);
          setTotalPrice(0);
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = (await response.json()) as {
          message: string;
          data: Cart | null;
        };
        if (!ignore) {
          if (data.data) {
            setCartItems(data.data.items || []);
            setTotalPrice(data.data.totalPrice || 0);
          } else {
            setCartItems([]);
            setTotalPrice(0);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        if (!ignore) {
          setCartItems([]);
          setTotalPrice(0);
          setIsLoading(false);
        }
      }
    };

    fetchCart();

    return () => {
      ignore = true;
    };
  }, [token]);

  const updateItem = async (productId: string, quantity: number) => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = (await response.json()) as {
        success: boolean;
        message: string;
        data: Cart | null;
      };
      if (data.data) {
        setCartItems(data.data.items);
        setTotalPrice(data.data.totalPrice);
      }
    } catch (error) {
      console.error("Error updating item in cart:", error);
    }
  };

  const addItem = async (productId: string, quantity: number) => {
    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = (await response.json()) as {
        success: boolean;
        message: string;
        data: Cart | null;
      };

      if (!data.success && data.message === "Item already in cart") {
        // If item already exists, update quantity instead
        const existingItem = cartItems.find((item) => {
          const itemProductId = typeof item.product === "string" ? item.product : item.product._id;
          return itemProductId === productId;
        });
        if (existingItem) {
          await updateItem(productId, existingItem.quantity + quantity);
        }
      } else if (data.data) {
        setCartItems(data.data.items);
        setTotalPrice(data.data.totalPrice);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeItem = async (productId: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_URL}/cart/items/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await response.json()) as {
        success: boolean;
        message: string;
        data: Cart | null;
      };
      if (data.data) {
        setCartItems(data.data.items);
        setTotalPrice(data.data.totalPrice);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await response.json()) as {
        success: boolean;
        message: string;
        data: Cart | null;
      };
      if (data.data) {
        setCartItems([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const refreshCart = async () => {
    if (!token) {
      setCartItems([]);
      setTotalPrice(0);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await response.json()) as {
        message: string;
        data: Cart | null;
      };
      if (data.data) {
        setCartItems(data.data.items || []);
        setTotalPrice(data.data.totalPrice || 0);
      } else {
        setCartItems([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error("Error refreshing cart:", error);
      setCartItems([]);
      setTotalPrice(0);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, totalPrice, isLoading, addItem, updateItem, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
