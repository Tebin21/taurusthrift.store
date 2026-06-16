import { getTranslations } from "next-intl/server";
import { auth, signOut } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminLanguageSwitcher } from "@/components/admin/layout/language-switcher";
import { AccountSecurityCard } from "@/components/admin/settings/account-security-card";
import { LogOut } from "lucide-react";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const session = await auth();
  const t = await getTranslations("settings");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{t("language")}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{t("languageHint")}</p>
          <AdminLanguageSwitcher />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">{t("account")}</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><span className="text-muted-foreground">{t("name")}:</span> <span className="font-medium ms-2">{session?.user?.name ?? "—"}</span></div>
          <div><span className="text-muted-foreground">{t("email")}:</span> <span className="font-medium ms-2">{session?.user?.email ?? "—"}</span></div>
        </CardContent>
      </Card>

      <AccountSecurityCard />

      <Card>
        <CardContent className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{t("logoutHint")}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <Button type="submit" variant="destructive">
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
