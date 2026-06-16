"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Category } from "@/types/product";
import { formatIQD } from "@/lib/utils/currency";

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
  categories: Category[];
  locale: string;
  brands?: string[];
  onUpdate: (updates: Record<string, string | undefined>) => void;
};

export function ProductFilters({ categories, locale, brands = [], onUpdate }: Props) {
  const t = useTranslations("product");
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activeSizes = searchParams.get("sizes")?.split(",").filter(Boolean) ?? [];
  const activeColors = searchParams.get("colors")?.split(",").filter(Boolean) ?? [];
  const activeBrand = searchParams.get("brand") ?? "";
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);

  const hasFilters = activeCategory || activeSizes.length || activeColors.length || activeBrand;

  const toggleSize = (size: string) => {
    const next = activeSizes.includes(size)
      ? activeSizes.filter((s) => s !== size)
      : [...activeSizes, size];
    onUpdate({ sizes: next.length ? next.join(",") : undefined });
  };

  const toggleColor = (color: string) => {
    const next = activeColors.includes(color)
      ? activeColors.filter((c) => c !== color)
      : [...activeColors, color];
    onUpdate({ colors: next.length ? next.join(",") : undefined });
  };

  const clearAll = () => {
    onUpdate({
      category: undefined,
      sizes: undefined,
      colors: undefined,
      brand: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
    setPriceRange([0, MAX_PRICE]);
  };

  return (
    <div className="space-y-6 p-4">
      {hasFilters && (
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-brand-brown hover:text-brand-brown-dark" onClick={clearAll}>
          <X className="h-3.5 w-3.5" /> Clear all filters
        </Button>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
            {t("category")}
          </p>
          <div className="space-y-2">
            <button
              onClick={() => onUpdate({ category: undefined })}
              className={`text-sm w-full text-start py-2.5 md:py-1 transition-colors ${
                !activeCategory ? "text-brand-brown font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const name =
                (locale === "ku" ? cat.nameKu : locale === "ar" ? cat.nameAr : null) ?? cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => onUpdate({ category: cat.slug })}
                  className={`text-sm w-full text-start py-2.5 md:py-1 transition-colors ${
                    activeCategory === cat.slug
                      ? "text-brand-brown font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
          {t("size")}
        </p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`h-10 md:h-8 px-3 md:px-2.5 rounded border text-xs font-medium transition-colors ${
                activeSizes.includes(size)
                  ? "bg-brand-brown text-white border-brand-brown"
                  : "border-border hover:border-brand-brown"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
          {t("color")}
        </p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              title={color.name}
              className={`w-9 h-9 md:w-7 md:h-7 rounded-full border-2 transition-all ${
                activeColors.includes(color.name)
                  ? "border-brand-brown scale-110"
                  : "border-transparent hover:border-muted-foreground"
              }`}
              style={{ backgroundColor: color.hex, boxShadow: color.hex === "#FFFFFF" ? "inset 0 0 0 1px #e2e8f0" : undefined }}
            />
          ))}
        </div>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
            {t("brand")}
          </p>
          <div className="space-y-1">
            <button
              onClick={() => onUpdate({ brand: undefined })}
              className={`text-sm w-full text-start py-2.5 md:py-1 transition-colors ${
                !activeBrand ? "text-brand-brown font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Brands
            </button>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => onUpdate({ brand: b })}
                className={`text-sm w-full text-start py-2.5 md:py-1 transition-colors ${
                  activeBrand === b
                    ? "text-brand-brown font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price range */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
          {t("price")}
        </p>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={5000}
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
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
          <span>{formatIQD(priceRange[0])}</span>
          <span>{formatIQD(priceRange[1])}</span>
        </div>
      </div>
    </div>
  );
}
