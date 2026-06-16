"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { useWishlistStore } from "@/store/wishlist.store";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";

type Props = {
  product: Product;
};

export const ProductCard = memo(function ProductCard({ product }: Props) {
  const locale = useLocale();
  const { toggle, has } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isWishlisted = mounted && has(product.id);

  const localizedName =
    (locale === "ku" ? product.nameKu : locale === "ar" ? product.nameAr : null) ?? product.name;

  const totalStock = product.variants?.reduce((s, v) => s + v.stock, 0) ?? 0;
  const isOutOfStock = product.variants?.length ? totalStock === 0 : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <Link href={`/${locale}/products/${product.slug}`} className="block">
        {/* Image */}
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

          {/* Badges */}
          <div className="absolute top-3 start-3 flex flex-col gap-1">
            {product.isNewArrival && (
              <Badge className="bg-brand-brown text-white border-0 text-xs font-semibold tracking-wide">New</Badge>
            )}
            {product.compareAtPrice && (
              <Badge className="bg-red-500 text-white border-0 text-xs font-semibold">Sale</Badge>
            )}
            {isOutOfStock && (
              <Badge variant="secondary" className="text-xs">Sold Out</Badge>
            )}
          </div>

          {/* Wishlist */}
          <button
            type="button"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => { e.preventDefault(); toggle(product.id); }}
            className="absolute top-3 end-3 w-8 h-8 rounded-full bg-white/85 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-all duration-200 shadow-sm hover:scale-110"
          >
            <Heart
              className="w-4 h-4 transition-colors"
              fill={isWishlisted ? "#65000B" : "none"}
              stroke={isWishlisted ? "#65000B" : "currentColor"}
            />
          </button>
        </div>

        {/* Info */}
        <div className="mt-1">
          <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">{product.categories?.[0]?.name}</p>
          <h3 className="font-medium text-sm leading-tight mb-1.5 truncate">{localizedName}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-brand-brown">
              {formatPrice(product.basePrice)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
