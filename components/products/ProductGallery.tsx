"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";

type Img = { url: string; isPrimary?: boolean };

export function ProductGallery({
  images,
  title,
}: {
  images: Img[];
  title: string;
}) {
  const list = images?.length ? images : [{ url: "/placeholder-product.svg" }];
  const primaryIndex = Math.max(0, list.findIndex((i) => i.isPrimary));
  const [active, setActive] = useState(primaryIndex);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(active);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPinchDist = useRef<number | null>(null);

  const openLightbox = useCallback(
    (index: number) => {
      setLightboxIndex(index);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setLightboxOpen(true);
    },
    []
  );

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const resetZoomPan = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const changeImage = useCallback(
    (index: number) => {
      setLightboxIndex(index);
      resetZoomPan();
    },
    []
  );

  const prevImage = useCallback(() => {
    changeImage((lightboxIndex - 1 + list.length) % list.length);
  }, [lightboxIndex, list.length, changeImage]);

  const nextImage = useCallback(() => {
    changeImage((lightboxIndex + 1) % list.length);
  }, [lightboxIndex, list.length, changeImage]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "+" || e.key === "=")
        setZoom((z) => Math.min(z + 0.5, 5));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, closeLightbox, prevImage, nextImage]);

  // Scroll zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => {
      const next = z - e.deltaY * 0.001 * z;
      return Math.min(Math.max(next, 1), 5);
    });
    if (zoom <= 1) setPan({ x: 0, y: 0 });
  }, [zoom]);

  // Mouse drag pan
  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPan({
      x: panStart.current.x + (e.clientX - dragStart.current.x),
      y: panStart.current.y + (e.clientY - dragStart.current.y),
    });
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  // Touch pinch zoom
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.sqrt(dx * dx + dy * dy);
    } else if (e.touches.length === 1 && zoom > 1) {
      isDragging.current = true;
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStart.current = { ...pan };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDist.current !== null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const scale = dist / lastPinchDist.current;
      lastPinchDist.current = dist;
      setZoom((z) => Math.min(Math.max(z * scale, 1), 5));
    } else if (e.touches.length === 1 && isDragging.current) {
      setPan({
        x: panStart.current.x + (e.touches[0].clientX - dragStart.current.x),
        y: panStart.current.y + (e.touches[0].clientY - dragStart.current.y),
      });
    }
  };

  const onTouchEnd = () => {
    isDragging.current = false;
    lastPinchDist.current = null;
    if (zoom <= 1) setPan({ x: 0, y: 0 });
  };

  return (
    <>
      {/* Ana Galeri */}
      <div>
        <button
          type="button"
          onClick={() => openLightbox(active)}
          className="group relative block w-full aspect-square overflow-hidden rounded-lg border border-border bg-surface cursor-zoom-in"
          aria-label="Görseli büyüt"
        >
          <SmartImage
            src={list[active]?.url || list[0].url}
            alt={title}
            fill
            priority
            className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width:768px) 100vw, 50vw"
          />
          <span className="absolute bottom-3 right-3 rounded-md bg-black/40 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="h-4 w-4" />
          </span>
        </button>

        {list.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {list.map((img, i) => (
              <button
                key={`${img.url}-${i}`}
                type="button"
                onClick={() => {
                  setActive(i);
                  openLightbox(i);
                }}
                className={`relative aspect-square overflow-hidden rounded border bg-surface transition-all ${
                  i === active
                    ? "border-navy ring-1 ring-navy"
                    : "border-border hover:border-navy/50"
                }`}
              >
                <SmartImage
                  src={img.url}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          {/* Üst araçlar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10">
            <span className="text-sm text-white/70">
              {list.length > 1 && `${lightboxIndex + 1} / ${list.length}`}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
                disabled={zoom <= 1}
                className="rounded-md bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-30 transition-colors"
                aria-label="Uzaklaştır"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="min-w-[3rem] text-center text-sm text-white/80">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(z + 0.5, 5))}
                disabled={zoom >= 5}
                className="rounded-md bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-30 transition-colors"
                aria-label="Yakınlaştır"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                className="ml-2 rounded-md bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Sol/Sağ oklar */}
          {list.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/25 transition-colors z-10"
                aria-label="Önceki"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/25 transition-colors z-10"
                aria-label="Sonraki"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Görsel alanı */}
          <div
            ref={containerRef}
            className="relative flex h-full w-full items-center justify-center overflow-hidden"
            onWheel={handleWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ cursor: zoom > 1 ? "grab" : "zoom-in" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={list[lightboxIndex]?.url || list[0].url}
              alt={title}
              draggable={false}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transition: isDragging.current ? "none" : "transform 0.15s ease",
                userSelect: "none",
                touchAction: "none",
              }}
              onDoubleClick={() => {
                if (zoom > 1) resetZoomPan();
                else setZoom(2.5);
              }}
            />
          </div>

          {/* Alt thumbnail şerit */}
          {list.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {list.map((img, i) => (
                <button
                  key={`lb-${img.url}-${i}`}
                  type="button"
                  onClick={() => changeImage(i)}
                  className={`relative h-12 w-12 overflow-hidden rounded border-2 transition-all ${
                    i === lightboxIndex
                      ? "border-white opacity-100"
                      : "border-white/30 opacity-60 hover:opacity-90"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Çift tık ipucu */}
          <p className="absolute bottom-20 left-1/2 -translate-x-1/2 text-xs text-white/40 pointer-events-none">
            {zoom > 1 ? "Sıfırlamak için çift tıklayın" : "Yakınlaştırmak için çift tıklayın veya kaydırın"}
          </p>
        </div>
      )}
    </>
  );
}
