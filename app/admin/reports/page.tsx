import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/currency";

export const metadata = { title: "Reports" };

export default async function AdminReportsPage() {
  const t = await getTranslations("reports");
  const tCommon = await getTranslations("common");
  const now = new Date();

  // Last 6 months data
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleString("default", { month: "short", year: "numeric" }),
      start: new Date(d.getFullYear(), d.getMonth(), 1),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 0),
    };
  }).reverse();

  const monthlyData = await Promise.all(
    months.map(async (m) => {
      const [orders, revenue] = await Promise.all([
        prisma.order.count({
          where: { completedAt: { gte: m.start, lte: m.end }, status: "DELIVERED" },
        }),
        prisma.order.aggregate({
          _sum: { total: true },
          where: { completedAt: { gte: m.start, lte: m.end }, status: "DELIVERED" },
        }),
      ]);
      return { ...m, orders, revenue: Number(revenue._sum.total ?? 0) };
    })
  );

  const [topProducts, lowStock] = await Promise.all([
    prisma.orderItem.groupBy({
      by: ["productName"],
      where: { order: { status: "DELIVERED" } },
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    }),
    prisma.productVariant.findMany({
      where: { stock: { gt: 0, lte: 5 } },
      include: { product: { select: { name: true } } },
      orderBy: { stock: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Monthly table */}
      <Card>
        <CardHeader><CardTitle className="text-base">{t("monthlyRevenue")}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-start py-2 font-medium text-muted-foreground">{t("table.month")}</th>
                  <th className="text-start py-2 font-medium text-muted-foreground">{t("table.orders")}</th>
                  <th className="text-start py-2 font-medium text-muted-foreground">{t("table.revenue")}</th>
                  <th className="text-start py-2 font-medium text-muted-foreground">{t("table.avgOrder")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {monthlyData.map((m) => (
                  <tr key={m.label}>
                    <td className="py-2 font-medium">{m.label}</td>
                    <td className="py-2">{m.orders}</td>
                    <td className="py-2 font-semibold text-brand-brown">{formatPrice(m.revenue)}</td>
                    <td className="py-2 text-muted-foreground">{m.orders > 0 ? formatPrice(m.revenue / m.orders) : tCommon("none")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top products */}
        <Card>
          <CardHeader><CardTitle className="text-base">{t("topSelling")}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topProducts.map((p: any, i: number) => (
                <div key={p.productName} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-muted-foreground text-xs">{i + 1}.</span>
                    <span className="truncate max-w-[180px]">{p.productName}</span>
                  </div>
                  <span className="text-muted-foreground shrink-0">{t("sold", { count: p._sum.quantity ?? 0 })}</span>
                </div>
              ))}
              {topProducts.length === 0 && <p className="text-muted-foreground text-sm">{t("noSalesData")}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Low stock */}
        <Card>
          <CardHeader><CardTitle className="text-base">{t("lowStockAlert")}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStock.map((v: any) => (
                <div key={v.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium truncate max-w-[180px]">{v.product.name}</p>
                    {(v.size || v.color) && (
                      <p className="text-xs text-muted-foreground">{[v.size, v.color].filter(Boolean).join(" / ")}</p>
                    )}
                  </div>
                  <span className={`font-semibold ${v.stock <= 2 ? "text-red-500" : "text-orange-500"}`}>
                    {t("left", { count: v.stock })}
                  </span>
                </div>
              ))}
              {lowStock.length === 0 && <p className="text-muted-foreground text-sm">{t("noLowStock")}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
