import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { OrdersTableClient } from "@/components/admin/orders/orders-table-client";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const t = await getTranslations("orders");
  const rawOrders = await prisma.order.findMany({
    include: { items: { select: { quantity: true } } },
    orderBy: { createdAt: "desc" },
  });

  const orders = rawOrders.map((order: any) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    status: order.status,
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
    itemCount: order.items.reduce((s: number, i: any) => s + i.quantity, 0),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("totalCount", { count: orders.length })}</p>
      </div>
      <OrdersTableClient orders={orders} />
    </div>
  );
}
