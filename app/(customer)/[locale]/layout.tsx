import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing, rtlLocales, type Locale } from "@/lib/routing";
import { CustomerHeader } from "@/components/customer/layout/header";
import { CustomerFooter } from "@/components/customer/layout/footer";
import { MobileBottomNav } from "@/components/customer/layout/mobile-bottom-nav";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { LocaleAttributes } from "@/components/shared/locale-attributes";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CustomerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = rtlLocales.includes(locale as Locale) ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleAttributes lang={locale} dir={dir} />
      <LoadingScreen />
      <CustomerHeader />
      <main className="flex-1">{children}</main>
      <CustomerFooter />
      <MobileBottomNav />
    </NextIntlClientProvider>
  );
}
