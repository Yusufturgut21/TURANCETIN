"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type PointerEvent,
  type MouseEvent,
} from "react";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeading } from "@/components/ui/Motion";
import { cn } from "@/lib/utils";

type CategoryTab = {
  _id: string;
  name: string;
  slug: string;
};

type ProductItem = {
  _id: string;
  title: string;
  brand?: string;
  shortDescription?: string;
  slug: string;
  price?: number | null;
  discountedPrice?: number | null;
  images: { url: string; isPrimary?: boolean }[];
  isCampaign?: boolean;
  isNew?: boolean;
};

type FeaturedByCategoryProps = {
  categories: CategoryTab[];
  featuredProducts: ProductItem[];
  campaignProducts?: ProductItem[];
  productsByCategory: Record<string, ProductItem[]>;
};

const ALL_KEY = "__all__";
const CAMPAIGN_KEY = "__campaign__";

export function FeaturedByCategory({
  categories,
  featuredProducts,
  campaignProducts = [],
  productsByCategory,
}: FeaturedByCategoryProps) {
  const [active, setActive] = useState(ALL_KEY);
  const [products, setProducts] = useState<ProductItem[]>(featuredProducts);
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const suppressClick = useRef(false);
  const drag = useRef<{
    pointerId: number | null;
    startX: number;
    scrollLeft: number;
    dragging: boolean;
  }>({ pointerId: null, startX: 0, scrollLeft: 0, dragging: false });

  const tabs = useMemo(() => {
    const list: CategoryTab[] = [
      { _id: ALL_KEY, name: "Tümü", slug: ALL_KEY },
      ...categories,
    ];
    return list;
  }, [categories]);

  const viewAllHref =
    active === ALL_KEY
      ? "/urunler"
      : active === CAMPAIGN_KEY
        ? "/urunler?campaign=1"
        : `/kategori/${active}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (active === ALL_KEY) {
          setLoading(true);
          try {
            const res = await fetch("/api/products?limit=1000&sort=recommended", { cache: "no-store" });
            const json = (await res.json()) as {
              success?: boolean;
              data?: { items?: ProductItem[] };
            };
            if (!cancelled && json.success && Array.isArray(json.data?.items)) {
              setProducts(json.data.items);
            } else if (!cancelled && featuredProducts.length > 0) {
              setProducts(featuredProducts);
            }
          } catch {
            if (!cancelled) setProducts(featuredProducts);
          } finally {
            if (!cancelled) setLoading(false);
          }
          return;
        }

      setLoading(true);

      const endpoint =
        active === CAMPAIGN_KEY
          ? "/api/products?campaign=1&limit=1000"
          : `/api/products?category=${encodeURIComponent(active)}&limit=1000`;

      // Önce varsa önbelleği göster, sonra API'den tam listeyi al
      if (active === CAMPAIGN_KEY && campaignProducts.length) {
        setProducts(campaignProducts);
      } else if (active !== CAMPAIGN_KEY && productsByCategory[active]?.length) {
        setProducts(productsByCategory[active]);
      } else {
        setProducts([]);
      }

      try {
        const res = await fetch(endpoint, { cache: "no-store" });
        const json = (await res.json()) as {
          success?: boolean;
          data?: { items?: ProductItem[] };
        };
        if (!cancelled && json.success && Array.isArray(json.data?.items)) {
          setProducts(json.data.items);
        }
      } catch {
        // önbellekteki liste kalsın
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [active, featuredProducts, campaignProducts, productsByCategory]);

  const onPointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      dragging: false,
    };
  }, []);

  const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const state = drag.current;
    if (!el || state.pointerId !== e.pointerId) return;

    const dx = e.clientX - state.startX;
    if (!state.dragging && Math.abs(dx) > 8) {
      state.dragging = true;
      el.setPointerCapture(e.pointerId);
    }
    if (state.dragging) {
      el.scrollLeft = state.scrollLeft - dx;
    }
  }, []);

  const endDrag = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const state = drag.current;
    if (state.pointerId !== e.pointerId) return;

    if (state.dragging) {
      suppressClick.current = true;
      try {
        el?.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
    state.pointerId = null;
    state.dragging = false;
  }, []);

  const onTabClick = (slug: string, e: MouseEvent<HTMLButtonElement>) => {
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick.current = false;
      return;
    }
    setActive(slug);
  };

  if (!featuredProducts.length && categories.length === 0) return null;

  return (
    <section className="container-main py-16 md:py-20">
      <div className="mb-6 flex flex-col gap-5 md:mb-8 md:flex-row md:items-end md:justify-between md:gap-8">
        <SectionHeading
          title="Öne Çıkan Ürünler"
          subtitle="Sizin için seçtiğimiz ürünler."
          className="mb-0 shrink-0"
        />

        <div className="min-w-0 flex-1 md:max-w-2xl lg:max-w-3xl">
          <div
            ref={scrollerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="flex cursor-grab touch-pan-x gap-2 overflow-x-auto pb-1 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => {
              const isActive = active === tab.slug;
              return (
                <button
                  key={tab._id}
                  type="button"
                  onClick={(e) => onTabClick(tab.slug, e)}
                  className={cn(
                    "shrink-0 select-none rounded-full border px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "border-navy bg-navy text-white shadow-[0_8px_18px_rgba(11,31,54,0.18)]"
                      : "border-transparent bg-white/80 text-navy shadow-sm hover:bg-white"
                  )}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <Link
          href={viewAllHref}
          className="hidden shrink-0 text-sm font-semibold text-navy hover:underline lg:inline"
        >
          Tümünü gör →
        </Link>
      </div>

      <div className={cn("relative", loading && "opacity-60")}>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-border bg-surface px-4 py-10 text-center text-sm text-muted">
            {loading
              ? "Ürünler yükleniyor..."
              : "Bu kategoride henüz ürün bulunmuyor."}
          </p>
        )}
      </div>

      <div className="mt-6 text-center lg:hidden">
        <Link href={viewAllHref} className="text-sm font-semibold text-navy hover:underline">
          Tümünü gör →
        </Link>
      </div>
    </section>
  );
}
