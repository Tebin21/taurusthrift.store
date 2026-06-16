import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import type { Product } from "@/types/product";
import { HeroBanner } from "@/components/customer/home/hero-banner";
import { NewArrivalsSection } from "@/components/customer/home/new-arrivals-section";
import { FeaturedSection } from "@/components/customer/home/featured-section";
import { CategoriesSection } from "@/components/customer/home/categories-section";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: "Taurus Thrift — Luxury Thrift Fashion",
    description: "Curated thrift fashion for the discerning eye.",
    alternates: {
      canonical: `/${locale}`,
    },
  };
}

export default async function HomePage() {
  const [banners, newArrivals, featured, categories] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true, position: "HERO" },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
    prisma.product.findMany({
      where: { isActive: true, isNewArrival: true },
      include: { categories: { select: { name: true, slug: true } }, variants: { select: { stock: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { categories: { select: { name: true, slug: true } }, variants: { select: { stock: true } } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div>
      <HeroBanner banners={banners} />
      <NewArrivalsSection products={newArrivals.map(serializeProduct) as unknown as Product[]} />
      <FeaturedSection products={featured.map(serializeProduct) as unknown as Product[]} />
      <CategoriesSection categories={categories} />
    </div>
  );
}
