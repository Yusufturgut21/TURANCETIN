import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import {
  getProducts,
  getActiveBrands,
  getActiveCategories,
} from "@/lib/queries";
import type { SortOption } from "@/types";
import type { ProductsResult } from "@/types/dto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ürünler",
  description: "Beyaz eşya ve küçük ev aletleri ürün kataloğu.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const get = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const page = Number(get("page") || 1);
  let result: ProductsResult = {
    items: [],
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  };
  let brandOptions: { label: string; value: string }[] = [];
  let categoryOptions: { label: string; value: string }[] = [];

  try {
    const [products, brands, categories] = await Promise.all([
      getProducts({
        brand: get("brand"),
        category: get("category"),
        minPrice: get("minPrice") ? Number(get("minPrice")) : undefined,
        maxPrice: get("maxPrice") ? Number(get("maxPrice")) : undefined,
        campaign: get("campaign") === "1" || undefined,
        isNew: get("new") === "1" || undefined,
        featured: get("featured") === "1" || undefined,
        search: get("search"),
        sort: (get("sort") as SortOption) || "recommended",
        page,
        limit: 12,
      }),
      getActiveBrands(),
      getActiveCategories(),
    ]);
    result = products;
    brandOptions = brands.map((b) => ({ label: b.name, value: b.slug }));
    categoryOptions = categories.map((c) => ({
      label: c.name,
      value: c.slug,
    }));
  } catch (error) {
    console.error("[urunler]", error instanceof Error ? error.message : error);
  }

  const isCampaignView = get("campaign") === "1";

  return (
    <div className="container-main py-10 md:py-14">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-navy">
          {isCampaignView ? "Kampanyalı Ürünler" : "Ürünler"}
        </h1>
        {get("search") ? (
          <p className="mt-2 text-muted">
            “{get("search")}” için {result.total} sonuç
          </p>
        ) : (
          <p className="mt-2 text-muted">
            {isCampaignView
              ? `${result.total} kampanyalı ürün listeleniyor`
              : `${result.total} ürün listeleniyor`}
          </p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <Suspense fallback={null}>
          <ProductFilters brands={brandOptions} categories={categoryOptions} />
        </Suspense>

        <div>
          {result.items.length === 0 ? (
            <div className="rounded-lg border border-border bg-surface p-10 text-center">
              <p className="text-muted">Ürün bulunamadı.</p>
              <p className="mt-2 text-sm text-muted">
                Veritabanı bağlı değilse `.env.local` içine Atlas URI ekleyip{" "}
                <code className="rounded bg-white px-1">npm run seed</code> çalıştırın.
              </p>
              <Link href="/urunler" className="btn-primary mt-4 inline-flex text-sm">
                Filtreleri temizle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {result.items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {result.totalPages > 1 ? (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
                (p) => {
                  const params = new URLSearchParams();
                  Object.entries(sp).forEach(([k, v]) => {
                    if (typeof v === "string") params.set(k, v);
                  });
                  params.set("page", String(p));
                  return (
                    <Link
                      key={p}
                      href={`/urunler?${params.toString()}`}
                      className={`rounded-md px-3 py-1.5 text-sm ${
                        p === result.page
                          ? "bg-navy text-white"
                          : "border border-border hover:bg-surface"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                }
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
