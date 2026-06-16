"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart.store";
import { CheckoutForm } from "./checkout-form";
import { OrderSummary } from "./order-summary";
import { CouponInput } from "../cart/coupon-input";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

type Props = { locale: string };

export function CheckoutPageClient({ locale }: Props) {
  const t = useTranslations("checkout");
  const { items, getSubtotal, getDiscount, getTotal, coupon: appliedCoupon } = useCartStore();

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center gap-4 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <p className="text-lg font-medium">{t("emptyCart")}</p>
        <Button asChild className="bg-brand-brown hover:bg-brand-brown-dark text-white">
          <Link href={`/${locale}/products`}>{t("continueShopping")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">{t("title")}</h1>
      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold text-lg mb-4">{t("couponSection")}</h2>
            <CouponInput />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-4">{t("deliveryInfo")}</h2>
            <CheckoutForm
              couponCode={appliedCoupon?.code}
              subtotal={getSubtotal()}
              discount={getDiscount()}
              total={getTotal()}
            />
          </div>
        </div>
        <div>
          <div className="sticky top-24">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
