import type { Metadata } from "next";
import { getSiteSettingsSafe } from "@/lib/settings";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Firmamızdan görüntüler ve çalışmalarımız.",
};

export default async function GalleryPage() {
  const settings = await getSiteSettingsSafe();
  const images =
    (settings as { galleryImages?: { url: string; publicId: string }[] })
      .galleryImages ?? [];

  return (
    <div className="container-main py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-navy md:text-4xl">
          Firmamızdan Görüntüler
        </h1>
        <p className="mt-3 text-base text-muted">
          Mağazamız, ürünlerimiz ve ekibimizden kareler. Kalite ve güveni her
          ayrıntıda hissedebilirsiniz.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <span className="inline-block h-1 w-12 rounded-full bg-navy/20" />
          <span className="inline-block h-1 w-4 rounded-full bg-navy" />
          <span className="inline-block h-1 w-12 rounded-full bg-navy/20" />
        </div>
      </div>

      {images.length > 0 ? (
        <div className="mt-12">
          <GalleryGrid images={images} />
        </div>
      ) : (
        <div className="mt-16 rounded-2xl border border-border bg-surface py-16 text-center">
          <p className="text-muted">Henüz görsel eklenmemiş.</p>
        </div>
      )}
    </div>
  );
}
