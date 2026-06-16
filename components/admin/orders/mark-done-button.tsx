"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function MarkDoneButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const t = useTranslations("orders");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DELIVERED" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(t("markedDone"));
        router.refresh();
      } else {
        toast.error(data.error ?? t("markDoneFailed"));
      }
    } catch {
      toast.error(t("markDoneFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 text-xs"
      disabled={loading}
      onClick={handleClick}
    >
      <Check className="h-3 w-3 me-1" /> {t("markAsDone")}
    </Button>
  );
}
