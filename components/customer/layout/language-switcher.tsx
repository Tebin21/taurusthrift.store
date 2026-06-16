"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages } from "@/lib/locales";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Replace current locale segment in pathname
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  const current = languages.find((l) => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium tracking-wide transition-colors outline-none",
          "text-foreground/55 hover:text-foreground hover:bg-brand-brown/10 dark:text-brand-white/55 dark:hover:text-brand-white dark:hover:bg-brand-brown/20"
        )}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{current?.code}</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLocale(lang.code)}
            className={cn(
              "text-sm",
              locale === lang.code && "bg-brand-brown/8 text-brand-brown font-medium dark:bg-brand-accent/15 dark:text-brand-accent"
            )}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
