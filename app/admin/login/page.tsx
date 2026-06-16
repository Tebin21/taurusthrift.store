import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { AuthError } from "next-auth";
import { getTranslations } from "next-intl/server";
import { AdminLanguageSwitcher } from "@/components/admin/layout/language-switcher";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/admin/dashboard");

  const { error } = await searchParams;
  const t = await getTranslations("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="absolute top-4 end-4">
        <AdminLanguageSwitcher />
      </div>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt={t("brandName")} width={64} height={64} className="h-16 w-auto mb-3 dark:hidden" />
          <Image src="/logo-white.png" alt={t("brandName")} width={64} height={64} className="hidden h-16 w-auto mb-3 dark:block" />
          <h1 className="text-2xl font-bold">{t("brandName")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>

        {/* Form card */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-1">{t("signIn")}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {t("signInHint")}
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
              {error === "CredentialsSignin"
                ? t("invalidCredentials")
                : t("genericError")}
            </div>
          )}

          <form
            action={async (formData: FormData) => {
              "use server";
              try {
                await signIn("credentials", {
                  email: formData.get("email"),
                  password: formData.get("password"),
                  redirectTo: "/admin/dashboard",
                });
              } catch (error) {
                if (error instanceof AuthError) {
                  redirect(`/admin/login?error=${error.type}`);
                }
                throw error;
              }
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                {t("email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@taurusthrift.com"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-brown"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                {t("password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-brown"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-brand-brown hover:bg-brand-brown-dark text-white py-2.5 text-sm font-medium transition-colors"
            >
              {t("signIn")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
