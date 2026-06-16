import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/products/product-form";

export const metadata = { title: "New Product" };

export default async function NewProductPage() {
  const t = await getTranslations("products");
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("addNewProduct")}</h1>
        <p className="text-muted-foreground">{t("addNewProductHint")}</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
