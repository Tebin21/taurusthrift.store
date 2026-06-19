import { DollarSign, CheckCircle2, Clock, XCircle, CalendarDays, CalendarClock, Trophy } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/currency";
import { getDeliveredRevenueTotal, getMonthlyDeliveredRevenue, getPendingOrdersCount } from "@/lib/data/dashboard";

export async function AccountingSection() {
  const t = await getTranslations("dashboard.accounting");
  const { prisma } = await import("@/lib/prisma");
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalRevenue,
    revenueTodayResult,
    monthlyRevenue,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    bestSellers,
  ] = await Promise.all([
    getDeliveredRevenueTotal(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: "DELIVERED", completedAt: { gte: startOfDay } } }),
    getMonthlyDeliveredRevenue(),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    getPendingOrdersCount(),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.orderItem.groupBy({
      by: ["productName"],
      where: { order: { status: "DELIVERED" } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const cards = [
    {
      title: t("totalRevenue"),
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "text-brand-brown",
      iconBg: "bg-brand-brown/10",
    },
    {
      title: t("revenueToday"),
      value: formatPrice(Number(revenueTodayResult._sum.total ?? 0)),
      icon: CalendarClock,
      color: "text-emerald-600",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      title: t("revenueThisMonth"),
      value: formatPrice(monthlyRevenue),
      icon: CalendarDays,
      color: "text-blue-600",
      iconBg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: t("completedOrders"),
      value: completedOrders.toString(),
      icon: CheckCircle2,
      color: "text-green-600",
      iconBg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: t("pendingOrders"),
      value: pendingOrders.toString(),
      icon: Clock,
      color: "text-orange-600",
      iconBg: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      title: t("cancelledOrders"),
      value: cancelledOrders.toString(),
      icon: XCircle,
      color: "text-red-600",
      iconBg: "bg-red-50 dark:bg-red-950/30",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((stat) => {
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Trophy className="h-4 w-4 text-brand-brown" />
          <CardTitle className="text-base">{t("bestSelling")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {bestSellers.map((p, i) => (
              <div key={p.productName} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-muted-foreground text-xs">{i + 1}.</span>
                  <span className="truncate max-w-[220px]">{p.productName}</span>
                </div>
                <span className="text-muted-foreground shrink-0">{t("sold", { count: p._sum.quantity ?? 0 })}</span>
              </div>
            ))}
            {bestSellers.length === 0 && (
              <p className="text-muted-foreground text-sm">{t("noSales")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
