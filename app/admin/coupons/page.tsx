import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/shared/delete-button";
import { formatPrice } from "@/lib/utils/currency";

export const metadata = { title: "Coupons" };

export default async function AdminCouponsPage() {
  const t = await getTranslations("coupons");
  const tCommon = await getTranslations("common");
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("totalCount", { count: coupons.length })}</p>
        </div>
        <Button asChild className="bg-brand-brown hover:bg-brand-brown-dark text-white">
          <Link href="/admin/coupons/new"><Plus className="h-4 w-4 me-2" />{t("addCoupon")}</Link>
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.code")}</th>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.discount")}</th>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.minOrder")}</th>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.usage")}</th>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.expires")}</th>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">{tCommon("status")}</th>
              <th className="text-end px-4 py-3 font-medium text-muted-foreground">{tCommon("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coupons.map((coupon: any) => {
              const expired = coupon.expiresAt && coupon.expiresAt < new Date();
              const limitReached = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit;
              return (
                <tr key={coupon.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono font-semibold">{coupon.code}</td>
                  <td className="px-4 py-3">
                    {coupon.discountType === "PERCENTAGE"
                      ? `${coupon.discountValue}%`
                      : formatPrice(Number(coupon.discountValue))}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {coupon.minimumOrder ? formatPrice(Number(coupon.minimumOrder)) : tCommon("none")}
                  </td>
                  <td className="px-4 py-3">
                    {coupon.usageCount} / {coupon.usageLimit ?? "∞"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : tCommon("never")}
                  </td>
                  <td className="px-4 py-3">
                    {!coupon.isActive || expired || limitReached ? (
                      <Badge variant="secondary" className="text-xs">{tCommon("inactive")}</Badge>
                    ) : (
                      <Badge className="text-xs bg-green-500/15 text-green-400 ring-1 ring-green-500/20 border-0">{tCommon("active")}</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/admin/coupons/${coupon.id}`}><Pencil className="h-3.5 w-3.5" /></Link>
                      </Button>
                      <DeleteButton id={coupon.id} apiPath="/api/coupons" label={t("entityName")} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
