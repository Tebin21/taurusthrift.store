import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatIQD } from "@/lib/utils/currency";

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, error: "Coupon code required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: { equals: code, mode: "insensitive" },
        isActive: true,
      },
    });

    if (!coupon) {
      return NextResponse.json({ success: true, data: { valid: false, error: "Invalid coupon code" } });
    }

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      return NextResponse.json({ success: true, data: { valid: false, error: "Coupon not yet active" } });
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      return NextResponse.json({ success: true, data: { valid: false, error: "Coupon has expired" } });
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ success: true, data: { valid: false, error: "Coupon usage limit reached" } });
    }
    if (coupon.minimumOrder && cartTotal < Number(coupon.minimumOrder)) {
      return NextResponse.json({
        success: true,
        data: {
          valid: false,
          error: `Minimum order of ${formatIQD(Number(coupon.minimumOrder))} required`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: Number(coupon.discountValue),
          minimumOrder: coupon.minimumOrder ? Number(coupon.minimumOrder) : null,
          maximumDiscount: coupon.maximumDiscount ? Number(coupon.maximumDiscount) : null,
        },
      },
    });
  } catch (error) {
    console.error("[POST /api/coupons/validate]", error);
    return NextResponse.json({ success: false, error: "Failed to validate coupon" }, { status: 500 });
  }
}
