"use client";

import { useTranslations } from "next-intl";
import type { ProductVariant } from "@/types/product";

type Props = {
  variants: ProductVariant[];
  selectedId: string | null;
  onChange: (variant: ProductVariant) => void;
};

export function VariantSelector({ variants, selectedId, onChange }: Props) {
  const t = useTranslations("product");

  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];

  const selectedVariant = variants.find((v) => v.id === selectedId);

  const isAvailable = (size?: string | null, color?: string | null) => {
    return variants.some(
      (v) =>
        (!size || v.size === size) &&
        (!color || v.color === color) &&
        v.stock > 0,
    );
  };

  const handleSizeSelect = (size: string) => {
    const match = variants.find(
      (v) => v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color),
    ) ?? variants.find((v) => v.size === size && v.stock > 0);
    if (match) onChange(match);
  };

  const handleColorSelect = (color: string) => {
    const match = variants.find(
      (v) => v.color === color && (!selectedVariant?.size || v.size === selectedVariant.size),
    ) ?? variants.find((v) => v.color === color && v.stock > 0);
    if (match) onChange(match);
  };

  if (!variants.length) return null;

  return (
    <div className="space-y-4">
      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">
            {t("size")}
            {selectedVariant?.size && (
              <span className="ms-2 text-muted-foreground font-normal">{selectedVariant.size}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const available = isAvailable(size, selectedVariant?.color);
              const isSelected = selectedVariant?.size === size;
              return (
                <button
                  key={size}
                  onClick={() => available && handleSizeSelect(size!)}
                  disabled={!available}
                  className={`h-9 px-3 rounded-lg border text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-brand-brown text-white border-brand-brown"
                      : available
                      ? "border-border hover:border-brand-brown"
                      : "border-border opacity-30 cursor-not-allowed line-through"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">
            {t("color")}
            {selectedVariant?.color && (
              <span className="ms-2 text-muted-foreground font-normal">{selectedVariant.color}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const variant = variants.find((v) => v.color === color);
              const available = isAvailable(selectedVariant?.size, color);
              const isSelected = selectedVariant?.color === color;
              return (
                <button
                  key={color}
                  onClick={() => available && handleColorSelect(color!)}
                  disabled={!available}
                  title={color!}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    isSelected ? "border-brand-brown scale-110" : "border-transparent"
                  } ${!available ? "opacity-30 cursor-not-allowed" : "hover:border-muted-foreground"}`}
                  style={{
                    backgroundColor: variant?.colorHex ?? color!.toLowerCase(),
                    boxShadow: variant?.colorHex === "#FFFFFF" || color === "White" ? "inset 0 0 0 1px #e2e8f0" : undefined,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {selectedVariant && (
        <p className={`text-sm ${selectedVariant.stock > 5 ? "text-green-600" : selectedVariant.stock > 0 ? "text-orange-500" : "text-red-500"}`}>
          {selectedVariant.stock === 0
            ? t("outOfStock")
            : selectedVariant.stock <= 5
            ? `Only ${selectedVariant.stock} left`
            : t("inStock")}
        </p>
      )}
    </div>
  );
}
