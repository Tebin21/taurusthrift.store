"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils/currency";
import { useCartStore } from "@/store/cart.store";
import { Separator } from "@/components/ui/separator";

export function OrderSummary() {
  const t = useTranslations();
  const { items, getSubtotal, getDiscount, getTotal, coupon: appliedCoupon } = useCartStore();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <h2 className="font-semibold text-base">{t("checkout.orderSummary")}</h2>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-brand-beige dark:bg-muted">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">👗</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              {item.variantInfo && (
                <p className="text-xs text-muted-foreground">{item.variantInfo}</p>
              )}
              <p className="text-xs text-muted-foreground">× {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold shrink-0">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("cart.subtotal")}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && appliedCoupon && (
          <div className="flex justify-between text-green-600">
            <span>{t("cart.discount")} ({appliedCoupon.code})</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-between font-bold text-base">
        <span>{t("cart.total")}</span>
        <span className="text-brand-brown">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
