import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findUnique({
    where: { slug, isActive: true },
    include: { _count: { select: { products: true } } },
  });
});

export const getActiveCategoriesWithCounts = unstable_cache(
  async () => {
    return prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: "asc" },
    });
  },
  ["active-categories-with-counts"],
  { tags: ["categories"], revalidate: 3600 }
);
