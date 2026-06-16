"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, LayoutGrid, Info, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const navLinks = [
    { href: `/${locale}`, label: t("home"), icon: Home },
    { href: `/${locale}/products`, label: t("products"), icon: ShoppingBag },
    { href: `/${locale}/categories`, label: t("categories"), icon: LayoutGrid },
    { href: `/${locale}/about`, label: t("about"), icon: Info },
    { href: `/${locale}/contact`, label: t("contact"), icon: Phone },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50"
    >
      <div
        className="flex items-center justify-between gap-1 rounded-full border backdrop-blur-xl px-2 py-2"
        style={{
          background: "var(--bottom-nav-bg)",
          borderColor: "var(--bottom-nav-border)",
          boxShadow: "var(--bottom-nav-shadow)",
        }}
      >
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== `/${locale}` && pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex items-center justify-center rounded-full p-3 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-brown dark:focus-visible:ring-brand-accent",
                !isActive &&
                  "text-foreground/45 hover:text-foreground dark:text-brand-white/45 dark:hover:text-brand-white"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="mobileNavActivePill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-brand-brown shadow-luxury dark:bg-brand-accent"
                />
              )}
              <motion.span
                animate={isActive ? { y: -2, scale: 1.05 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                  "relative z-10 flex items-center gap-1.5",
                  isActive && "text-white dark:text-black"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isActive && (
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {link.label}
                  </span>
                )}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
