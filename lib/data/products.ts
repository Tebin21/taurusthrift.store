import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      categories: {
        select: { id: true, name: true, nameKu: true, nameAr: true, slug: true, imageUrl: true },
      },
      variants: { orderBy: [{ size: "asc" }, { color: "asc" }] },
    },
  });
});
