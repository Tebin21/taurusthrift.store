import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CouponForm } from "@/components/admin/coupons/coupon-form";

export default async function CouponFormPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <CouponForm />;
  }

  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) notFound();

  return (
    <CouponForm
      couponId={id}
      initialData={{
        code: coupon.code,
        description: coupon.description ?? "",
        discountType: coupon.discountType,
        discountValue: String(coupon.discountValue),
        minimumOrder: coupon.minimumOrder ? String(coupon.minimumOrder) : "",
        maximumDiscount: coupon.maximumDiscount ? String(coupon.maximumDiscount) : "",
        usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
        isActive: coupon.isActive,
        startsAt: coupon.startsAt ? coupon.startsAt.toISOString().slice(0, 10) : "",
        expiresAt: coupon.expiresAt ? coupon.expiresAt.toISOString().slice(0, 10) : "",
      }}
    />
  );
}
