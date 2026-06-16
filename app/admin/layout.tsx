import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getAdminLocale } from "@/lib/admin-locale";
import { rtlLocales } from "@/lib/routing";
import { AdminSidebar } from "@/components/admin/layout/sidebar";
import { AdminTopbar } from "@/components/admin/layout/topbar";
import { LocaleAttributes } from "@/components/shared/locale-attributes";
import { vazirmatn } from "./fonts";

export const metadata = {
  title: { default: "Admin", template: "%s | Taurus Thrift Admin" },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const locale = await getAdminLocale();
  const messages = await getMessages();
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleAttributes lang={locale} dir={dir} />
      {!session ? (
        // No session: render children bare (proxy.ts handles redirecting non-login routes)
        <div className={`admin-root ${vazirmatn.variable}`}>{children}</div>
      ) : (
        <div className={`admin-root flex h-screen bg-muted/30 overflow-hidden ${vazirmatn.variable}`}>
          <AdminSidebar />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <AdminTopbar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      )}
    </NextIntlClientProvider>
  );
}
