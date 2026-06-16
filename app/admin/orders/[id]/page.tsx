import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils/currency";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusSelect } from "@/components/admin/orders/order-status-select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Order ${id}` };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("orders.detail");
  const tCommon = await getTranslations("common");
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, coupon: true },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="ms-auto">
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">{t("customerInfo")}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">{t("name")}</span> <span className="font-medium ms-2">{order.customerName}</span></div>
            <div><span className="text-muted-foreground">{t("phone")}</span> <span className="font-medium ms-2">{order.customerPhone}</span></div>
            <div><span className="text-muted-foreground">{t("address")}</span> <span className="font-medium ms-2">{order.customerAddress}</span></div>
            {order.customerCity && <div><span className="text-muted-foreground">{t("city")}</span> <span className="font-medium ms-2">{order.customerCity}</span></div>}
            {order.customerNotes && (
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground mb-1">{t("notes")}</p>
                <p>{order.customerNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">{t("orderSummary")}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("subtotal")}</span><span>{formatPrice(Number(order.subtotal))}</span></div>
            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{t("discount")} {order.couponCode && `(${order.couponCode})`}</span>
                <span>-{formatPrice(Number(order.discountAmount))}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-base border-t border-border pt-2 mt-2">
              <span>{tCommon("total")}</span>
              <span className="text-brand-brown">{formatPrice(Number(order.total))}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{t("orderItems")}</CardTitle></CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-sm">{item.productName}</p>
                  {item.variantInfo && <p className="text-xs text-muted-foreground">{item.variantInfo}</p>}
                </div>
                <div className="text-sm text-end">
                  <p>{item.quantity} × {formatPrice(Number(item.price))}</p>
                  <p className="font-semibold">{formatPrice(Number(item.price) * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
