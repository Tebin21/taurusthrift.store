"use client";

import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/shared/image-upload";
import type { Category } from "@/types/product";
import { roundToIQD } from "@/lib/utils/currency";

type Variant = {
  size?: string;
  color?: string;
  colorHex?: string;
  sku?: string;
  stock: number;
  price?: number;
};

type FormData = {
  name: string;
  nameKu?: string;
  nameAr?: string;
  description?: string;
  descriptionKu?: string;
  descriptionAr?: string;
  basePrice: number;
  compareAtPrice?: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  material?: string;
  brand?: string;
  condition?: string;
};

type ProductFormProps = {
  categories: Category[];
  initialData?: Partial<FormData> & {
    id?: string;
    categoryIds?: string[];
    variants?: Variant[];
    thumbnailUrl?: string;
    images?: string[];
  };
};

// Each section below is memoized so editing one section (e.g. typing in a
// variant field) doesn't re-render the rest of this large form.

const ImagesSection = memo(function ImagesSection({
  thumbnailUrl,
  setThumbnailUrl,
  images,
  setImages,
  t,
}: {
  thumbnailUrl: string[];
  setThumbnailUrl: (v: string[]) => void;
  images: string[];
  setImages: (v: string[]) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{t("images")}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <ImageUpload value={thumbnailUrl} onChange={setThumbnailUrl} max={1} label={t("thumbnail")} aspect={3 / 4} />
        <ImageUpload value={images} onChange={setImages} label={t("additionalImages")} aspect={3 / 4} />
      </CardContent>
    </Card>
  );
});

const BasicInfoSection = memo(function BasicInfoSection({
  register,
  t,
}: {
  register: UseFormRegister<FormData>;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{t("basicInfo")}</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>{t("nameEn")}</Label>
          <Input {...register("name", { required: true })} placeholder={t("nameEnPlaceholder")} className="mt-1" />
        </div>
        <div>
          <Label>{t("nameKu")}</Label>
          <Input {...register("nameKu")} placeholder={t("nameKuPlaceholder")} className="mt-1" />
        </div>
        <div>
          <Label>{t("nameAr")}</Label>
          <Input {...register("nameAr")} placeholder={t("nameArPlaceholder")} className="mt-1" />
        </div>
        <div className="md:col-span-2">
          <Label>{t("descriptionEn")}</Label>
          <Textarea {...register("description")} rows={3} className="mt-1" />
        </div>
        <div>
          <Label>{t("descriptionKu")}</Label>
          <Textarea {...register("descriptionKu")} rows={3} className="mt-1" />
        </div>
        <div>
          <Label>{t("descriptionAr")}</Label>
          <Textarea {...register("descriptionAr")} rows={3} className="mt-1" />
        </div>
      </CardContent>
    </Card>
  );
});

