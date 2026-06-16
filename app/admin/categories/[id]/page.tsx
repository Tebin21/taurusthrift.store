"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/shared/image-upload";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CategoryFormPage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("categories");
  const tForm = useTranslations("categories.form");
  const tToast = useTranslations("categories.toast");
  const tCommon = useTranslations("common");
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    nameKu: "",
    nameAr: "",
    description: "",
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    if (!isNew && params.id) {
      fetch(`/api/categories/${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            const { imageUrl: img, ...rest } = data.data;
            setForm(rest);
            if (img) setImageUrl([img]);
          }
        });
    }
  }, [isNew, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isNew ? "/api/categories" : `/api/categories/${params.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl: imageUrl[0] ?? null }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(isNew ? tToast("created") : tToast("updated"));
        router.push("/admin/categories");
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
        <Link href="/admin/categories" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
        <h1 className="text-2xl font-bold">{isNew ? t("addCategory") : t("editCategory")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">{tForm("image")}</CardTitle></CardHeader>
          <CardContent>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              max={1}
              label={tForm("imageOptional")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">{tForm("details")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{tForm("nameEn")}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{tForm("nameKu")}</Label>
                <Input value={form.nameKu} onChange={(e) => setForm({ ...form, nameKu: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>{tForm("nameAr")}</Label>
                <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>{tForm("description")}</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1" placeholder={tForm("descriptionPlaceholder")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{tForm("sortOrder")}</Label>
                <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="mt-1" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
                <Label>{tCommon("active")}</Label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-brand-brown hover:bg-brand-brown-dark text-white" disabled={loading}>
                {loading ? tCommon("saving") : isNew ? tForm("createCategory") : tForm("updateCategory")}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>{tCommon("cancel")}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
