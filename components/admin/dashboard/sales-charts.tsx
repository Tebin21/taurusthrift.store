import { prisma } from "@/lib/prisma";
import { SalesChartsClient } from "./sales-charts-client";

export async function SalesCharts() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [recentOrders, ordersByStatus] = await Promise.all([
    prisma.order.findMany({
      where: {
        completedAt: { gte: thirtyDaysAgo },
        status: "DELIVERED",
      },
      select: { completedAt: true, total: true },
      orderBy: { completedAt: "asc" },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  // Aggregate revenue by day
  const dayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const order of recentOrders) {
    if (!order.completedAt) continue;
    const day = order.completedAt.toISOString().slice(0, 10);
    if (dayMap.has(day)) dayMap.set(day, (dayMap.get(day) ?? 0) + Number(order.total));
  }
  const revenueData = Array.from(dayMap.entries()).map(([date, revenue]) => ({
    date: date.slice(5), // "MM-DD"
    revenue: Math.round(revenue * 100) / 100,
  }));

  const statusData = ordersByStatus.map((s: any) => ({
    status: s.status,
    count: s._count.status,
  }));

  return <SalesChartsClient revenueData={revenueData} statusData={statusData} />;
}
