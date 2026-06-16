import { getTranslations } from "next-intl/server";
import { CartPageClient } from "@/components/customer/cart/cart-page-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });
  return { title: t("title") };
}

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CartPageClient locale={locale} />;
}
