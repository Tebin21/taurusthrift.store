"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatusSelect } from "./order-status-select";
import { MarkDoneButton } from "./mark-done-button";
import { Search, Download, X } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";

const STATUS_OPTIONS = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/20",
  CONFIRMED: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20",
  PROCESSING: "bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/20",
  SHIPPED: "bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/20",
  DELIVERED: "bg-green-500/15 text-green-400 ring-1 ring-green-500/20",
  CANCELLED: "bg-red-500/15 text-red-400 ring-1 ring-red-500/20",
  REFUNDED: "bg-white/8 text-white/50 ring-1 ring-white/12",
};

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  status: string;
  total: number;
  createdAt: string;
  itemCount: number;
};

export function OrdersTableClient({ orders }: { orders: Order[] }) {
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !search ||
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerPhone.includes(search);
      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const exportCSV = () => {
    const header = [t("csv.orderNumber"), t("csv.customer"), t("csv.phone"), t("csv.items"), t("csv.total"), t("csv.status"), t("csv.date")];
    const rows = filtered.map((o) => [
      o.orderNumber,
      o.customerName,
      o.customerPhone,
      o.itemCount,
      `${Number(o.total)} IQD`,
      t(`statusLabels.${o.status}`),
      new Date(o.createdAt).toLocaleDateString(),
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="ps-9 pe-8 h-9"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute end-2 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
          <SelectTrigger className="h-9 w-40 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{t(`statusLabels.${s}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={exportCSV} className="ms-auto shrink-0">
          <Download className="h-4 w-4 me-2" /> {t("exportCsv")}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} {tCommon("of")} {orders.length} {t("title")}
      </p>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.order")}</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.customer")}</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.items")}</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">{tCommon("total")}</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">{tCommon("status")}</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">{tCommon("date")}</th>
                <th className="text-end px-4 py-3 font-medium text-muted-foreground">{tCommon("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    {t("noMatch")}
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{order.itemCount}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="flex items-center justify-end gap-3">
                        {!["DELIVERED", "CANCELLED", "REFUNDED"].includes(order.status) && (
                          <MarkDoneButton orderId={order.id} />
                        )}
                        <Link href={`/admin/orders/${order.id}`} className="text-xs text-brand-brown hover:underline">
                          {tCommon("view")}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
