import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatPrice } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type ProductCardProps = {
  product: {
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
};

export function ProductCard({ product }: ProductCardProps) {
  const image =
    product.images?.find((i) => i.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "/placeholder-product.svg";

  const hasPrice = product.price != null;
  const hasDiscount =
    hasPrice &&
    product.discountedPrice != null &&
    product.discountedPrice < product.price!;

  return (
    <article className="card-product group flex h-full flex-col overflow-hidden">
      <Link
        href={`/urun/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-b from-surface to-white"
      >
        <SmartImage
          src={image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isCampaign ? (
            <span className="badge badge-campaign">Kampanya</span>
          ) : null}
          {product.isNew ? <span className="badge badge-new">Yeni</span> : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        {product.brand ? (
          <p className="mb-1 text-[0.7rem] font-semibold tracking-[0.14em] text-muted uppercase">
            {product.brand}
          </p>
        ) : null}
        <Link href={`/urun/${product.slug}`}>
          <h3 className="line-clamp-2 text-[0.95rem] font-semibold leading-snug text-navy transition-colors group-hover:text-accent">
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            {hasPrice ? (
              hasDiscount ? (
                <div className="flex flex-col">
                  <span className="text-xs text-muted line-through">
                    {formatPrice(product.price!)}
                  </span>
                  <span className="text-lg font-semibold tracking-tight text-navy">
                    {formatPrice(product.discountedPrice!)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-semibold tracking-tight text-navy">
                  {formatPrice(product.price!)}
                </span>
              )
            ) : (
              <p className="text-sm font-medium text-anthracite">
                Fiyat için iletişime geçin
              </p>
            )}
          </div>
          <Link
            href={`/urun/${product.slug}`}
            aria-label={`${product.title} incele`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-white transition group-hover:bg-accent"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
