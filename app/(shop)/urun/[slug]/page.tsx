import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductCard } from "@/components/products/ProductCard";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { formatPrice, getWhatsAppUrl, COMPANY_SHORT_NAME } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Ürün bulunamadı" };

  const title =
    product.seoTitle || `${product.title} | ${COMPANY_SHORT_NAME}`;
  const description =
    product.seoDescription ||
    product.shortDescription ||
    `${product.title} hakkında bilgi alın.`;

  return {
    title: product.seoTitle || product.title,
    description,
    alternates: { canonical: `/urun/${product.slug}` },
    openGraph: {
      title,
      description,
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categoryId =
    typeof product.category === "object" && product.category
      ? product.category._id
      : String(product.category || "");

  const [related, settings] = await Promise.all([
    getRelatedProducts(categoryId, product._id),
    getSiteSettings(),
  ]);

  const price = typeof product.price === "number" ? product.price : null;
  const discounted =
    typeof product.discountedPrice === "number"
      ? product.discountedPrice
      : null;
  const hasPrice = price != null;
  const hasDiscount = hasPrice && discounted != null && discounted < price;

  const waMessage = `Merhaba, ${product.title} hakkında bilgi almak istiyorum.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription || product.description || product.title,
    image: product.images?.map((i: { url: string }) => i.url),
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    sku: product.model || product.slug,
    offers: hasPrice
      ? {
          "@type": "Offer",
          priceCurrency: "TRY",
          price: hasDiscount ? discounted : price,
          availability: "https://schema.org/InStock",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/urun/${product.slug}`,
        }
      : {
          "@type": "Offer",
          priceCurrency: "TRY",
          availability: "https://schema.org/InStock",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/urun/${product.slug}`,
        },
  };

  return (
    <div className="container-main py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-navy">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <Link href="/urunler" className="hover:text-navy">Ürünler</Link>
        {product.category &&
        typeof product.category === "object" &&
        product.category.slug ? (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/kategori/${product.category.slug}`}
              className="hover:text-navy"
            >
              {product.category.name}
            </Link>
          </>
        ) : null}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />

        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {product.isCampaign ? (
              <span className="badge badge-campaign">Kampanya</span>
            ) : null}
            {product.isNew ? <span className="badge badge-new">Yeni</span> : null}
          </div>

          {product.brand ? (
            <Link
              href={`/marka/${encodeURIComponent(product.brand.toLowerCase().replace(/\s+/g, "-"))}`}
              className="text-sm font-semibold uppercase tracking-wide text-muted hover:text-navy"
            >
              {product.brand}
            </Link>
          ) : null}

          <h1 className="mt-1 font-display text-3xl font-semibold text-navy md:text-4xl">
            {product.title}
          </h1>

          {product.model ? (
            <p className="mt-2 text-sm text-muted">Model: {product.model}</p>
          ) : null}

          {product.shortDescription ? (
            <p className="mt-4 text-base leading-relaxed text-anthracite">
              {product.shortDescription}
            </p>
          ) : null}

          <div className="mt-6 rounded-lg border border-border bg-surface p-5">
            {hasPrice ? (
              hasDiscount ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-muted line-through">
                    {formatPrice(price)}
                  </span>
                  <span className="text-3xl font-semibold text-navy">
                    {formatPrice(discounted!)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-semibold text-navy">
                  {formatPrice(price)}
                </span>
              )
            ) : (
              <p className="text-base font-medium text-anthracite">
                Güncel fiyat ve stok bilgisi için iletişime geçin.
              </p>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {settings.whatsapp ? (
                <a
                  href={getWhatsAppUrl(settings.whatsapp, waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp flex-1"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp&apos;tan Bilgi Al
                </a>
              ) : null}
              {settings.phone ? (
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="btn-outline flex-1"
                >
                  <Phone className="h-5 w-5" />
                  Telefonla Ara
                </a>
              ) : null}
            </div>
          </div>

          {product.warranty ? (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                Garanti
              </h2>
              <p className="mt-1 text-anthracite">{product.warranty}</p>
            </div>
          ) : null}

          {product.specifications?.length ? (
            <div className="mt-8">
              <h2 className="mb-3 font-semibold text-navy">Teknik Özellikler</h2>
              <dl className="overflow-hidden rounded-lg border border-border">
                {product.specifications.map(
                  (spec: { key: string; value: string }, i: number) => (
                    <div
                      key={`${spec.key}-${i}`}
                      className={`grid grid-cols-2 text-sm ${
                        i % 2 === 0 ? "bg-surface" : "bg-white"
                      }`}
                    >
                      <dt className="border-r border-border px-4 py-3 font-medium text-anthracite">
                        {spec.key}
                      </dt>
                      <dd className="px-4 py-3 text-muted">{spec.value}</dd>
                    </div>
                  )
                )}
              </dl>
            </div>
          ) : null}
        </div>
      </div>

      {product.description ? (
        <section className="mt-12 max-w-3xl">
          <h2 className="mb-3 font-semibold text-navy">Ürün Açıklaması</h2>
          <div className="prose-content whitespace-pre-line">
            <p>{product.description}</p>
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="section-title font-display mb-6">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
