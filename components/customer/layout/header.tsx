"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { CartButton } from "./cart-button";
import { FavoritesButton } from "./favorites-button";
import { CartDrawer } from "../cart/cart-drawer";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function CustomerHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/products`, label: t("products") },
    { href: `/${locale}/categories`, label: t("categories") },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "backdrop-blur-xl border-b"
            : "backdrop-blur-md"
        )}
        style={
          scrolled
            ? {
                background: "var(--header-scrolled-bg)",
                borderColor: "var(--header-scrolled-border)",
                boxShadow: "var(--header-scrolled-shadow)",
              }
            : {
                background: "var(--header-default-bg)",
              }
        }
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
              <Image
                src="/logo.png"
                alt="Taurus Thrift"
                width={40}
                height={40}
                className="h-10 w-auto object-contain dark:hidden"
              />
              <Image
                src="/logo-white.png"
                alt="Taurus Thrift"
                width={40}
                height={40}
                className="hidden h-10 w-auto object-contain dark:block"
              />
              <span className="hidden sm:block font-semibold text-lg tracking-wide text-brand-brown dark:text-brand-accent">
                Taurus Thrift
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== `/${locale}` && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-all duration-200 relative py-1",
                      isActive
                        ? "text-brand-brown after:absolute after:bottom-0 after:inset-x-0 after:h-px after:bg-brand-brown after:rounded-full dark:text-brand-accent dark:after:bg-brand-accent"
                        : "text-foreground/55 hover:text-foreground dark:text-brand-white/55 dark:hover:text-brand-white"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              <LanguageSwitcher />
              <ThemeToggle className="rounded-full text-foreground/55 hover:text-foreground hover:bg-brand-brown/10 dark:text-brand-white/55 dark:hover:text-brand-white dark:hover:bg-brand-brown/20" />
              <div className="mx-1 h-5 w-px bg-foreground/10 dark:bg-brand-white/10" />
              <FavoritesButton />
              <CartButton />
            </div>
          </div>
        </div>
      </header>

      {/* Cart drawer */}
      <CartDrawer />
    </>
  );
}
