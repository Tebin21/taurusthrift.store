"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMarkRead = async () => {
    setLoading(true);
    try {
      await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      router.refresh();
    } catch {
      toast.error("Failed to mark as read");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" className="text-xs h-7" onClick={handleMarkRead} disabled={loading}>
      Mark read
    </Button>
  );
}
