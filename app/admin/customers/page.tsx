import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { formatIQD } from "@/lib/utils/currency";
import { LtrText } from "@/components/shared/ltr-text";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const t = await getTranslations("customers");
  const customers = await prisma.order.groupBy({
    by: ["customerPhone", "customerName"],
    _count: { id: true },
    _sum: { total: true },
    orderBy: { _count: { id: "desc" } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle", { count: customers.length })}</p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.name")}</th>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.phone")}</th>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.orders")}</th>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.totalSpent")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  {t("empty")}
                </td>
              </tr>
            ) : (
              customers.map((c: any) => (
                <tr key={c.customerPhone} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{c.customerName}</td>
                  <td className="px-4 py-3 text-muted-foreground"><LtrText>{c.customerPhone}</LtrText></td>
                  <td className="px-4 py-3">{c._count.id}</td>
                  <td className="px-4 py-3 font-medium">{formatIQD(Number(c._sum.total ?? 0))}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
