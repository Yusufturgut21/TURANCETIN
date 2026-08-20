import type { Metadata } from "next";
import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { getActiveBrands } from "@/lib/queries";
import type { BrandDTO } from "@/types/dto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Markalar",
  description: "Çalıştığımız beyaz eşya ve ev aleti markaları.",
};

export default async function BrandsPage() {
  let brands: BrandDTO[] = [];
  try {
    brands = await getActiveBrands();
  } catch (error) {
    console.error("[markalar]", error instanceof Error ? error.message : error);
  }

  return (
    <div className="container-main py-10 md:py-14">
      <h1 className="font-display text-3xl font-semibold text-navy">Markalar</h1>
      <p className="mt-2 text-muted">Markaya tıklayarak ürünleri görüntüleyin.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {brands.map((brand) => (
          <Link
            key={brand._id}
            href={`/marka/${brand.slug}`}
            className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-white p-6 transition hover:border-navy/30 hover:shadow-sm"
          >
            {brand.logo?.url ? (
              <SmartImage
                src={brand.logo.url}
                alt={brand.name}
                width={120}
                height={48}
                keepAspect
                className="max-h-12 object-contain"
              />
            ) : (
              <span className="font-display text-lg font-semibold text-navy">
                {brand.name}
              </span>
            )}
            <span className="text-sm text-muted">{brand.name}</span>
          </Link>
        ))}
      </div>

      {brands.length === 0 ? (
        <div className="mt-8 rounded-lg border border-border bg-surface p-8 text-center text-muted">
          <p>Henüz marka yok veya veritabanı bağlı değil.</p>
        </div>
      ) : null}
    </div>
  );
}
