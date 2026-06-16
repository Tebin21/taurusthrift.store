"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Banner } from "@/types/banner";

type Props = {
  banners: Banner[];
};

export function HeroBanner({ banners }: Props) {
  const t = useTranslations("home.hero");
  const locale = useLocale();

  const banner = banners[0];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">

      {/* ── Light editorial gradient backdrop ─────────────────── */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{ background: "var(--hero-bg)" }}
      />
      {/* Dark mode backdrop */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{ background: "var(--hero-bg)" }}
      />

      {/* Subtle warm texture (light mode only) */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none dark:hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(101,0,11,0.3) 0px, rgba(101,0,11,0.3) 1px, transparent 1px, transparent 20px)",
        }}
      />

      {/* Grain texture (dark mode only) */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none hidden dark:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 12px)",
        }}
      />

      {/* Very soft accent glow top-right (light mode) */}
      <div
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 85% 15%, rgba(101,0,11,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Dark mode: radial glow upper-right */}
      <div
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 75% -10%, rgba(139, 30, 45, 0.55) 0%, transparent 70%)",
        }}
      />

      {/* Banner image (if exists) */}
      {banner?.imageUrl && (
        <>
          {/* Light mode: image as right-column editorial */}
          <div className="absolute inset-y-0 end-0 w-[42%] dark:hidden hidden lg:block">
            <div className="relative h-full">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="object-cover"
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, var(--color-background) 0%, transparent 30%)",
                }}
              />
            </div>
          </div>
          {/* Dark mode: full-bleed image overlay */}
          <div className="absolute inset-0 hidden dark:block" style={{ mixBlendMode: "luminosity" }}>
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover opacity-10"
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(15,0,7,0.92) 40%, rgba(15,0,7,0.50) 100%)",
              }}
            />
          </div>
        </>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Label */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block text-xs font-semibold tracking-[0.35em] uppercase text-brand-brown dark:text-brand-accent mb-6 pb-1.5 border-b border-brand-brown/30 dark:border-brand-accent/40"
            >
              Taurus Thrift
            </motion.span>

            {/* Main heading */}
            <h1
              className="text-5xl md:text-7xl font-bold leading-none mb-6 tracking-tight text-foreground dark:text-brand-white"
              style={{ fontFamily: "var(--font-playfair, inherit)" }}
            >
              {banner
                ? (locale === "ku" ? banner.titleKu : locale === "ar" ? banner.titleAr : null) ?? banner.title
                : (
                  <>
                    {t("title")}
                    <br />
                    <span className="text-brand-brown dark:text-transparent dark:bg-clip-text"
                      style={{
                        backgroundImage: "linear-gradient(90deg, #C9A66B 0%, #E8C98A 50%, #C9A66B 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "inherit",
                      }}
                    >
                      {t("titleAccent")}
                    </span>
                  </>
                )}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-foreground/55 dark:text-brand-white/60 mb-10 max-w-md leading-relaxed">
              {banner
                ? (locale === "ku" ? banner.subtitleKu : locale === "ar" ? banner.subtitleAr : null) ?? banner.subtitle ?? t("subtitle")
                : t("subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={banner?.linkUrl ?? `/${locale}/products`}
                  className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold transition-all bg-brand-brown hover:bg-brand-brown-dark text-white shadow-sm hover:shadow-md"
                >
                  {banner ? (locale === "ku" ? banner.linkTextKu : locale === "ar" ? banner.linkTextAr : null) ?? banner.linkText ?? t("cta") : t("cta")}
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={`/${locale}/products?newArrival=true`}
                  className="inline-flex items-center justify-center rounded-full border border-foreground/25 text-foreground/70 hover:border-foreground/50 hover:text-foreground dark:border-brand-white/25 dark:text-brand-white/80 dark:hover:border-brand-white/50 dark:hover:text-brand-white px-8 py-3.5 text-sm font-medium transition-all backdrop-blur-sm"
                >
                  {t("ctaSecondary")}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dark mode decorative orb right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 2, delay: 0.4 }}
        className="absolute end-[-10%] top-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full pointer-events-none hidden dark:block"
        style={{
          background: "radial-gradient(circle, #65000B 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: "var(--hero-bottom-fade)" }}
      />
    </section>
  );
}
