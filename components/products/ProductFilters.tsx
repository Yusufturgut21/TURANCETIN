"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { label: string; value: string };

export function ProductFilters({
  brands,
  categories,
}: {
  brands: Option[];
  categories: Option[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [campaign, setCampaign] = useState(searchParams.get("campaign") === "1");
  const [isNew, setIsNew] = useState(searchParams.get("new") === "1");
  const [sort, setSort] = useState(searchParams.get("sort") || "recommended");

  useEffect(() => {
    setBrand(searchParams.get("brand") || "");
    setCategory(searchParams.get("category") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setCampaign(searchParams.get("campaign") === "1");
    setIsNew(searchParams.get("new") === "1");
    setSort(searchParams.get("sort") || "recommended");
  }, [searchParams]);

  function buildParams(overrides: {
    brand?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    campaign?: boolean;
    isNew?: boolean;
    sort?: string;
  } = {}) {
    const next = {
      brand,
      category,
      minPrice,
      maxPrice,
      campaign,
      isNew,
      sort,
      ...overrides,
    };
    const params = new URLSearchParams();
    if (next.brand) params.set("brand", next.brand);
    if (next.category) params.set("category", next.category);
    if (next.minPrice) params.set("minPrice", next.minPrice);
    if (next.maxPrice) params.set("maxPrice", next.maxPrice);
    if (next.sort && next.sort !== "recommended") params.set("sort", next.sort);
    if (next.campaign) params.set("campaign", "1");
    if (next.isNew) params.set("new", "1");
    return params;
  }

  function push(params: URLSearchParams) {
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    setOpen(false);
  }

  function apply() {
    push(buildParams());
  }

  function reset() {
    setBrand("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setCampaign(false);
    setIsNew(false);
    setSort("recommended");
    router.push(pathname);
    setOpen(false);
  }

  function toggleCampaign() {
    const next = !campaign;
    setCampaign(next);
    push(buildParams({ campaign: next }));
  }

  const form = (
    <div className="space-y-4">
      <div>
        <p className="label-field mb-2">Hızlı seçim</p>
        <button
          type="button"
          onClick={toggleCampaign}
          className={cn(
            "w-full rounded-md border px-3 py-2.5 text-left text-sm font-medium transition",
            campaign
              ? "border-navy bg-navy text-white"
              : "border-border bg-white text-navy hover:border-navy/35"
          )}
        >
          Kampanyalı ürünler
        </button>
      </div>
      <div>
        <label className="label-field">Sıralama</label>
        <select className="input-field" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="recommended">Önerilen</option>
          <option value="price-asc">Fiyat: Düşükten yükseğe</option>
          <option value="price-desc">Fiyat: Yüksekten düşüğe</option>
          <option value="newest">Yeni ürünler</option>
        </select>
      </div>
      <div>
        <label className="label-field">Kategori</label>
        <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Tümü</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label-field">Marka</label>
        <select className="input-field" value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Tümü</option>
          {brands.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label-field">Min. fiyat</label>
          <input className="input-field" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className="label-field">Max. fiyat</label>
          <input className="input-field" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="50000" />
        </div>
      </div>
      <p className="text-xs text-muted">
        Fiyat filtresi uygulandığında fiyatı olmayan ürünler listeden çıkarılır.
      </p>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isNew}
          onChange={(e) => setIsNew(e.target.checked)}
        />
        Yeni ürünler
      </label>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={apply} className="btn-primary flex-1 text-sm">
          Uygula
        </button>
        <button type="button" onClick={reset} className="btn-outline flex-1 text-sm">
          Temizle
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-4 lg:hidden">
        <button type="button" onClick={() => setOpen(true)} className="btn-outline w-full text-sm">
          <Filter className="h-4 w-4" /> Filtrele / Sırala
        </button>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-lg border border-border bg-white p-4">
          <h2 className="mb-4 font-semibold text-navy">Filtreler</h2>
          {form}
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[88%] max-w-sm overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-navy">Filtreler</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Kapat">
                <X className="h-5 w-5" />
              </button>
            </div>
            {form}
          </div>
        </div>
      ) : null}
    </>
  );
}
