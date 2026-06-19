import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckoutPageClient } from "@/components/customer/checkout/checkout-page-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "checkout" });
  return { title: t("title") };
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CheckoutPageClient locale={locale} />;
}
