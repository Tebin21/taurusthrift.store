"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoritesCount } from "@/store/favorites.store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function FavoritesButton({ className }: { className?: string }) {
  const locale = useLocale();
  const count = useFavoritesCount();

  return (
    <Button
      asChild
      variant="ghost"
      size="icon-lg"
      className={cn(
        "relative rounded-full text-foreground/55 hover:text-foreground hover:bg-brand-brown/10 dark:text-brand-white/55 dark:hover:text-brand-white dark:hover:bg-brand-brown/20",
        className
      )}
      aria-label="View favorites"
    >
      <Link href={`/${locale}/favorites`}>
        <Heart className="h-5 w-5" />
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key="favorites-count"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute -top-0.5 -end-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-semibold text-brand-brown shadow-sm ring-2 ring-background dark:bg-brand-white dark:text-brand-brown dark:ring-background"
            >
              {count > 99 ? "99+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </Button>
  );
}
