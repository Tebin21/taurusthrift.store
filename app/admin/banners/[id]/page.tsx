"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/shared/image-upload";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BannerFormPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const t = useTranslations("banners");
  const tForm = useTranslations("banners.form");
  const tToast = useTranslations("banners.toast");
  const tCommon = useTranslations("common");
  const isNew = pathname.endsWith("/new");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "", titleKu: "", titleAr: "",
    subtitle: "", subtitleKu: "", subtitleAr: "",
    linkUrl: "", linkText: "",
    position: "HERO", sortOrder: 0, isActive: true,
    startsAt: "", expiresAt: "",
  });

  useEffect(() => {
    if (!isNew && params.id) {
      fetch(`/api/banners?admin=1`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            const b = data.data.find((b: { id: string }) => b.id === params.id);
            if (b) {
              const { imageUrl: img, ...rest } = b;
              setForm({
                ...rest,
                startsAt: b.startsAt ? new Date(b.startsAt).toISOString().slice(0, 10) : "",
                expiresAt: b.expiresAt ? new Date(b.expiresAt).toISOString().slice(0, 10) : "",
              });
              if (img) setImageUrl([img]);
            }
          }
        });
    }
  }, [isNew, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl[0]) {
      toast.error(tToast("imageRequired"));
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        imageUrl: imageUrl[0],
        startsAt: form.startsAt || null,
        expiresAt: form.expiresAt || null,
      };
      const url = isNew ? "/api/banners" : `/api/banners/${params.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { toast.success(tToast("saved")); router.push("/admin/banners"); }
      else toast.error(data.error ?? tToast("saveFailed"));
    } catch { toast.error(tToast("saveFailed")); }
    finally { setLoading(false); }
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/banners" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5 rtl:rotate-180" /></Link>
        <h1 className="text-2xl font-bold">{isNew ? t("addBanner") : t("editBanner")}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">{tForm("image")}</CardTitle></CardHeader>
          <CardContent>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              max={1}
              label={tForm("imageLabel")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">{tForm("details")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div><Label>{tForm("titleEn")}</Label><Input value={form.title} onChange={f("title")} required className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{tForm("titleKu")}</Label><Input value={form.titleKu} onChange={f("titleKu")} className="mt-1" /></div>
                <div><Label>{tForm("titleAr")}</Label><Input value={form.titleAr} onChange={f("titleAr")} className="mt-1" /></div>
              </div>
              <div><Label>{tForm("subtitle")}</Label><Input value={form.subtitle} onChange={f("subtitle")} className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{tForm("linkUrl")}</Label><Input value={form.linkUrl} onChange={f("linkUrl")} className="mt-1" /></div>
                <div><Label>{tForm("linkText")}</Label><Input value={form.linkText} onChange={f("linkText")} className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{tForm("position")}</Label>
                  <Select value={form.position} onValueChange={(v) => v && setForm({ ...form, position: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HERO">{t("positions.HERO")}</SelectItem>
                      <SelectItem value="SECONDARY">{t("positions.SECONDARY")}</SelectItem>
                      <SelectItem value="PROMOTIONAL">{t("positions.PROMOTIONAL")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>{tForm("sortOrder")}</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{tForm("startsAt")}</Label><Input type="date" value={form.startsAt} onChange={f("startsAt")} className="mt-1" /></div>
                <div><Label>{tForm("expiresAt")}</Label><Input type="date" value={form.expiresAt} onChange={f("expiresAt")} className="mt-1" /></div>
              </div>
              <div className="flex items-center gap-3"><Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} /><Label>{tCommon("active")}</Label></div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-brand-brown hover:bg-brand-brown-dark text-white" disabled={loading}>{loading ? tCommon("saving") : tForm("saveBanner")}</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>{tCommon("cancel")}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
