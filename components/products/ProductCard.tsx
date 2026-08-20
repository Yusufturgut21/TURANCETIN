import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatPrice } from "@/lib/utils";

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
        className="relative block aspect-[4/3] bg-surface"
      >
        <SmartImage
          src={image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isCampaign ? (
            <span className="badge badge-campaign">Kampanya</span>
          ) : null}
          {product.isNew ? <span className="badge badge-new">Yeni</span> : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.brand ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
            {product.brand}
          </p>
        ) : null}
        <Link href={`/urun/${product.slug}`}>
          <h3 className="line-clamp-2 text-[0.95rem] font-semibold text-navy transition-colors group-hover:text-navy-hover">
            {product.title}
          </h3>
        </Link>
        {product.shortDescription ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted">
            {product.shortDescription}
          </p>
        ) : null}

        <div className="mt-auto pt-4">
          {hasPrice ? (
            <div className="mb-3">
              {hasDiscount ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-muted line-through">
                    {formatPrice(product.price!)}
                  </span>
                  <span className="text-lg font-semibold text-navy">
                    {formatPrice(product.discountedPrice!)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-semibold text-navy">
                  {formatPrice(product.price!)}
                </span>
              )}
            </div>
          ) : (
            <p className="mb-3 text-sm font-medium text-anthracite">
              Fiyat için iletişime geçin
            </p>
          )}

          <Link
            href={`/urun/${product.slug}`}
            className="btn-outline w-full text-sm"
          >
            İncele
          </Link>
        </div>
      </div>
    </article>
  );
}
