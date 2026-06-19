import { cache } from "react";
import { prisma } from "@/lib/prisma";

function startOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export const getDeliveredRevenueTotal = cache(async () => {
  const result = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: "DELIVERED" },
  });
  return Number(result._sum.total ?? 0);
});

export const getMonthlyDeliveredRevenue = cache(async () => {
  const result = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: "DELIVERED", completedAt: { gte: startOfCurrentMonth() } },
  });
  return Number(result._sum.total ?? 0);
});

export const getPendingOrdersCount = cache(async () => {
  return prisma.order.count({ where: { status: "PENDING" } });
});
