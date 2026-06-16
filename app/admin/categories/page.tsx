import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, ExternalLink, Tag } from "lucide-react";
import { DeleteButton } from "@/components/admin/shared/delete-button";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const t = await getTranslations("categories");
  const tCommon = await getTranslations("common");
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("totalCount", { count: categories.length })}</p>
        </div>
        <Button asChild className="bg-brand-brown hover:bg-brand-brown-dark text-white">
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4 me-2" /> {t("addCategory")}
          </Link>
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
          <Tag className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">{t("empty")}</p>
          <p className="text-sm text-muted-foreground/60 mt-1 mb-4">{t("createFirstHint")}</p>
          <Button asChild className="bg-brand-brown hover:bg-brand-brown-dark text-white">
            <Link href="/admin/categories/new"><Plus className="h-4 w-4 me-2" /> {t("addCategory")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat: any) => (
            <div key={cat.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative h-32 bg-brand-beige dark:bg-muted">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Tag className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute top-2 end-2">
                  {cat.isActive ? (
                    <Badge className="text-xs bg-green-500/15 text-green-400 ring-1 ring-green-500/20 border-0">{tCommon("active")}</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">{tCommon("inactive")}</Badge>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold">{cat.name}</h3>
                  <span className="text-xs text-muted-foreground">#{cat.sortOrder}</span>
                </div>
                {cat.nameKu && (
                  <p className="text-xs text-muted-foreground">{cat.nameKu} / {cat.nameAr}</p>
                )}
                {cat.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="font-medium text-foreground">{t("productsCount", { count: cat._count.products })}</span>
                </p>

                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/admin/categories/${cat.id}`}>
                      <Pencil className="h-3 w-3 me-1" /> {tCommon("edit")}
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="px-2">
                    <Link href={`/en/category/${cat.slug}`} target="_blank" title={t("viewOnSite")}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <DeleteButton id={cat.id} apiPath="/api/categories" label={t("entityName")} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
