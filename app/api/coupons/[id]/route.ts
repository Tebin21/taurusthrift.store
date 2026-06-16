import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const coupon = await prisma.coupon.findUnique({ where: { id } });

    if (!coupon) return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    console.error("[GET /api/coupons/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch coupon" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...body,
        startsAt: body.startsAt ? new Date(body.startsAt) : null,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    });

    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    console.error("[PUT /api/coupons/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    console.error("[DELETE /api/coupons/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to delete coupon" }, { status: 500 });
  }
}
