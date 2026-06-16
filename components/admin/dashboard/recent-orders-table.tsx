import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/currency";
import { ArrowRight } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/20",
  CONFIRMED: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20",
  PROCESSING: "bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/20",
  SHIPPED: "bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/20",
  DELIVERED: "bg-green-500/15 text-green-400 ring-1 ring-green-500/20",
  CANCELLED: "bg-red-500/15 text-red-400 ring-1 ring-red-500/20",
  REFUNDED: "bg-white/8 text-white/50 ring-1 ring-white/12",
};

export async function RecentOrders() {
  const t = await getTranslations("dashboard");
  const tCommon = await getTranslations("common");
  const tOrders = await getTranslations("orders");
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{t("recentOrders")}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders" className="flex items-center gap-1">
            {tCommon("viewAll")} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("noOrdersYet")}</p>
          ) : (
            orders.map((order: any) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between py-3 hover:bg-accent/50 px-2 rounded-md transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground truncate">{order.customerName}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ms-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] ?? ""}`}
                  >
                    {tOrders(`statusLabels.${order.status}`)}
                  </span>
                  <span className="text-sm font-semibold">{formatPrice(Number(order.total))}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
