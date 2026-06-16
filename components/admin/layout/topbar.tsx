import { getTranslations } from "next-intl/server";
import { auth, signOut } from "@/lib/auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { MobileSidebarToggle } from "./mobile-sidebar-toggle";
import { AdminLanguageSwitcher } from "./language-switcher";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export async function AdminTopbar() {
  const session = await auth();
  const t = await getTranslations("nav");

  return (
    <header className="h-16 flex items-center justify-between px-6 shrink-0 bg-white dark:bg-[#1A000C] border-b border-gray-100 dark:border-white/7">
      <div className="flex items-center gap-2">
        <MobileSidebarToggle />
        <h1 className="hidden md:block text-sm font-semibold text-foreground tracking-wide">
          <span className="text-brand-brown dark:text-brand-accent">{t("brandName")}</span>{" "}
          <span className="font-normal text-foreground/40">{t("adminPanel")}</span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <AdminLanguageSwitcher />
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-muted transition-colors outline-none">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs bg-brand-brown text-white">
                {session?.user?.name?.[0]?.toUpperCase() ?? "A"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm hidden sm:block">{session?.user?.name ?? t("adminPanel")}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/admin/login" });
                  }}
                >
                  <button type="submit" className="flex w-full items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    {t("signOut")}
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
