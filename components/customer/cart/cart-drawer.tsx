"use client";

import { useTranslations, useLocale } from "next-intl";
import { useUIStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItemRow } from "./cart-item";
import { CouponInput } from "./coupon-input";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/currency";

export function CartDrawer() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const isOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getTotal = useCartStore((s) => s.getTotal);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t("title")}
            {items.length > 0 && (
              <span className="ms-auto text-sm font-normal text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            <p className="font-medium">{t("empty")}</p>
            <p className="text-sm text-muted-foreground text-center">{t("emptyDescription")}</p>
            <Button asChild className="bg-brand-brown hover:bg-brand-brown-dark text-white" onClick={closeCart}>
              <Link href={`/${locale}/products`}>{t("continueShopping")}</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            {/* Bottom section */}
            <div className="border-t px-6 py-4 space-y-4">
              <CouponInput />

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("discount")}</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-base">
                  <span>{t("total")}</span>
                  <span className="text-brand-brown">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                asChild
                className="w-full bg-brand-brown hover:bg-brand-brown-dark text-white"
                size="lg"
                onClick={closeCart}
              >
                <Link href={`/${locale}/checkout`}>{t("checkout")}</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
