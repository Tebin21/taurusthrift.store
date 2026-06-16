"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages } from "@/lib/locales";
import { setAdminLocale } from "@/lib/admin-locale";

export function AdminLanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const switchLocale = async (newLocale: "en" | "ar" | "ku") => {
    await setAdminLocale(newLocale);
    router.refresh();
  };

  const current = languages.find((l) => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-sm font-normal hover:bg-muted transition-colors outline-none">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{current?.label}</span>
        <span className="sm:hidden">{current?.flag}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLocale(lang.code)}
            className={locale === lang.code ? "bg-brand-brown/8 text-brand-brown font-medium" : ""}
          >
            <span className="me-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
