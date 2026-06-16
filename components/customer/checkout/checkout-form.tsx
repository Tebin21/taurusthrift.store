"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cart.store";

const schema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(7),
  customerAddress: z.string().min(5),
  customerCity: z.string().optional(),
  customerNotes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  couponCode?: string;
  subtotal: number;
  discount: number;
  total: number;
};

export function CheckoutForm({ couponCode, subtotal, discount, total }: Props) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!items.length) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          subtotal,
          discountAmount: discount,
          total,
          couponCode: couponCode || undefined,
          locale,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.name,
            variantInfo: item.variantInfo,
            imageUrl: item.imageUrl,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Failed");

      clearCart();
      router.push(`/${locale}/order-confirmation/${json.data.id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <Label htmlFor="customerName">{t("fullName")} *</Label>
        <Input id="customerName" {...register("customerName")} className="mt-1" />
        {errors.customerName && <p className="text-xs text-red-500 mt-1">{t("nameRequired")}</p>}
      </div>

      <div>
        <Label htmlFor="customerPhone">{t("phone")} *</Label>
        <Input id="customerPhone" type="tel" {...register("customerPhone")} className="mt-1" dir="ltr" />
        {errors.customerPhone && <p className="text-xs text-red-500 mt-1">{t("phoneRequired")}</p>}
      </div>

      <div>
        <Label htmlFor="customerAddress">{t("address")} *</Label>
        <Textarea id="customerAddress" {...register("customerAddress")} rows={3} className="mt-1" />
        {errors.customerAddress && <p className="text-xs text-red-500 mt-1">{t("addressRequired")}</p>}
      </div>

      <div>
        <Label htmlFor="customerCity">{t("city")}</Label>
        <Input id="customerCity" {...register("customerCity")} className="mt-1" />
      </div>

      <div>
        <Label htmlFor="customerNotes">{t("notes")}</Label>
        <Textarea id="customerNotes" {...register("customerNotes")} rows={2} placeholder={t("notesPlaceholder")} className="mt-1" />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={loading || !items.length}
        className="w-full bg-brand-brown hover:bg-brand-brown-light text-white h-12 text-base shadow-luxury hover:shadow-luxury-hover transition-all"
      >
        {loading ? (
          <><Loader2 className="h-5 w-5 animate-spin me-2" /> {t("placing")}</>
        ) : (
          <><CheckCircle className="h-5 w-5 me-2" /> {t("placeOrder")}</>
        )}
      </Button>
    </motion.form>
  );
}
