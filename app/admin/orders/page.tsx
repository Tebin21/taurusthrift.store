import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { buildOrdersWhere } from "@/lib/data/orders";
import { OrdersTableClient } from "@/components/admin/orders/orders-table-client";

export const metadata = { title: "Orders" };

const PAGE_SIZE = 20;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const t = await getTranslations("orders");
  const { page: pageParam, search, status } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const where = buildOrdersWhere(search, status);

  const [total, rawOrders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: { items: { select: { quantity: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

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
        <p className="text-muted-foreground">{t("totalCount", { count: total })}</p>
      </div>
      <OrdersTableClient
        orders={orders}
        total={total}
        page={page}
        limit={PAGE_SIZE}
        initialSearch={search ?? ""}
        initialStatus={status ?? "ALL"}
      />
    </div>
  );
}
