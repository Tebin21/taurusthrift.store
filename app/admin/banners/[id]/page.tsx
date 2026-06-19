"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [form, setForm] = useState({ sortOrder: 0, isActive: true });

  useEffect(() => {
    if (!isNew && params.id) {
      fetch(`/api/banners?admin=1`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            const b = data.data.find((b: { id: string }) => b.id === params.id);
            if (b) {
              setForm({ sortOrder: b.sortOrder ?? 0, isActive: b.isActive ?? true });
              if (b.imageUrls && b.imageUrls.length > 0) setImageUrls(b.imageUrls);
              else if (b.imageUrl) setImageUrls([b.imageUrl]);
            }
          }
        });
    }
  }, [isNew, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
      toast.error(tToast("imageRequired"));
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, imageUrls };
      const url = isNew ? "/api/banners" : `/api/banners/${params.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(tToast("saved"));
        router.push("/admin/banners");
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
        <Link href="/admin/banners" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
        <h1 className="text-2xl font-bold">{isNew ? t("addBanner") : t("editBanner")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{tForm("image")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={imageUrls}
              onChange={setImageUrls}
              max={5}
              aspect={16 / 10}
              folder="banners"
              label={tForm("imageLabel")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{tForm("details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{tForm("sortOrder")}</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                className="mt-1 w-32"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm({ ...form, isActive: v })}
              />
              <Label>{tCommon("active")}</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="bg-brand-brown hover:bg-brand-brown-dark text-white"
                disabled={loading}
              >
                {loading ? tCommon("saving") : tForm("saveBanner")}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {tCommon("cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
