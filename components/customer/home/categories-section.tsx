"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/product";

type Props = { categories: Category[] };

const fadeUpInitial = { opacity: 0, y: 20 };
const fadeUpWhileInView = { opacity: 1, y: 0 };
const viewportOnce = { once: true };
const cardWhileHover = { y: -5 };

export function CategoriesSection({ categories }: Props) {
  const t = useTranslations("home");
  const locale = useLocale();

  if (categories.length === 0) return null;

  return (
    <section className="relative py-20 px-4 overflow-hidden bg-background">

      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={fadeUpInitial}
          whileInView={fadeUpWhileInView}
          viewport={viewportOnce}
        >
          <p className="text-xs font-semibold tracking-[0.28em] uppercase text-brand-brown dark:text-brand-accent mb-2">Browse</p>
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-playfair, inherit)" }}
          >
            {t("categories")}
          </h2>
          <p className="text-muted-foreground mt-2">{t("categoriesSubtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => {
            const localName =
              (locale === "ku" ? cat.nameKu : locale === "ar" ? cat.nameAr : null) ?? cat.name;
            return (
              <motion.div
                key={cat.id}
                initial={fadeUpInitial}
                whileInView={fadeUpWhileInView}
                viewport={viewportOnce}
                transition={{ delay: i * 0.06 }}
                whileHover={cardWhileHover}
              >
                <Link
                  href={`/${locale}/category/${cat.slug}`}
                  className="block rounded-2xl p-6 text-center transition-all duration-300 group bg-white dark:bg-[#1A000C] border border-gray-100 dark:border-white/7 hover:border-brand-brown/20 dark:hover:border-brand-accent/30 hover:shadow-lg dark:hover:shadow-luxury-hover"
                >
                  {cat.imageUrl ? (
                    <div className="relative w-12 h-12 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-brand-brown/30 group-hover:ring-brand-brown/40 dark:group-hover:ring-brand-accent/50 transition-all">
                      <Image src={cat.imageUrl} alt={localName} fill sizes="48px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-brand-beige dark:bg-brand-brown/30 transition-all">
                      <span className="text-2xl">👗</span>
                    </div>
                  )}
                  <p className="font-semibold text-sm text-foreground/70 dark:text-brand-white/75 group-hover:text-brand-brown dark:group-hover:text-brand-accent transition-colors">
                    {localName}
                  </p>
                  <p className="text-xs mt-0.5 text-muted-foreground">
                    {cat._count?.products ?? 0} items
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
