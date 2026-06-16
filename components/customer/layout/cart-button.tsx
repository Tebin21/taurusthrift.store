"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
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
      size="icon-lg"
      className={cn(
        "relative rounded-full text-foreground/55 hover:text-foreground hover:bg-brand-brown/10 dark:text-brand-white/55 dark:hover:text-brand-white dark:hover:bg-brand-brown/20",
        className
      )}
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
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute -top-0.5 -end-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-brown px-1 text-[11px] font-semibold text-white ring-2 ring-background dark:bg-brand-accent dark:text-black dark:ring-background"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
