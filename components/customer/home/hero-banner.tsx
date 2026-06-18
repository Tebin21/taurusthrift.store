"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const total = banners.length;

  const goTo = useCallback(
    (index: number, dir?: number) => {
      const next = (index + total) % total;
      setDirection(dir ?? (next > current ? 1 : -1));
      setCurrent(next);
    },
    [total, current]
  );

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    timerRef.current = setInterval(next, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused, next]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") isRtl ? prev() : next();
      if (e.key === "ArrowLeft") isRtl ? next() : prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isRtl, next, prev]);

  // Touch/swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) {
      isRtl ? prev() : next();
    } else {
      isRtl ? next() : prev();
    }
  };

  // Slide animation variants — direction and RTL aware
  const slideVariants = {
    enter: (d: number) => ({
      x: d * (isRtl ? -1 : 1) > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
    exit: (d: number) => ({
      x: d * (isRtl ? -1 : 1) > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    }),
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
          <div
            className="relative overflow-hidden rounded-2xl"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* 16:7 aspect ratio wrapper */}
            <div className="relative w-full" style={{ paddingBottom: "43.75%" /* 7/16 */ }}>
              <AnimatePresence mode="popLayout" custom={direction}>
                {imageUrl && (
                  <motion.div
                    key={`slide-${current}`}
                    custom={direction}
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

            {/* Prev / Next arrows — only when multiple banners */}
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous banner"
                  className="absolute start-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-foreground dark:text-white shadow-lg transition-all hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5 rtl:hidden" />
                  <ChevronRight className="w-5 h-5 ltr:hidden" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next banner"
                  className="absolute end-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-foreground dark:text-white shadow-lg transition-all hover:scale-105"
                >
                  <ChevronRight className="w-5 h-5 rtl:hidden" />
                  <ChevronLeft className="w-5 h-5 ltr:hidden" />
                </button>
              </>
            )}

            {/* Pagination dots */}
            {total > 1 && (
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-20">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i, i > current ? 1 : -1)}
                    aria-label={`Banner ${i + 1} of ${total}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-6 h-2 bg-white shadow-sm"
                        : "w-2 h-2 bg-white/50 hover:bg-white/80"
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
