import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { formatIQD } from "@/lib/utils/currency";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const customers = await prisma.order.groupBy({
    by: ["customerPhone", "customerName"],
    _count: { id: true },
    _sum: { total: true },
    orderBy: { _count: { id: "desc" } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Customer information from orders ({customers.length} unique customers)</p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">Phone</th>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">Orders</th>
              <th className="text-start px-4 py-3 font-medium text-muted-foreground">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No customers yet
                </td>
              </tr>
            ) : (
              customers.map((c: any) => (
                <tr key={c.customerPhone} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{c.customerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.customerPhone}</td>
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
