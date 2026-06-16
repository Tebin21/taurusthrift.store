import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Prisma returns Decimal objects for numeric fields; convert to plain number for serialization.
export function serializeProduct<
  T extends {
    basePrice: unknown;
    compareAtPrice?: unknown;
    variants?: Array<Record<string, unknown>>;
  }
>(p: T) {
  return {
    ...p,
    basePrice: Number(p.basePrice),
    compareAtPrice: p.compareAtPrice != null ? Number(p.compareAtPrice) : null,
    variants: p.variants?.map((v) => ({
      ...v,
      price: v.price != null ? Number(v.price) : null,
    })),
  };
}
