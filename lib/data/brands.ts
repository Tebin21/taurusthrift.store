import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getActiveBrands = unstable_cache(
  async () => {
    const rows = await prisma.product.findMany({
      where: { isActive: true, brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
    });
    return rows.map((r) => r.brand!).filter(Boolean).sort();
  },
  ["active-brands"],
  { revalidate: 300 }
);

export const getActiveBrandsForCategory = unstable_cache(
  async (categorySlug: string) => {
    const rows = await prisma.product.findMany({
      where: { isActive: true, categories: { some: { slug: categorySlug } }, brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
    });
    return rows.map((r) => r.brand!).filter(Boolean).sort();
  },
  ["active-brands-for-category"],
  { revalidate: 300 }
);
