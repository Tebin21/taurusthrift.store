"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/customer/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, SlidersHorizontal, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatIQD } from "@/lib/utils/currency";
import type { Product, Category } from "@/types/product";

const MAX_PRICE = 200000;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Burgundy", hex: "#65000B" },
  { name: "Beige", hex: "#FAF8F6" },
  { name: "Navy", hex: "#1B3A4B" },
  { name: "Grey", hex: "#9E9E9E" },
];

type Props = {
  category: Category & { _count?: { products: number } };
  products: Product[];
  total: number;
  page: number;
  limit: number;
  locale: string;
  brands: string[];
  activeSizes: string[];
  activeColors: string[];
  activeBrand: string;
  priceRange: [number, number];
};

function FilterPanel({
  locale,
  brands,
  activeSizes,
  activeColors,
  activeBrand,
  priceRange,
  onUpdate,
}: {
  locale: string;
  brands: string[];
  activeSizes: string[];
  activeColors: string[];
  activeBrand: string;
  priceRange: [number, number];
  onUpdate: (u: Record<string, string | undefined>) => void;
}) {
  const t = useTranslations("product");
  const [localPrice, setLocalPrice] = useState<[number, number]>(priceRange);
  const hasFilters = activeSizes.length || activeColors.length || activeBrand || priceRange[0] > 0 || priceRange[1] < MAX_PRICE;

  const toggleSize = (size: string) => {
    const next = activeSizes.includes(size) ? activeSizes.filter((s) => s !== size) : [...activeSizes, size];
    onUpdate({ sizes: next.length ? next.join(",") : undefined });
  };

  const toggleColor = (color: string) => {
    const next = activeColors.includes(color) ? activeColors.filter((c) => c !== color) : [...activeColors, color];
    onUpdate({ colors: next.length ? next.join(",") : undefined });
  };

  const clearAll = () => {
    setLocalPrice([0, MAX_PRICE]);
    onUpdate({ sizes: undefined, colors: undefined, brand: undefined, minPrice: undefined, maxPrice: undefined });
  };

  return (
    <div className="space-y-6 p-4">
      {hasFilters && (
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-brand-brown hover:text-brand-brown-dark" onClick={clearAll}>
          <X className="h-3.5 w-3.5" /> Clear all filters
        </Button>
      )}

      {/* Size */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">{t("size")}</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`h-10 md:h-8 px-3 md:px-2.5 rounded border text-xs font-medium transition-colors ${
                activeSizes.includes(size) ? "bg-brand-brown text-white border-brand-brown" : "border-border hover:border-brand-brown"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">{t("color")}</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              title={color.name}
              className={`w-9 h-9 md:w-7 md:h-7 rounded-full border-2 transition-all ${
                activeColors.includes(color.name) ? "border-brand-brown scale-110" : "border-transparent hover:border-muted-foreground"
              }`}
              style={{ backgroundColor: color.hex, boxShadow: color.hex === "#FFFFFF" ? "inset 0 0 0 1px #e2e8f0" : undefined }}
            />
          ))}
        </div>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">Brand</p>
          <div className="space-y-1">
            <button
              onClick={() => onUpdate({ brand: undefined })}
              className={`text-sm w-full text-start py-1.5 transition-colors ${!activeBrand ? "text-brand-brown font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              All Brands
            </button>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => onUpdate({ brand: b })}
                className={`text-sm w-full text-start py-1.5 transition-colors ${activeBrand === b ? "text-brand-brown font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">{t("price")}</p>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={5000}
          value={localPrice}
          onValueChange={(val) => setLocalPrice(val as [number, number])}
          onValueCommitted={(val: number | readonly number[]) => {
            const [min, max] = val as [number, number];
            onUpdate({
              minPrice: min > 0 ? String(min) : undefined,
              maxPrice: max < MAX_PRICE ? String(max) : undefined,
            });
          }}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatIQD(localPrice[0])}</span>
          <span>{formatIQD(localPrice[1])}</span>
        </div>
      </div>
    </div>
  );
}

export function CategoryPageClient({
  category,
  products,
  total,
  page,
  limit,
  locale,
  brands,
  activeSizes,
  activeColors,
  activeBrand,
  priceRange,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const totalPages = Math.ceil(total / limit);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const localName = (locale === "ku" ? category.nameKu : locale === "ar" ? category.nameAr : null) ?? category.name;

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

  const filterProps = { locale, brands, activeSizes, activeColors, activeBrand, priceRange, onUpdate: updateParams };

  return (
    <div className="min-h-screen">
      {/* Category Hero */}
      <div className="relative bg-brand-beige dark:bg-muted overflow-hidden">
        {category.imageUrl && (
          <div className="absolute inset-0">
            <Image src={category.imageUrl} alt={localName} fill className="object-cover opacity-20" sizes="100vw" />
          </div>
        )}
        <div className="relative container mx-auto px-4 py-14">
          <Link
            href={`/${locale}/categories`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand-brown transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("category.backToCategories")}
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">{localName}</h1>
          {category.description && (
            <p className="text-muted-foreground text-lg max-w-xl">{category.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-3">
            {t("category.products", { count: category._count?.products ?? total })}
          </p>
        </div>
      </div>

      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("common.search")}
              className="ps-9 pe-8 h-9"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="absolute end-2 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ms-auto">
            <Select onValueChange={(v) => v && updateParams({ sort: v })} defaultValue="newest">
              <SelectTrigger className="h-9 w-28 sm:w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("product.sortNewest")}</SelectItem>
                <SelectItem value="price_asc">{t("product.sortPriceLow")}</SelectItem>
                <SelectItem value="price_desc">{t("product.sortPriceHigh")}</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger className="lg:hidden inline-flex items-center gap-2 h-7 px-2.5 rounded-md border border-border bg-background text-sm hover:bg-muted transition-colors outline-none">
                <SlidersHorizontal className="h-4 w-4" />
                {t("product.filters")}
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="p-4 border-b font-semibold">{t("product.filters")}</div>
                <div className="overflow-y-auto h-full pb-20">
                  <FilterPanel {...filterProps} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-36">
            <p className="font-semibold mb-4">{t("product.filters")}</p>
            <FilterPanel {...filterProps} />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-6">{total} {t("product.results")}</p>

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

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => updateParams({ page: String(page - 1) })}>
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
              <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => updateParams({ page: String(page + 1) })}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
