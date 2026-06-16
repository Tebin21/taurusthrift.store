import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const LOCALES = ["en", "ar", "ku"];
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    { url: `${appUrl}/${locale}`, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${appUrl}/${locale}/products`, changeFrequency: "daily" as const, priority: 0.9 },
  ]);

  const productRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    products.map((p: { slug: string; updatedAt: Date }) => ({
      url: `${appUrl}/${locale}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  const categoryRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    categories.map((c: { slug: string }) => ({
      url: `${appUrl}/${locale}/products?category=${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
