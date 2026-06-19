"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils/currency";
import { useFavoritesStore } from "@/store/favorites.store";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
};

export function FavoriteProductCard({ product }: Props) {
  const locale = useLocale();
  const t = useTranslations("favorites");
  const toggle = useFavoritesStore((s) => s.toggle);

  const localizedName =
    (locale === "ku" ? product.nameKu : locale === "ar" ? product.nameAr : null) ?? product.name;

  return (
    <div className="group">
      <Link href={`/${locale}/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-beige dark:bg-muted mb-3 transition-shadow duration-300 group-hover:shadow-luxury-hover">
          {product.thumbnailUrl || product.images?.[0] ? (
            <Image
              src={product.thumbnailUrl ?? product.images[0]}
              alt={localizedName}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl opacity-20">👗</span>
            </div>
          )}
        </div>

        <div className="mt-1">
          <h3 className="font-medium text-sm leading-tight mb-1.5 truncate">{localizedName}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-brand-brown">{formatPrice(product.basePrice)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-3 flex flex-col gap-2">
        <Button asChild className="bg-brand-brown hover:bg-brand-brown-dark text-white w-full">
          <Link href={`/${locale}/products/${product.slug}`}>{t("viewProduct")}</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => toggle(product.id)}
        >
          {t("remove")}
        </Button>
      </div>
    </div>
  );
}
