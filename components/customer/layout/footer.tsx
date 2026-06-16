"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";


export function CustomerFooter() {
  const t = useTranslations("nav");
  const tc = useTranslations("contact");
  const locale = useLocale();

  return (
    <footer className="relative border-t border-foreground/8 mt-16 overflow-hidden pb-28 md:pb-0" style={{ background: "#111111" }}>

      <div className="container mx-auto px-4 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-5">
              <Image src="/logo-white.png" alt="Taurus Thrift" width={36} height={36} className="h-9 w-auto" />
              <span className="font-semibold text-lg text-white">Taurus Thrift</span>
            </Link>
            <p className="text-sm text-white/45 max-w-xs leading-relaxed">
              Curated thrift fashion for the discerning eye. Premium quality, timeless pieces, sustainably sourced.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[
                {
                  label: "Instagram",
                  href: "https://www.instagram.com/taurus.thriftt",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  ),
                },
                {
                  label: "TikTok",
                  href: "https://www.tiktok.com/@taurus.thriftt",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.77a8.16 8.16 0 0 0 4.77 1.52V6.84a4.85 4.85 0 0 1-1-.15z"/>
                    </svg>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-white/12 flex items-center justify-center text-white/45 hover:text-brand-accent hover:border-brand-accent/40 transition-all duration-200"
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-xs mb-4 uppercase tracking-[0.18em] text-brand-accent">
              Navigate
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: `/${locale}`, label: t("home") },
                { href: `/${locale}/products`, label: t("products") },
                { href: `/${locale}/categories`, label: t("categories") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/45 hover:text-brand-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-xs mb-4 uppercase tracking-[0.18em] text-brand-accent">
              {tc("info")}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/45">
              <li>{tc("hoursValue")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Taurus Thrift. All rights reserved.
          </p>
          <p className="text-xs text-white/25">
            Sustainable Fashion • Curated Quality
          </p>
        </div>
      </div>
    </footer>
  );
}
