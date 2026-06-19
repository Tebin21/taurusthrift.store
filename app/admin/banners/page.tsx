import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/shared/delete-button";
import type { Banner } from "@/types/banner";

export const metadata = { title: "Banners" };

export default async function AdminBannersPage() {
  const t = await getTranslations("banners");
  const tForm = await getTranslations("banners.form");
  const tCommon = await getTranslations("common");
  const banners = await prisma.banner.findMany({ orderBy: [{ position: "asc" }, { sortOrder: "asc" }] });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button asChild className="bg-brand-brown hover:bg-brand-brown-dark text-white">
          <Link href="/admin/banners/new"><Plus className="h-4 w-4 me-2" />{t("addBanner")}</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner: Banner) => (
          <div key={banner.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            {(banner.imageUrls?.[0] ?? banner.imageUrl) && (
              <div className="relative h-40 bg-muted">
                <Image src={banner.imageUrls?.[0] ?? banner.imageUrl ?? ""} alt={`Banner ${banner.sortOrder}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                {(banner.imageUrls?.length ?? 0) > 1 && (
                  <span className="absolute bottom-2 end-2 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">
                    {banner.imageUrls.length} photos
                  </span>
                )}
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{tForm("sortOrder")}: {banner.sortOrder}</span>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">{t(`positions.${banner.position}`)}</Badge>
                  {banner.isActive ? (
                    <Badge className="text-xs bg-green-500/15 text-green-400 ring-1 ring-green-500/20 border-0">{tCommon("active")}</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">{tCommon("inactive")}</Badge>
                  )}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/admin/banners/${banner.id}`}><Pencil className="h-3 w-3 me-1" />{tCommon("edit")}</Link>
                </Button>
                <DeleteButton id={banner.id} apiPath="/api/banners" label={t("entityName")} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
