"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Props = {
  images: string[];
  name: string;
};

export function ProductImageGallery({ images, name }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images.length) {
    return (
      <div className="aspect-[3/4] rounded-2xl bg-brand-beige dark:bg-muted flex items-center justify-center">
        <span className="text-6xl opacity-20">👗</span>
      </div>
    );
  }

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-beige dark:bg-muted cursor-zoom-in group"
        onClick={() => setLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex]}
              alt={`${name} ${activeIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/30 rounded-full p-2">
            <ZoomIn className="h-5 w-5 text-white" />
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute start-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full p-1.5 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute end-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full p-1.5 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 w-16 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                i === activeIndex ? "border-brand-brown" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt={`${name} ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-3xl p-2 bg-black/95 border-0">
          <div className="relative aspect-[3/4] max-h-[80vh] w-full">
            <Image
              src={images[activeIndex]}
              alt={name}
              fill
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-contain"
            />
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute start-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors">
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <button onClick={next} className="absolute end-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors">
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
