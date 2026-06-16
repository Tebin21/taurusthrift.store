import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/products/product-form";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("products");
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: true, categories: { select: { id: true } } },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  const initialData = {
    id: product.id,
    name: product.name,
    nameKu: product.nameKu ?? undefined,
    nameAr: product.nameAr ?? undefined,
    description: product.description ?? undefined,
    descriptionKu: product.descriptionKu ?? undefined,
    descriptionAr: product.descriptionAr ?? undefined,
    basePrice: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
    categoryIds: product.categories.map((c) => c.id),
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    material: product.material ?? undefined,
    brand: product.brand ?? undefined,
    condition: product.condition ?? undefined,
    thumbnailUrl: product.thumbnailUrl ?? undefined,
    images: product.images,
    variants: product.variants.map((v: any) => ({
      size: v.size ?? undefined,
      color: v.color ?? undefined,
      colorHex: v.colorHex ?? undefined,
      sku: v.sku ?? undefined,
      stock: v.stock,
      price: v.price ? Number(v.price) : undefined,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("editProduct")}</h1>
        <p className="text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm categories={categories} initialData={initialData} />
    </div>
  );
}
