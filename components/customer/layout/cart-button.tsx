"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function CartButton() {
  const getItemCount = useCartStore((s) => s.getItemCount);
  const toggleCart = useUIStore((s) => s.toggleCart);
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const unsubscribe = useCartStore.subscribe((state) => {
        setCount(state.getItemCount());
      });
      setCount(getItemCount());
      return unsubscribe;
    }
  }, [mounted, getItemCount]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={toggleCart}
      aria-label="Open cart"
    >
      <ShoppingBag className="h-5 w-5" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="cart-count"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-brown text-xs font-medium text-white"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
