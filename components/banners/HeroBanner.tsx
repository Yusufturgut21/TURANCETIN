"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SmartImage } from "@/components/ui/SmartImage";

type Banner = {
  _id: string;
  title: string;
  description?: string;
  image: { url: string };
  buttonText?: string;
  buttonLink?: string;
};

export function HeroBanner({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const count = banners.length;

  const next = useCallback(() => {
    if (!count) return;
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (!count) return;
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(next, 6500);
    return () => clearInterval(timer);
  }, [count, next]);

  if (!count) {
    return (
      <section className="relative h-[72vh] min-h-[460px] w-full overflow-hidden bg-navy md:h-[82vh] md:min-h-[560px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.14),_transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
        <div className="container-main relative z-10 flex h-full flex-col justify-end pb-16 pt-28 md:pb-24">
          <p className="font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
            TURANÇETİN
          </p>
          <h1 className="mt-4 max-w-xl text-lg text-white/85 md:text-xl">
            Beyaz eşya ve küçük ev aletlerinde güvenilir seçim.
          </h1>
          <div className="mt-8">
            <Link
              href="/urunler"
              className="btn-primary bg-white text-navy hover:bg-surface"
            >
              Ürünleri İncele
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const current = banners[index];

  return (
    <section className="relative h-[72vh] min-h-[460px] w-full overflow-hidden bg-anthracite md:h-[82vh] md:min-h-[560px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current._id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <SmartImage
            src={current.image.url}
            alt={current.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="container-main relative z-10 flex h-full flex-col justify-end pb-16 pt-28 md:pb-24">
        <p className="mb-3 font-display text-xs font-semibold tracking-[0.28em] text-white/75 uppercase md:text-sm">
          TURANÇETİN
        </p>
        <h1 className="max-w-3xl font-display text-3xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
          {current.title}
        </h1>
        {current.description ? (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            {current.description}
          </p>
        ) : null}
        {current.buttonText && current.buttonLink ? (
          <div className="mt-8">
            <Link
              href={current.buttonLink}
              className="btn-primary bg-white text-navy shadow-[0_12px_30px_rgba(0,0,0,0.25)] hover:bg-white/95"
            >
              {current.buttonText}
            </Link>
          </div>
        ) : null}
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Önceki"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/15 p-2.5 text-white shadow-sm backdrop-blur-md transition hover:bg-white/25 md:left-6 md:p-3"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Sonraki"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/15 p-2.5 text-white shadow-sm backdrop-blur-md transition hover:bg-white/25 md:right-6 md:p-3"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2.5 md:bottom-8">
            {banners.map((b, i) => (
              <button
                key={b._id}
                type="button"
                aria-label={`Banner ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-10 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
