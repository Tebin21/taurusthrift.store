import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import type { Product } from "@/types/product";
import { ProductDetailClient } from "@/components/customer/product/product-detail-client";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return ["en", "ar", "ku"].flatMap((locale) =>
    products.map((p: { slug: string }) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { categories: { select: { name: true }, take: 1 } },
  });
  if (!product) return { title: "Not Found" };

  const title = product.name;
  const description = product.description ?? `${product.name} — Taurus Thrift`;
  const imageUrl = product.thumbnailUrl ?? (product.images as string[])[0] ?? undefined;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website" as const,
      url: `${appUrl}/${locale}/products/${slug}`,
      ...(imageUrl && { images: [{ url: imageUrl, width: 800, height: 1067, alt: title }] }),
    },
    alternates: {
      languages: {
        en: `${appUrl}/en/products/${slug}`,
        ar: `${appUrl}/ar/products/${slug}`,
        ku: `${appUrl}/ku/products/${slug}`,
      },
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      categories: { select: { id: true, name: true, nameKu: true, nameAr: true, slug: true, imageUrl: true } },
      variants: { orderBy: [{ size: "asc" }, { color: "asc" }] },
    },
  });

  if (!product) notFound();

  // Related products: share at least one category
  const categoryIds = product.categories.map((c) => c.id);
  const related = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      isActive: true,
      categories: categoryIds.length > 0 ? { some: { id: { in: categoryIds } } } : undefined,
    },
    include: { categories: { select: { id: true, name: true, nameKu: true, nameAr: true, slug: true, imageUrl: true } }, variants: true },
    take: 4,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: product.thumbnailUrl
      ? [product.thumbnailUrl, ...(product.images as string[])]
      : (product.images as string[]),
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      price: Number(product.basePrice),
      priceCurrency: "IQD",
      availability:
        (product as any).variants?.some((v: any) => v.stock > 0)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={serializeProduct(product) as unknown as Product} related={related.map(serializeProduct) as unknown as Product[]} locale={locale} />
    </>
  );
}
