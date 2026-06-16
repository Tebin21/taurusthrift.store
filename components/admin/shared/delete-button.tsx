"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteButtonProps {
  id: string;
  apiPath: string;       // e.g. "/api/categories"
  label: string;         // translated noun for the thing being deleted, e.g. t("categories.entityName")
  size?: "sm" | "icon";
}

export function DeleteButton({ id, apiPath, label, size = "icon" }: DeleteButtonProps) {
  const router = useRouter();
  const t = useTranslations("deleteDialog");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(t("deleted", { label }));
        setOpen(false);
        router.refresh();
      } else {
        toast.error(data.error ?? t("deleteFailed"));
      }
    } catch {
      toast.error(t("deleteFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size={size === "icon" ? "icon" : "sm"}
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !loading && setOpen(false)} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold">{t("title", { label })}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t("body")}
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                {tCommon("cancel")}
              </Button>
              <Button
                size="sm"
                className="bg-destructive hover:bg-destructive/90 text-white"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? tCommon("deleting") : tCommon("delete")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
