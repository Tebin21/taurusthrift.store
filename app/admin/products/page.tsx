import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { DeleteProductButton } from "@/components/admin/products/delete-product-button";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const t = await getTranslations("products");
  const tCommon = await getTranslations("common");
  const products = await prisma.product.findMany({
    include: {
      categories: { select: { name: true }, take: 1 },
      variants: { select: { stock: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("totalCount", { count: products.length })}</p>
        </div>
        <Button asChild className="bg-brand-brown hover:bg-brand-brown-dark text-white">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 me-2" />
            {t("addProduct")}
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.product")}</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.category")}</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.price")}</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">{t("table.stock")}</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground">{tCommon("status")}</th>
                <th className="text-end px-4 py-3 font-medium text-muted-foreground">{tCommon("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    {t("empty")}
                  </td>
                </tr>
              ) : (
                products.map((product: any) => {
                  const totalStock = product.variants.reduce((sum: any, v: any) => sum + v.stock, 0);
                  const isLowStock = totalStock > 0 && totalStock <= 5;
                  return (
                    <tr key={product.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.slug}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{product.categories[0]?.name ?? tCommon("none")}</td>
                      <td className="px-4 py-3 font-medium">{formatPrice(Number(product.basePrice))}</td>
                      <td className="px-4 py-3">
                        <span className={isLowStock ? "text-orange-600 font-medium" : ""}>
                          {totalStock === 0 ? (
                            <Badge variant="destructive" className="text-xs">{t("outOfStock")}</Badge>
                          ) : (
                            totalStock
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {product.isActive ? (
                            <Badge className="bg-green-500/15 text-green-400 ring-1 ring-green-500/20 border-0 text-xs">{tCommon("active")}</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">{tCommon("draft")}</Badge>
                          )}
                          {product.isFeatured && <Badge className="text-xs bg-brand-brown text-white border-0">{t("featured")}</Badge>}
                          {product.isNewArrival && <Badge variant="outline" className="text-xs">{t("newArrival")}</Badge>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/admin/products/${product.id}`}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <DeleteProductButton id={product.id} name={product.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
