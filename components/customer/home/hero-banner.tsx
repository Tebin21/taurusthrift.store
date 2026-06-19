"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Banner } from "@/types/banner";
import type { HeroContent } from "@/types/hero-content";

const INTERVAL_MS = 4000;

type Props = {
  banners: Banner[];
  heroContent: HeroContent | null;
};

export function HeroBanner({ banners, heroContent }: Props) {
  const t = useTranslations("home.hero");
  const locale = useLocale();
  const isRtl = locale === "ar" || locale === "ku";

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = banners.length;

  // Autoplay-only advance — no manual navigation triggers this
  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [total, isPaused, next]);

  // Slide animation — RTL/LTR aware, forward-only (autoplay)
  const slideVariants = {
    enter: { x: isRtl ? "-100%" : "100%", opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
    exit: { x: isRtl ? "100%" : "-100%", opacity: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  };

  // Hero title: use HeroContent db value if set, else fall back to translation
  const heroTitle =
    locale === "ku"
      ? heroContent?.titleKu || null
      : locale === "ar"
      ? heroContent?.titleAr || null
      : heroContent?.titleEn || null;

  const imageUrl = banners[current]?.imageUrls?.[0] ?? banners[current]?.imageUrl ?? null;

  return (
    <section
      role="region"
      aria-label="Hero banner"
      className="w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Text Block ─────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 pt-16 pb-10 text-center">
        {/* Brand label */}
        <span className="inline-block text-xs font-semibold tracking-[0.35em] uppercase text-brand-brown dark:text-brand-accent mb-6 pb-1.5 border-b border-brand-brown/30 dark:border-brand-accent/40">
          Taurus Thrift
        </span>

        {/* Main heading */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-none mb-6 tracking-tight text-foreground dark:text-brand-white"
          style={{ fontFamily: "var(--font-playfair, inherit)" }}
        >
          {heroTitle ?? (
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
        <p className="text-lg md:text-xl text-foreground/55 dark:text-brand-white/60 mb-10 max-w-md mx-auto leading-relaxed">
          {t("subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold transition-all bg-brand-brown hover:bg-brand-brown-dark text-white shadow-sm hover:shadow-md"
            >
              {t("cta")}
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
      </div>

      {/* ── Image Slider ───────────────────────────────────────────── */}
      {banners.length > 0 && (
        <div className="container mx-auto px-4 pb-16">
          <div className="relative overflow-hidden rounded-2xl">
            {/* 16:10 aspect ratio wrapper — wide but not panoramic */}
            <div className="relative w-full aspect-[16/10]">
              <AnimatePresence mode="popLayout">
                {imageUrl && (
                  <motion.div
                    key={`slide-${current}`}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                  >
                    <div className="relative w-full h-full group">
                      <Image
                        src={imageUrl}
                        alt={`Banner ${current + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 90vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        priority={current === 0}
                      />
                      {/* Subtle gradient overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Placeholder when no image */}
              {!imageUrl && (
                <div className="absolute inset-0 bg-brand-beige dark:bg-neutral-900 flex items-center justify-center">
                  <span className="text-foreground/30 text-sm">No banner image</span>
                </div>
              )}
            </div>

            {/* Pagination dots — visual indicators only, not interactive */}
            {total > 1 && (
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-20" aria-hidden="true">
                {banners.map((_, i) => (
                  <span
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-6 h-2 bg-white shadow-sm"
                        : "w-2 h-2 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Premium border frame */}
          <div className="mt-3 h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-brand-brown/20 to-transparent" />
        </div>
      )}
    </section>
  );
}
