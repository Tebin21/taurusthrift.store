"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/favorites.store";
import { FavoriteProductCard } from "@/components/customer/favorites/favorite-product-card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

export default function FavoritesPage() {
  const t = useTranslations("favorites");
  const locale = useLocale();
  const { items, clear } = useFavoritesStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      return;
    }
    setLoading(true);
    fetch(`/api/products?ids=${items.join(",")}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [items]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("savedCount", { count: items.length })}</p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" size="sm" onClick={clear}>
            {t("clearAll")}
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="w-28 h-28 rounded-full bg-brand-beige dark:bg-muted flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-brand-brown/30 dark:text-brand-accent/40" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t("emptyTitle")}</h2>
          <p className="text-muted-foreground mb-6">{t("emptySubtitle")}</p>
          <Button asChild className="bg-brand-brown hover:bg-brand-brown-dark text-white">
            <Link href={`/${locale}/products`}>{t("browseProducts")}</Link>
          </Button>
        </motion.div>
      ) : loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: items.length }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <FavoriteProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
