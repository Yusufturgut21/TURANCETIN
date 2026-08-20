import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { getBrandBySlug, getProducts } from "@/lib/queries";
import { COMPANY_SHORT_NAME } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: "Marka" };
  return {
    title: brand.seoTitle || brand.name,
    description:
      brand.seoDescription ||
      brand.description ||
      `${brand.name} ürünleri | ${COMPANY_SHORT_NAME}`,
    alternates: { canonical: `/marka/${brand.slug}` },
  };
}

export default async function BrandPage({ params }: Params) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const result = await getProducts({ brand: brand.slug, limit: 24 });

  return (
    <div className="container-main py-10 md:py-14">
      <h1 className="font-display text-3xl font-semibold text-navy">
        {brand.name}
      </h1>
      {brand.description ? (
        <p className="mt-3 max-w-2xl text-muted">{brand.description}</p>
      ) : null}

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
        {result.items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {result.items.length === 0 ? (
        <p className="mt-8 text-muted">Bu markaya ait ürün bulunamadı.</p>
      ) : null}
    </div>
  );
}
