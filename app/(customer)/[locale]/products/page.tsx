import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { getActiveBrands } from "@/lib/data/brands";
import type { Product } from "@/types/product";
import { ProductsClient } from "@/components/customer/product/products-client";

export async function generateMetadata() {
  return { title: "Products" };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);

  const category = sp.category as string | undefined;
  const search = sp.search as string | undefined;
  const featured = sp.featured === "true";
  const newArrival = sp.newArrival === "true";
  const sort = (sp.sort as string) ?? "newest";
  const minPrice = sp.minPrice ? parseFloat(sp.minPrice as string) : undefined;
  const maxPrice = sp.maxPrice ? parseFloat(sp.maxPrice as string) : undefined;
  const sizes = sp.sizes ? (sp.sizes as string).split(",").filter(Boolean) : [];
  const colors = sp.colors ? (sp.colors as string).split(",").filter(Boolean) : [];
  const brand = sp.brand as string | undefined;
  const page = parseInt((sp.page as string) ?? "1");
  const limit = 12;

  const where: Record<string, unknown> = { isActive: true };

  if (category) where.categories = { some: { slug: category } };
  if (brand) where.brand = { equals: brand, mode: "insensitive" };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { nameKu: { contains: search, mode: "insensitive" } },
      { nameAr: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
      { categories: { some: { name: { contains: search, mode: "insensitive" } } } },
    ];
  }
  if (featured) where.isFeatured = true;
  if (newArrival) where.isNewArrival = true;
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.basePrice = {
      ...(minPrice !== undefined && { gte: minPrice }),
      ...(maxPrice !== undefined && { lte: maxPrice }),
    };
  }
  if (sizes.length > 0 || colors.length > 0) {
    where.variants = {
      some: {
        ...(sizes.length > 0 && { size: { in: sizes } }),
        ...(colors.length > 0 && { color: { in: colors } }),
        stock: { gt: 0 },
      },
    };
  }

  const orderBy: Record<string, string> =
    sort === "price_asc" ? { basePrice: "asc" } :
    sort === "price_desc" ? { basePrice: "desc" } :
    sort === "featured" ? { isFeatured: "desc" } :
    { createdAt: "desc" };

  const [total, products, categories, brands] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: {
        categories: { select: { id: true, name: true, nameKu: true, nameAr: true, slug: true, imageUrl: true } },
        variants: { select: { stock: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    getActiveBrands(),
  ]);

  return (
    <ProductsClient
      products={products.map(serializeProduct) as unknown as Product[]}
      categories={categories}
      brands={brands}
      total={total}
      page={page}
      limit={limit}
      locale={locale}
    />
  );
}
