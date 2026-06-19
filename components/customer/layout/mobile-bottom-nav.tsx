"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, LayoutGrid, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFavoritesCount } from "@/store/favorites.store";

export function MobileBottomNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const favoritesCount = useFavoritesCount();

  const navLinks = [
    { href: `/${locale}`, label: t("home"), icon: Home },
    { href: `/${locale}/products`, label: t("products"), icon: ShoppingBag },
    { href: `/${locale}/categories`, label: t("categories"), icon: LayoutGrid },
    { href: `/${locale}/favorites`, label: t("favorites"), icon: Heart, badge: favoritesCount },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 w-fit max-w-[calc(100%-2rem)]"
    >
      <div
        className="flex items-center justify-center gap-2 rounded-full border backdrop-blur-xl px-3 py-2"
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
                <span className="relative inline-flex shrink-0">
                  <Icon className="h-5 w-5 shrink-0" />
                  <AnimatePresence>
                    {!!link.badge && (
                      <motion.span
                        key="favorites-count"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="absolute -top-1.5 -end-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-semibold text-brand-brown shadow-sm dark:bg-brand-white dark:text-brand-brown"
                      >
                        {link.badge > 99 ? "99+" : link.badge}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
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
