import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { formatPrice } from "@/lib/utils/currency";
import { CheckCircle, Package, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { locale, orderId } = await params;
  const t = await getTranslations({ locale, namespace: "confirmation" });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/15 ring-1 ring-green-500/20 mb-4">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
        <p className="mt-3 text-sm">
          {t("orderNumber")}: <span className="font-mono font-semibold">{order.orderNumber}</span>
        </p>
      </div>

      {/* Order details */}
      <div className="rounded-xl border bg-card p-6 space-y-6">
        {/* Customer info */}
        <div className="space-y-2">
          <h2 className="font-semibold">{t("customerInfo")}</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 mt-0.5 text-brand-brown shrink-0" />
              <span>{order.customerName}</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 text-brand-brown shrink-0" />
              <span dir="ltr">{order.customerPhone}</span>
            </div>
            <div className="flex items-start gap-2 sm:col-span-2">
              <MapPin className="h-4 w-4 mt-0.5 text-brand-brown shrink-0" />
              <span>{order.customerAddress}{order.customerCity ? `, ${order.customerCity}` : ""}</span>
            </div>
          </div>
          {order.customerNotes && (
            <p className="text-sm text-muted-foreground italic">"{order.customerNotes}"</p>
          )}
        </div>

        <Separator />

        {/* Items */}
        <div className="space-y-3">
          <h2 className="font-semibold">{t("items")}</h2>
          {order.items.map((item: { id: string; productName: string; variantInfo: string | null; quantity: number; price: unknown }) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{item.productName}</p>
                {item.variantInfo && (
                  <p className="text-xs text-muted-foreground">{item.variantInfo}</p>
                )}
                <p className="text-xs text-muted-foreground">× {item.quantity}</p>
              </div>
              <span className="font-semibold">{formatPrice(Number(item.price) * item.quantity)}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("subtotal")}</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          {Number(order.discountAmount) > 0 && (
            <div className="flex justify-between text-green-400">
              <span>{t("discount")} {order.couponCode && `(${order.couponCode})`}</span>
              <span>-{formatPrice(Number(order.discountAmount))}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-1">
            <span>{t("total")}</span>
            <span className="text-brand-brown">{formatPrice(Number(order.total))}</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-500 text-white border-0">{order.status}</Badge>
          <span className="text-xs text-muted-foreground">{t("statusNote")}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button asChild className="flex-1 bg-brand-brown hover:bg-brand-brown-dark text-white">
          <Link href={`/${locale}/products`}>{t("continueShopping")}</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/${locale}`}>{t("backHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
