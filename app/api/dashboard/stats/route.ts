import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalOrders,
      pendingOrders,
      monthlyOrders,
      lastMonthOrders,
      totalProducts,
      totalCategories,
      revenueResult,
      monthlyRevenueResult,
      lastMonthRevenueResult,
      recentOrders,
      lowStockVariants,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "DELIVERED" },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: "DELIVERED",
          completedAt: { gte: startOfMonth },
        },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: "DELIVERED",
          completedAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.productVariant.count({ where: { stock: { gt: 0, lte: 3 } } }),
    ]);

    const totalRevenue = Number(revenueResult._sum.total ?? 0);
    const monthlyRevenue = Number(monthlyRevenueResult._sum.total ?? 0);
    const lastMonthRevenue = Number(lastMonthRevenueResult._sum.total ?? 0);
    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;
    const orderGrowth =
      lastMonthOrders > 0
        ? ((monthlyOrders - lastMonthOrders) / lastMonthOrders) * 100
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        monthlyOrders,
        totalProducts,
        totalCategories,
        totalRevenue,
        monthlyRevenue,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        orderGrowth: Math.round(orderGrowth * 10) / 10,
        recentOrders,
        lowStockVariants,
      },
    });
  } catch (error) {
    console.error("[GET /api/dashboard/stats]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
