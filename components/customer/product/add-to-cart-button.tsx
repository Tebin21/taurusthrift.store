"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import type { Product, ProductVariant } from "@/types/product";

type Props = {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
};

export function AddToCartButton({ product, variant, quantity }: Props) {
  const t = useTranslations("cart");
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const [added, setAdded] = useState(false);

  const outOfStock = variant ? variant.stock === 0 : false;
  const needsVariant = (product.variants?.length ?? 0) > 0 && !variant;

  const handleAdd = () => {
    if (!variant && (product.variants?.length ?? 0) > 0) return;

    addItem({
      id: `${product.id}:${variant?.id ?? "no-variant"}`,
      productId: product.id,
      variantId: variant?.id,
      name: product.name,
      variantInfo: [variant?.size, variant?.color].filter(Boolean).join(" / ") || undefined,
      imageUrl: product.thumbnailUrl ?? product.images?.[0],
      price: Number(variant?.price ?? product.basePrice),
      quantity,
      stock: variant?.stock ?? 999,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 800);
  };

  return (
    <Button
      size="lg"
      className="w-full bg-brand-brown hover:bg-brand-brown-dark text-white gap-2 h-12 text-base"
      onClick={handleAdd}
      disabled={outOfStock || needsVariant}
    >
      <AnimatePresence mode="wait">
        {added ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-2"
          >
            <Check className="h-5 w-5" /> {t("added")}
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            {outOfStock ? t("outOfStock") : needsVariant ? t("selectVariant") : t("addToCart")}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
