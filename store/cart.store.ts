"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/product";
import { roundToIQD } from "@/lib/utils/currency";

type AppliedCoupon = {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minimumOrder?: number | null;
  maximumDiscount?: number | null;
};

type CartStore = {
  items: CartItem[];
  coupon: AppliedCoupon | null;

  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;

  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getDiscount: () => {
        const { coupon, getSubtotal } = get();
        if (!coupon) return 0;
        const subtotal = getSubtotal();
        if (coupon.minimumOrder && subtotal < coupon.minimumOrder) return 0;
        const discount =
          coupon.discountType === "PERCENTAGE"
            ? (subtotal * coupon.discountValue) / 100
            : coupon.discountValue;
        return roundToIQD(
          coupon.maximumDiscount
            ? Math.min(discount, coupon.maximumDiscount)
            : discount
        );
      },

      getTotal: () => Math.max(0, get().getSubtotal() - get().getDiscount()),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === newItem.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id
                  ? {
                      ...i,
                      quantity: Math.min(
                        i.quantity + (newItem.quantity ?? 1),
                        i.stock
                      ),
                    }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...newItem, quantity: newItem.quantity ?? 1 },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) =>
                  i.id === id
                    ? { ...i, quantity: Math.min(quantity, i.stock) }
                    : i
                ),
        })),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
      clearCart: () => set({ items: [], coupon: null }),
    }),
    {
      name: "taurus-cart",
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
    }
  )
);
