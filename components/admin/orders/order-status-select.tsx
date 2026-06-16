"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const t = useTranslations("orders");
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: string | null) => {
    if (!newStatus) return;
    setLoading(true);
    setStatus(newStatus);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(t("statusUpdated"));
        router.refresh();
      } else {
        setStatus(currentStatus);
        toast.error(data.error ?? t("statusUpdateFailed"));
      }
    } catch {
      setStatus(currentStatus);
      toast.error(t("statusUpdateFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select value={status} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="h-7 w-32 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            {t(`statusLabels.${s}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