const PricingSection = memo(function PricingSection({
  register,
  setValue,
  getValues,
  initialCondition,
  t,
}: {
  register: UseFormRegister<FormData>;
  setValue: (field: keyof FormData, value: unknown) => void;
  getValues: (field: keyof FormData) => number | undefined;
  initialCondition?: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{t("pricing")}</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>{t("basePrice")}</Label>
          <Input
            type="number"
            step="1"
            {...register("basePrice", { required: true, valueAsNumber: true })}
            onBlur={() => setValue("basePrice", roundToIQD(getValues("basePrice") || 0))}
            className="mt-1"
          />
        </div>
        <div>
          <Label>{t("compareAtPrice")}</Label>
          <Input
            type="number"
            step="1"
            {...register("compareAtPrice", { valueAsNumber: true })}
            onBlur={() => { const v = getValues("compareAtPrice"); if (v) setValue("compareAtPrice", roundToIQD(v)); }}
            className="mt-1"
          />
        </div>
        <div>
          <Label>{t("condition")}</Label>
          <Select defaultValue={initialCondition} onValueChange={(val) => val && setValue("condition", val)}>
            <SelectTrigger className="mt-1"><SelectValue placeholder={t("selectCondition")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">{t("conditionExcellent")}</SelectItem>
              <SelectItem value="Good">{t("conditionGood")}</SelectItem>
              <SelectItem value="Fair">{t("conditionFair")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{t("material")}</Label>
          <Input {...register("material")} placeholder={t("materialPlaceholder")} className="mt-1" />
        </div>
        <div>
          <Label>{t("brand")}</Label>
          <Input {...register("brand")} placeholder={t("brandPlaceholder")} className="mt-1" />
        </div>
      </CardContent>
    </Card>
  );
});

const CategoriesFieldSection = memo(function CategoriesFieldSection({
  categories,
  categoryIds,
  toggleCategory,
  t,
}: {
  categories: Category[];
  categoryIds: string[];
  toggleCategory: (id: string) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("categories")}
          <span className="ms-2 text-xs font-normal text-muted-foreground">{t("selectOneOrMore")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noCategories")}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                  categoryIds.includes(cat.id)
                    ? "border-brand-brown bg-brand-brown/5"
                    : "border-border hover:border-brand-brown/40"
                }`}
              >
                <Checkbox
                  checked={categoryIds.includes(cat.id)}
                  onCheckedChange={() => toggleCategory(cat.id)}
                  className="data-[state=checked]:bg-brand-brown data-[state=checked]:border-brand-brown"
                />
                <span className="text-sm font-medium">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
        {categoryIds.length === 0 && (
          <p className="text-xs text-destructive mt-2">{t("atLeastOneCategory")}</p>
        )}
      </CardContent>
    </Card>
  );
});

const VisibilitySection = memo(function VisibilitySection({
  initialData,
  setValue,
  t,
}: {
  initialData?: Partial<FormData>;
  setValue: (field: keyof FormData, value: unknown) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{t("visibility")}</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        {([
          { field: "isActive", labelKey: "isActive" },
          { field: "isFeatured", labelKey: "isFeatured" },
          { field: "isNewArrival", labelKey: "isNewArrival" },
        ] as const).map(({ field, labelKey }) => (
          <div key={field} className="flex items-center gap-3">
            <Switch
              defaultChecked={!!initialData?.[field]}
              onCheckedChange={(val) => setValue(field, val)}
            />
            <Label>{t(labelKey)}</Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
});

const VariantsSection = memo(function VariantsSection({
  variants,
  addVariant,
  removeVariant,
  updateVariant,
  t,
}: {
  variants: Variant[];
  addVariant: () => void;
  removeVariant: (index: number) => void;
  updateVariant: (index: number, field: keyof Variant, value: string | number) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{t("variants")}</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          <Plus className="h-4 w-4 me-1" /> {t("addVariant")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {variants.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("noVariants")}</p>
        )}
        {variants.map((variant, i) => (
          <div key={i} className="grid grid-cols-2 md:grid-cols-6 gap-2 items-end">
            <div>
              <Label className="text-xs">{t("size")}</Label>
              <Input value={variant.size ?? ""} onChange={(e) => updateVariant(i, "size", e.target.value)} placeholder="M" className="mt-1 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs">{t("color")}</Label>
              <Input value={variant.color ?? ""} onChange={(e) => updateVariant(i, "color", e.target.value)} placeholder={t("colorPlaceholder")} className="mt-1 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs">{t("colorHex")}</Label>
              <Input value={variant.colorHex ?? ""} onChange={(e) => updateVariant(i, "colorHex", e.target.value)} placeholder="#000000" className="mt-1 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs">{t("sku")}</Label>
              <Input value={variant.sku ?? ""} onChange={(e) => updateVariant(i, "sku", e.target.value)} placeholder="SKU-001" className="mt-1 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs">{t("stock")}</Label>
              <Input type="number" value={variant.stock} onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)} className="mt-1 h-8 text-sm" />
            </div>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeVariant(i)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
});

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const t = useTranslations("products.form");
  const tToast = useTranslations("products.toast");
  const tCommon = useTranslations("common");
  const [variants, setVariants] = useState<Variant[]>(initialData?.variants ?? []);
  const [thumbnailUrl, setThumbnailUrl] = useState<string[]>(initialData?.thumbnailUrl ? [initialData.thumbnailUrl] : []);
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [categoryIds, setCategoryIds] = useState<string[]>(initialData?.categoryIds ?? []);
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData?.id;

  const { register, handleSubmit, setValue, getValues } = useForm<FormData>({
    defaultValues: {
      isActive: true,
      isFeatured: false,
      isNewArrival: false,
      ...initialData,
    },
  });

  const toggleCategory = useCallback((id: string) => {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }, []);

  const addVariant = useCallback(() => {
    setVariants((prev) => [...prev, { size: "", color: "", stock: 0 }]);
  }, []);

  const removeVariant = useCallback((index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateVariant = useCallback((index: number, field: keyof Variant, value: string | number) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  }, []);

  const onSubmit = async (data: FormData) => {
    if (categoryIds.length === 0) {
      toast.error(tToast("selectCategoryError"));
      return;
    }
    setLoading(true);
    try {
      const url = isEditing ? `/api/products/${initialData.id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          categoryIds,
          variants,
          thumbnailUrl: thumbnailUrl[0] ?? null,
          images,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(isEditing ? tToast("updated") : tToast("created"));
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(result.error ?? tToast("saveFailed"));
      }
    } catch {
      toast.error(tToast("saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <ImagesSection thumbnailUrl={thumbnailUrl} setThumbnailUrl={setThumbnailUrl} images={images} setImages={setImages} t={t} />
      <BasicInfoSection register={register} t={t} />
      <PricingSection
        register={register}
        setValue={setValue as (field: keyof FormData, value: unknown) => void}
        getValues={getValues as (field: keyof FormData) => number | undefined}
        initialCondition={initialData?.condition}
        t={t}
      />
      <CategoriesFieldSection categories={categories} categoryIds={categoryIds} toggleCategory={toggleCategory} t={t} />
      <VisibilitySection initialData={initialData} setValue={setValue as (field: keyof FormData, value: unknown) => void} t={t} />
      <VariantsSection variants={variants} addVariant={addVariant} removeVariant={removeVariant} updateVariant={updateVariant} t={t} />

      <div className="flex gap-3">
        <Button type="submit" className="bg-brand-brown hover:bg-brand-brown-dark text-white" disabled={loading}>
          {loading ? tCommon("saving") : isEditing ? t("updateProduct") : t("createProduct")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          {tCommon("cancel")}
        </Button>
      </div>
    </form>
  );
}
