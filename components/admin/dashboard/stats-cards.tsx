import { Package, ShoppingCart, TrendingUp, DollarSign, AlertTriangle, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/currency";

async function fetchStats() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/dashboard/stats`, {
    cache: "no-store",
    headers: { Cookie: "" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export async function DashboardStats() {
  const t = await getTranslations("dashboard");
  const { prisma } = await import("@/lib/prisma");
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
    revenueResult,
    monthlyRevenueResult,
    lastMonthRevenueResult,
    lowStockVariants,
    unreadMessages,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: "DELIVERED" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "DELIVERED", completedAt: { gte: startOfMonth } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: "DELIVERED",
        completedAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
    }),
    prisma.productVariant.count({ where: { stock: { gt: 0, lte: 3 } } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  const totalRevenue = Number(revenueResult._sum.total ?? 0);
  const monthlyRevenue = Number(monthlyRevenueResult._sum.total ?? 0);
  const lastMonthRevenue = Number(lastMonthRevenueResult._sum.total ?? 0);
  const revenueGrowth = lastMonthRevenue > 0
    ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : 0;
  const orderGrowth = lastMonthOrders > 0
    ? ((monthlyOrders - lastMonthOrders) / lastMonthOrders) * 100
    : 0;

  const stats = [
    {
      title: t("totalRevenue"),
      value: formatPrice(totalRevenue),
      sub: t("thisMonth", { value: formatPrice(monthlyRevenue) }),
      growth: revenueGrowth,
      icon: DollarSign,
      color: "text-brand-brown",
      iconBg: "bg-brand-brown/10",
    },
    {
      title: t("totalOrders"),
      value: totalOrders.toString(),
      sub: t("thisMonth", { value: String(monthlyOrders) }),
      growth: orderGrowth,
      icon: ShoppingCart,
      color: "text-blue-600",
      iconBg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: t("activeProducts"),
      value: totalProducts.toString(),
      sub: t("lowStockVariants", { count: lowStockVariants }),
      icon: Package,
      color: "text-purple-600",
      iconBg: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      title: t("pendingOrders"),
      value: pendingOrders.toString(),
      sub: t("unreadMessages", { count: unreadMessages }),
      icon: AlertTriangle,
      color: pendingOrders > 0 ? "text-orange-600" : "text-muted-foreground",
      iconBg: pendingOrders > 0 ? "bg-orange-50 dark:bg-orange-950/30" : "bg-muted",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-luxury transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
                {stat.growth !== undefined && (
                  <Badge
                    variant="outline"
                    className={`text-xs px-1.5 py-0 border-0 font-medium ${
                      stat.growth >= 0
                        ? "bg-brand-brown/10 text-brand-brown"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {stat.growth >= 0 ? "+" : ""}
                    {stat.growth.toFixed(1)}%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
