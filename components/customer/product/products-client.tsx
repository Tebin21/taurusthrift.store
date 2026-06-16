"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./product-card";
import { ProductFilters } from "./product-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product, Category } from "@/types/product";

type Props = {
  products: Product[];
  categories: Category[];
  brands?: string[];
  total: number;
  page: number;
  limit: number;
  locale: string;
};

export function ProductsClient({ products, categories, brands = [], total, page, limit, locale }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const totalPages = Math.ceil(total / limit);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const url = new URL(window.location.href);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
        else url.searchParams.delete(key);
      });
      url.searchParams.delete("page");
      router.push(`${pathname}?${url.searchParams.toString()}`);
    },
    [pathname, router],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ search: search || undefined });
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClearSearch = () => {
    setSearch("");
  };

  const handleSort = (value: string | null) => {
    if (value) updateParams({ sort: value });
  };

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("common.search")}
              className="ps-9 pe-8 h-9"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute end-2 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ms-auto">
            {/* Sort */}
            <Select onValueChange={handleSort} defaultValue="newest">
              <SelectTrigger className="h-9 w-28 sm:w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("product.sortNewest")}</SelectItem>
                <SelectItem value="price_asc">{t("product.sortPriceLow")}</SelectItem>
                <SelectItem value="price_desc">{t("product.sortPriceHigh")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile filters */}
            <Sheet>
              <SheetTrigger className="lg:hidden inline-flex items-center gap-2 h-7 px-2.5 rounded-md border border-border bg-background text-sm hover:bg-muted transition-colors outline-none">
                <SlidersHorizontal className="h-4 w-4" />
                {t("product.filters")}
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="p-4 border-b font-semibold">{t("product.filters")}</div>
                <div className="overflow-y-auto h-full pb-20">
                  <ProductFilters
                    categories={categories}
                    brands={brands}
                    locale={locale}
                    onUpdate={updateParams}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-36">
            <p className="font-semibold mb-4">{t("product.filters")}</p>
            <ProductFilters
              categories={categories}
              locale={locale}
              onUpdate={updateParams}
            />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-6">
            {total} {t("product.results")}
          </p>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-6xl mb-4">🔍</span>
              <p className="text-lg font-medium mb-1">{t("product.noResults")}</p>
              <p className="text-sm text-muted-foreground">{t("product.noResultsHint")}</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${page}-${total}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              >
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => updateParams({ page: String(page - 1) })}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="icon"
                  className={p === page ? "bg-brand-brown hover:bg-brand-brown-dark" : ""}
                  onClick={() => updateParams({ page: String(p) })}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => updateParams({ page: String(page + 1) })}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
