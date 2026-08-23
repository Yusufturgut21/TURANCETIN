"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";

type GalleryImage = { url: string; publicId: string };

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const open = (i: number) => {
    setLightbox(i);
    setZoom(1);
  };

  const close = useCallback(() => {
    setLightbox(null);
    setZoom(1);
  }, []);

  const prev = useCallback(() => {
    if (lightbox === null) return;
    setZoom(1);
    setLightbox((lightbox - 1 + images.length) % images.length);
  }, [lightbox, images.length]);

  const next = useCallback(() => {
    if (lightbox === null) return;
    setZoom(1);
    setLightbox((lightbox + 1) % images.length);
  }, [lightbox, images.length]);

  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, close, prev, next]);

  // Scroll kilidi
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <>
      {/* Grid */}
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
        {images.map((img, i) => (
          <div
            key={img.publicId}
            className="group mb-3 cursor-zoom-in overflow-hidden rounded-xl border border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            onClick={() => open(i)}
          >
            <div className="relative aspect-square w-full">
              <SmartImage
                src={img.url}
                alt={`Firma görseli ${i + 1}`}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-navy/0 transition duration-300 group-hover:bg-navy/20">
                <ZoomIn className="h-8 w-8 text-white opacity-0 drop-shadow transition duration-300 group-hover:opacity-100" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          {/* Kapat */}
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/25"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Sayaç */}
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
            {lightbox + 1} / {images.length}
          </div>

          {/* Önceki */}
          {images.length > 1 ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/25"
              aria-label="Önceki"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : null}

          {/* Sonraki */}
          {images.length > 1 ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/25"
              aria-label="Sonraki"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          ) : null}

          {/* Zoom kontrolleri */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-3 py-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(1, z - 0.5)); }}
              className="text-white hover:text-white/70 disabled:opacity-30"
              disabled={zoom <= 1}
              aria-label="Uzaklaştır"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="min-w-[3rem] text-center text-xs text-white">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(4, z + 0.5)); }}
              className="text-white hover:text-white/70 disabled:opacity-30"
              disabled={zoom >= 4}
              aria-label="Yakınlaştır"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </div>

          {/* Görsel */}
          <div
            className="relative flex h-full w-full items-center justify-center p-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                "relative max-h-full max-w-full transition-transform duration-200",
                zoom > 1 ? "cursor-move" : "cursor-zoom-in"
              )}
              style={{ transform: `scale(${zoom})` }}
              onClick={() => setZoom((z) => (z < 4 ? z + 0.5 : 1))}
            >
              <img
                src={images[lightbox].url}
                alt={`Firma görseli ${lightbox + 1}`}
                className="max-h-[80vh] max-w-[80vw] rounded-lg object-contain shadow-2xl"
                draggable={false}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
