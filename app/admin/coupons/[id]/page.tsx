"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { roundToIQD } from "@/lib/utils/currency";

export default function CouponFormPage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("coupons");
  const tForm = useTranslations("coupons.form");
  const tToast = useTranslations("coupons.toast");
  const tCommon = useTranslations("common");
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minimumOrder: "",
    maximumDiscount: "",
    usageLimit: "",
    isActive: true,
    startsAt: "",
    expiresAt: "",
  });

  useEffect(() => {
    if (!isNew && params.id) {
      fetch(`/api/coupons/${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            const c = data.data;
            setForm({
              ...c,
              discountValue: String(c.discountValue),
              minimumOrder: c.minimumOrder ? String(c.minimumOrder) : "",
              maximumDiscount: c.maximumDiscount ? String(c.maximumDiscount) : "",
              usageLimit: c.usageLimit ? String(c.usageLimit) : "",
              startsAt: c.startsAt ? new Date(c.startsAt).toISOString().slice(0, 10) : "",
              expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 10) : "",
            });
          }
        });
    }
  }, [isNew, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        code: form.code.toUpperCase(),
        discountValue: parseFloat(form.discountValue),
        minimumOrder: form.minimumOrder ? parseFloat(form.minimumOrder) : null,
        maximumDiscount: form.maximumDiscount ? parseFloat(form.maximumDiscount) : null,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
        startsAt: form.startsAt || null,
        expiresAt: form.expiresAt || null,
      };
      const url = isNew ? "/api/coupons" : `/api/coupons/${params.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        toast.success(isNew ? tToast("created") : tToast("updated"));
        router.push("/admin/coupons");
      } else {
        toast.error(data.error ?? tToast("saveFailed"));
      }
    } catch {
      toast.error(tToast("saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/coupons" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5 rtl:rotate-180" /></Link>
        <h1 className="text-2xl font-bold">{isNew ? t("addCoupon") : t("editCoupon")}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle className="text-base">{tForm("details")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{tForm("code")}</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder={tForm("codePlaceholder")} className="mt-1 font-mono uppercase" />
              </div>
              <div>
                <Label>{tForm("discountType")}</Label>
                <Select value={form.discountType} onValueChange={(v) => v && setForm({ ...form, discountType: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">{tForm("percentage")}</SelectItem>
                    <SelectItem value="FIXED">{tForm("fixedAmount")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{tForm("discountValue")}</Label>
                <Input
                  type="number"
                  step="1"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  onBlur={() => {
                    if (form.discountType === "FIXED" && form.discountValue) {
                      setForm((f) => ({ ...f, discountValue: String(roundToIQD(parseFloat(f.discountValue) || 0)) }));
                    }
                  }}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{tForm("minimumOrder")}</Label>
                <Input
                  type="number"
                  step="1"
                  value={form.minimumOrder}
                  onChange={(e) => setForm({ ...form, minimumOrder: e.target.value })}
                  onBlur={() => {
                    if (form.minimumOrder) {
                      setForm((f) => ({ ...f, minimumOrder: String(roundToIQD(parseFloat(f.minimumOrder) || 0)) }));
                    }
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{tForm("maxDiscount")}</Label>
                <Input
                  type="number"
                  step="1"
                  value={form.maximumDiscount}
                  onChange={(e) => setForm({ ...form, maximumDiscount: e.target.value })}
                  onBlur={() => {
                    if (form.maximumDiscount) {
                      setForm((f) => ({ ...f, maximumDiscount: String(roundToIQD(parseFloat(f.maximumDiscount) || 0)) }));
                    }
                  }}
                  className="mt-1"
                  placeholder={tForm("maxDiscountPlaceholder")}
                />
              </div>
              <div>
                <Label>{tForm("usageLimit")}</Label>
                <Input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="mt-1" placeholder={tForm("usageLimitPlaceholder")} />
              </div>
              <div>
                <Label>{tForm("startsAt")}</Label>
                <Input type="date" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>{tForm("expiresAt")}</Label>
                <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>{tForm("description")}</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="mt-1" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label>{tCommon("active")}</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-brand-brown hover:bg-brand-brown-dark text-white" disabled={loading}>
                {loading ? tCommon("saving") : isNew ? tForm("createCoupon") : tForm("updateCoupon")}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>{tCommon("cancel")}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
