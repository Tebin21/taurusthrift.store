"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatusSelect } from "./order-status-select";
import { MarkDoneButton } from "./mark-done-button";
import { Search, Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";

const STATUS_OPTIONS = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

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

type Props = {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  initialSearch: string;
  initialStatus: string;
};

export function OrdersTableClient({ orders, total, page, limit, initialSearch, initialStatus }: Props) {
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [exporting, setExporting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const url = new URL(window.location.href);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
        else url.searchParams.delete(key);
      });
      router.push(`${pathname}?${url.searchParams.toString()}`);
    },
    [pathname, router],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ search: search || undefined, page: undefined });
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleStatusChange = (value: string | null) => {
    if (!value) return;
    setStatusFilter(value);
    updateParams({ status: value === "ALL" ? undefined : value, page: undefined });
  };

  const exportCSV = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/orders/export?${params.toString()}`);
      const data = await res.json();
      const allOrders: Order[] = data.success ? data.data : [];

      const header = [t("csv.orderNumber"), t("csv.customer"), t("csv.phone"), t("csv.items"), t("csv.total"), t("csv.status"), t("csv.date")];
      const rows = allOrders.map((o) => [
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
    } finally {
      setExporting(false);
    }
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

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="h-9 w-40 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{t(`statusLabels.${s}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={exportCSV} disabled={exporting} className="ms-auto shrink-0">
          <Download className="h-4 w-4 me-2" /> {t("exportCsv")}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {total} {t("title")}
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
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    {t("noMatch")}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button variant="outline" size="icon" disabled={page <= 1} asChild={page > 1}>
            {page > 1 ? (
              <Link href={`${pathname}?${buildPageQuery(search, statusFilter, page - 1)}`}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="icon"
              asChild
              className={p === page ? "bg-brand-brown hover:bg-brand-brown-dark" : ""}
            >
              <Link href={`${pathname}?${buildPageQuery(search, statusFilter, p)}`}>{p}</Link>
            </Button>
          ))}
          <Button variant="outline" size="icon" disabled={page >= totalPages} asChild={page < totalPages}>
            {page < totalPages ? (
              <Link href={`${pathname}?${buildPageQuery(search, statusFilter, page + 1)}`}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function buildPageQuery(search: string, status: string, page: number) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status !== "ALL") params.set("status", status);
  params.set("page", String(page));
  return params.toString();
}
