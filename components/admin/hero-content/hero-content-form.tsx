"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

type HeroContentFormProps = {
  id: string | null;
  initialData: { titleEn: string; titleKu: string; titleAr: string };
};

export function HeroContentForm({ id, initialData }: HeroContentFormProps) {
  const t = useTranslations("heroContent");
  const tCommon = useTranslations("common");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/hero-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(t("toast.saved"));
      } else {
        toast.error(data.error ?? t("toast.saveFailed"));
      }
    } catch {
      toast.error(t("toast.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("title")}</CardTitle>
            <CardDescription className="text-sm">{t("subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="titleEn">{t("titleEn")}</Label>
              <Input
                id="titleEn"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="Life Is A Woman"
                className="mt-1"
                dir="ltr"
              />
            </div>
            <div>
              <Label htmlFor="titleKu">{t("titleKu")}</Label>
              <Input
                id="titleKu"
                value={form.titleKu}
                onChange={(e) => setForm({ ...form, titleKu: e.target.value })}
                placeholder="ژیان بە شێوازی خۆت بژی"
                className="mt-1"
                dir="rtl"
              />
            </div>
            <div>
              <Label htmlFor="titleAr">{t("titleAr")}</Label>
              <Input
                id="titleAr"
                value={form.titleAr}
                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                placeholder="عيشي بأسلوبك الخاص"
                className="mt-1"
                dir="rtl"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="bg-brand-brown hover:bg-brand-brown-dark text-white"
                disabled={saving}
              >
                {saving ? tCommon("saving") : tCommon("save")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
