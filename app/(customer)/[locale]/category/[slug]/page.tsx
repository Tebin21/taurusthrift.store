import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { getActiveBrandsForCategory } from "@/lib/data/brands";
import { getCategoryBySlug } from "@/lib/data/categories";
import type { Product } from "@/types/product";
import { CategoryPageClient } from "@/components/customer/category/category-page-client";

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  const locales = ["en", "ku", "ar"];
  return locales.flatMap((locale) =>
    categories.map((cat) => ({ locale, slug: cat.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  const name =
    (locale === "ku" ? category.nameKu : locale === "ar" ? category.nameAr : null) ?? category.name;
  return {
    title: name,
    description: category.description ?? `Browse ${name} at Taurus Thrift`,
    openGraph: { images: category.imageUrl ? [category.imageUrl] : [] },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale, slug }, sp] = await Promise.all([params, searchParams]);

  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const search = sp.search as string | undefined;
  const sort = (sp.sort as string) ?? "newest";
  const minPrice = sp.minPrice ? parseFloat(sp.minPrice as string) : undefined;
  const maxPrice = sp.maxPrice ? parseFloat(sp.maxPrice as string) : undefined;
  const sizes = sp.sizes ? (sp.sizes as string).split(",").filter(Boolean) : [];
  const colors = sp.colors ? (sp.colors as string).split(",").filter(Boolean) : [];
  const brand = sp.brand as string | undefined;
  const page = parseInt((sp.page as string) ?? "1");
  const limit = 12;

  const where: Record<string, unknown> = {
    isActive: true,
    categories: { some: { slug } },
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { nameKu: { contains: search, mode: "insensitive" } },
      { nameAr: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }
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
  if (brand) {
    where.brand = { equals: brand, mode: "insensitive" };
  }

  const orderBy: Record<string, string> =
    sort === "price_asc" ? { basePrice: "asc" } :
    sort === "price_desc" ? { basePrice: "desc" } :
    { createdAt: "desc" };

  const [total, products, brands] = await Promise.all([
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
    getActiveBrandsForCategory(slug),
  ]);

  return (
    <CategoryPageClient
      category={category}
      products={products.map(serializeProduct) as unknown as Product[]}
      total={total}
      page={page}
      limit={limit}
      locale={locale}
      brands={brands}
      activeSizes={sizes}
      activeColors={colors}
      activeBrand={brand ?? ""}
      priceRange={[minPrice ?? 0, maxPrice ?? 200000]}
    />
  );
}
