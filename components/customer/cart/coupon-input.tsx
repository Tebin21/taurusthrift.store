"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { Tag, X } from "lucide-react";
import { toast } from "sonner";
import { formatIQD } from "@/lib/utils/currency";

export function CouponInput() {
  const t = useTranslations("cart");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const coupon = useCartStore((s) => s.coupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), cartTotal: getSubtotal() }),
      });
      const data = await res.json();
      if (data.success && data.data.valid) {
        applyCoupon(data.data.coupon);
        toast.success(t("couponApplied"));
        setCode("");
      } else {
        toast.error(data.data?.error || t("couponInvalid"));
      }
    } catch {
      toast.error(t("couponInvalid"));
    } finally {
      setLoading(false);
    }
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-md bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 px-3 py-2">
        <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
          <Tag className="h-4 w-4" />
          <span className="font-medium">{coupon.code}</span>
          <span className="text-green-600">
            {coupon.discountType === "PERCENTAGE"
              ? `${coupon.discountValue}% off`
              : `${formatIQD(coupon.discountValue)} off`}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeCoupon}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder={t("couponPlaceholder")}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleApply()}
        className="text-sm"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleApply}
        disabled={loading || !code.trim()}
        className="shrink-0"
      >
        {t("applyCoupon")}
      </Button>
    </div>
  );
}
