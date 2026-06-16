"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Minus, Plus, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductImageGallery } from "./product-image-gallery";
import { VariantSelector } from "./variant-selector";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductCard } from "./product-card";
import { formatPrice } from "@/lib/utils/currency";
import { useRecentlyViewedStore } from "@/store/recently-viewed.store";
import type { Product, ProductVariant } from "@/types/product";

type Props = {
  product: Product;
  related: Product[];
  locale: string;
};

export function ProductDetailClient({ product, related, locale }: Props) {
  const t = useTranslations();
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.add);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] ?? null,
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [product.id, addRecentlyViewed]);

  const localName =
    (locale === "ku" ? product.nameKu : locale === "ar" ? product.nameAr : null) ?? product.name;
  const localDesc =
    (locale === "ku" ? product.descriptionKu : locale === "ar" ? product.descriptionAr : null) ??
    product.description;

  const price = Number(selectedVariant?.price ?? product.basePrice);
  const comparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const maxQty = selectedVariant?.stock ?? 99;

  const images =
    product.images?.length
      ? product.images
      : product.thumbnailUrl
      ? [product.thumbnailUrl]
      : [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: localName, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href={`/${locale}`} className="hover:text-brand-brown transition-colors">{t("nav.home")}</Link>
        <span>/</span>
        <Link href={`/${locale}/products`} className="hover:text-brand-brown transition-colors">{t("nav.shop")}</Link>
        {product.categories?.[0] && (
          <>
            <span>/</span>
            <Link
              href={`/${locale}/category/${product.categories[0].slug}`}
              className="hover:text-brand-brown transition-colors"
            >
              {(locale === "ku" ? product.categories[0].nameKu : locale === "ar" ? product.categories[0].nameAr : null) ?? product.categories[0].name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground truncate max-w-[80px] sm:max-w-[120px]">{localName}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Left: Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProductImageGallery images={images} name={localName} />
        </motion.div>

        {/* Right: Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Category + badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.categories?.map((cat) => (
              <Badge key={cat.id} variant="secondary" className="text-xs">
                {(locale === "ku" ? cat.nameKu : locale === "ar" ? cat.nameAr : null) ?? cat.name}
              </Badge>
            ))}
            {product.isNewArrival && (
              <Badge className="bg-brand-brown text-white border-0 text-xs">New</Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-brand-accent/20 text-brand-accent ring-1 ring-brand-accent/30 border-0 text-xs">Featured</Badge>
            )}
          </div>

          {/* Name */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold leading-tight tracking-tight">{localName}</h1>
            {product.brand && (
              <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl md:text-3xl font-bold text-brand-brown">{formatPrice(price)}</span>
            {comparePrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(comparePrice)}</span>
                <Badge className="bg-red-500 text-white border-0 text-xs">
                  -{Math.round(((comparePrice - price) / comparePrice) * 100)}%
                </Badge>
              </>
            )}
          </div>

          <Separator />

          {/* Variants */}
          {(product.variants?.length ?? 0) > 0 && (
            <VariantSelector
              variants={product.variants ?? []}
              selectedId={selectedVariant?.id ?? null}
              onChange={setSelectedVariant}
            />
          )}

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium mb-2">{t("product.quantity")}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-lg border flex items-center justify-center hover:border-brand-brown transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                className="w-9 h-9 rounded-lg border flex items-center justify-center hover:border-brand-brown transition-colors"
                disabled={quantity >= maxQty}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <AddToCartButton product={product} variant={selectedVariant} quantity={quantity} />

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>

          <Separator />

          {/* Description */}
          {localDesc && (
            <div>
              <p className="text-sm font-medium mb-2">{t("product.description")}</p>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{localDesc}</p>
            </div>
          )}

          {/* Meta */}
          <div className="space-y-1.5 text-sm text-muted-foreground">
            {product.material && <p><span className="text-foreground font-medium">Material:</span> {product.material}</p>}
            {product.condition && <p><span className="text-foreground font-medium">Condition:</span> {product.condition}</p>}
          </div>
        </motion.div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold mb-8">{t("product.related")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
