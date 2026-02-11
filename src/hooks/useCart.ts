import { useState, useEffect } from "react";
import { MenuItem } from "@/data/mock";

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("pos_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("pos_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((a, b) => a + b.quantity, 0);
  const totalAmount = cart.reduce((a, b) => a + b.price * b.quantity, 0);

  return { cart, addToCart, removeFromCart, clearCart, totalItems, totalAmount };
};
