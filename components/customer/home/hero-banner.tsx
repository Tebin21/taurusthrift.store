"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/types/banner";

const INTERVAL_MS = 4000;

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const textVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

type Props = {
  banners: Banner[];
};

export function HeroBanner({ banners }: Props) {
  const t = useTranslations("home.hero");
  const locale = useLocale();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = banners.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-play: restarts whenever current, isPaused, or total changes
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    timerRef.current = setInterval(next, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused, next]);

  const banner = banners[current] ?? null;
  const imageUrl = banner?.imageUrls?.[0] ?? banner?.imageUrl ?? null;

  const bannerTitle =
    banner
      ? (locale === "ku" ? banner.titleKu : locale === "ar" ? banner.titleAr : null) ?? banner.title
      : null;

  const bannerSubtitle =
    banner
      ? (locale === "ku" ? banner.subtitleKu : locale === "ar" ? banner.subtitleAr : null) ?? banner.subtitle ?? null
      : null;

  const bannerLinkText =
    banner
      ? (locale === "ku" ? banner.linkTextKu : locale === "ar" ? banner.linkTextAr : null) ?? banner.linkText ?? null
      : null;

  return (
    <section
      role="region"
      aria-label="Hero banner"
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >

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

      {/* Banner image with fade transition */}
      <AnimatePresence mode="wait">
        {imageUrl && (
          <motion.div
            key={`image-${current}`}
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 pointer-events-none"
          >
            {/* Light mode: image as right-column editorial */}
            <div className="absolute inset-y-0 end-0 w-[42%] dark:hidden hidden lg:block">
              <div className="relative h-full">
                <Image
                  src={imageUrl}
                  alt={banner?.title ?? "Banner"}
                  fill
                  sizes="42vw"
                  className="object-cover"
                  priority={current === 0}
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
                src={imageUrl}
                alt={banner?.title ?? "Banner"}
                fill
                sizes="100vw"
                className="object-cover opacity-10"
                priority={current === 0}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, rgba(15,0,7,0.92) 40%, rgba(15,0,7,0.50) 100%)",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current}`}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
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
                {bannerTitle ?? (
                  <>
                    {t("title")}
                    <br />
                    <span
                      className="text-brand-brown dark:text-transparent dark:bg-clip-text"
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
                {bannerSubtitle ?? t("subtitle")}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={banner?.linkUrl ?? `/${locale}/products`}
                    className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold transition-all bg-brand-brown hover:bg-brand-brown-dark text-white shadow-sm hover:shadow-md"
                  >
                    {bannerLinkText ?? t("cta")}
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
          </AnimatePresence>
        </div>
      </div>

      {/* Arrow controls — only when multiple banners */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous banner"
            className="absolute start-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 rtl:hidden" />
            <ChevronRight className="w-5 h-5 ltr:hidden" />
          </button>
          <button
            onClick={next}
            aria-label="Next banner"
            className="absolute end-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 rtl:hidden" />
            <ChevronLeft className="w-5 h-5 ltr:hidden" />
          </button>
        </>
      )}

      {/* Pagination dots — only when multiple banners */}
      {total > 1 && (
        <div className="absolute bottom-10 inset-x-0 flex justify-center gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Banner ${i + 1} of ${total}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

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
