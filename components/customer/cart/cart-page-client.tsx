"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CouponInput } from "./coupon-input";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils/currency";

type Props = { locale: string };

export function CartPageClient({ locale }: Props) {
  const t = useTranslations("cart");
  const { items, getSubtotal, getDiscount, getTotal, coupon: appliedCoupon, updateQuantity, removeItem } =
    useCartStore();

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center gap-5 text-center">
        <ShoppingBag className="h-20 w-20 text-muted-foreground" />
        <h1 className="text-2xl font-bold">{t("emptyTitle")}</h1>
        <p className="text-muted-foreground">{t("emptySubtitle")}</p>
        <Button asChild className="bg-brand-brown hover:bg-brand-brown-dark text-white">
          <Link href={`/${locale}/products`}>{t("startShopping")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">{t("title")}</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        {/* Items */}
        <div>
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="border-b py-5 flex gap-4"
              >
                <Link href={`/${locale}/products/${item.productId}`} className="shrink-0">
                  <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-brand-beige dark:bg-muted">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👗</div>
                    )}
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  {item.variantInfo && (
                    <p className="text-sm text-muted-foreground">{item.variantInfo}</p>
                  )}
                  <p className="text-brand-brown font-semibold mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center hover:border-brand-brown transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center hover:border-brand-brown transition-colors disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div>
          <div className="sticky top-24 rounded-2xl border bg-card p-6 space-y-5 shadow-luxury">
            <h2 className="font-semibold text-lg">{t("orderSummary")}</h2>

            <CouponInput />

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              {getDiscount() > 0 && appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>{t("discount")} ({appliedCoupon.code})</span>
                  <span>-{formatPrice(getDiscount())}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-base">
              <span>{t("total")}</span>
              <span className="text-brand-brown">{formatPrice(getTotal())}</span>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full bg-brand-brown hover:bg-brand-brown-dark text-white"
            >
              <Link href={`/${locale}/checkout`}>{t("checkout")}</Link>
            </Button>

            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={`/${locale}/products`}>{t("continueShopping")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
