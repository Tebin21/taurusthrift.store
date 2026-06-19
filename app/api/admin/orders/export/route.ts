import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { buildOrdersWhere } from "@/lib/data/orders";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const where = buildOrdersWhere(search, status);

    const rawOrders = await prisma.order.findMany({
      where,
      include: { items: { select: { quantity: true } } },
      orderBy: { createdAt: "desc" },
    });

    const orders = rawOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      status: order.status,
      total: Number(order.total),
      createdAt: order.createdAt.toISOString(),
      itemCount: order.items.reduce((s, i) => s + i.quantity, 0),
    }));

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("[GET /api/admin/orders/export]", error);
    return NextResponse.json({ success: false, error: "Failed to export orders" }, { status: 500 });
  }
}
