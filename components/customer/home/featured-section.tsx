"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "../product/product-card";
import type { Product } from "@/types/product";
import { ArrowRight } from "lucide-react";

type Props = { products: Product[] };

export function FeaturedSection({ products }: Props) {
  const t = useTranslations("home");
  const locale = useLocale();

  if (products.length === 0) return null;

  return (
    <section className="relative py-20 px-4 overflow-hidden bg-white dark:bg-[#1E000E]/30">
      <div className="container mx-auto relative z-10">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-brown dark:text-brand-accent mb-2 pb-1 border-b border-brand-brown/30 dark:border-brand-accent/40 inline-block">
              Curated
            </p>
            <h2
              className="text-3xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-playfair, inherit)" }}
            >
              {t("featured")}
            </h2>
            <p className="text-muted-foreground mt-1.5">{t("featuredSubtitle")}</p>
          </motion.div>
          <Link
            href={`/${locale}/products?featured=true`}
            className="hidden sm:flex items-center gap-1.5 text-sm text-brand-brown hover:text-brand-brown-dark dark:text-brand-accent dark:hover:text-brand-white hover:gap-2.5 transition-all duration-200 font-medium"
          >
            {t("viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
