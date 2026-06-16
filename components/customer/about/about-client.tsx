"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Recycle, Heart, Sparkles, Leaf } from "lucide-react";

type Props = { locale: string };

const VALUES = [
  { icon: Recycle, key: "sustainable" },
  { icon: Heart, key: "curated" },
  { icon: Sparkles, key: "quality" },
  { icon: Leaf, key: "conscious" },
];

export function AboutClient({ locale }: Props) {
  const t = useTranslations("about");

  return (
    <div>
      {/* Hero */}
      <section className="relative py-28 px-4 text-center overflow-hidden bg-background">
        {/* Subtle soft accent glow top-center (light mode) */}
        <div
          className="absolute inset-0 pointer-events-none dark:hidden"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(101,0,11,0.05) 0%, transparent 70%)",
          }}
        />
        {/* Dark mode: keep the existing feel */}
        <div
          className="absolute inset-0 hidden dark:block"
          style={{ background: "linear-gradient(180deg, #3A0008 0%, #1E000E 50%, #0F0007 100%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none hidden dark:block"
          style={{
            backgroundImage: "radial-gradient(#65000B 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.08,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none hidden dark:block"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(139,30,45,0.40) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto max-w-2xl relative z-10"
        >
          <p className="text-xs font-semibold tracking-[0.28em] uppercase text-brand-brown dark:text-brand-accent mb-4 pb-1.5 border-b border-brand-brown/25 dark:border-brand-accent/35 inline-block">
            Taurus Thrift
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground dark:text-brand-white"
            style={{ fontFamily: "var(--font-playfair, inherit)" }}
          >
            {t("title")}
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">{t("subtitle")}</p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 py-20 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-playfair, inherit)" }}
          >
            {t("storyTitle")}
          </h2>
          <p className="leading-relaxed text-muted-foreground">{t("storyP1")}</p>
          <p className="leading-relaxed text-muted-foreground">{t("storyP2")}</p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="relative py-20 px-4 overflow-hidden bg-[#F5F5F5] dark:bg-[#1E000E]">
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-playfair, inherit)" }}
            >
              {t("valuesTitle")}
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-7 text-center transition-all duration-200 bg-white dark:bg-[#200010] border border-gray-100 dark:border-white/7 hover:shadow-md"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-brand-brown/10 dark:bg-brand-brown/35">
                  <Icon className="h-6 w-6 text-brand-brown dark:text-brand-accent" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground dark:text-brand-white">
                  {t(`value_${key}_title` as never)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`value_${key}_desc` as never)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <h2
            className="text-2xl font-bold mb-3 text-foreground"
            style={{ fontFamily: "var(--font-playfair, inherit)" }}
          >
            {t("ctaTitle")}
          </h2>
          <p className="mb-8 text-muted-foreground">{t("ctaSubtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold transition-all bg-brand-brown hover:bg-brand-brown-dark text-white shadow-sm hover:shadow-md"
            >
              {t("ctaShop")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-medium transition-all border border-foreground/20 text-foreground/70 hover:border-foreground/40 hover:text-foreground dark:border-white/20 dark:text-white/75 dark:hover:border-white/40 dark:hover:text-white"
            >
              {t("ctaContact")}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
