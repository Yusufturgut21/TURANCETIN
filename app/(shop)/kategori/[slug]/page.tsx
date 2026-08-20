import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { getCategoryBySlug, getProducts } from "@/lib/queries";
import { COMPANY_SHORT_NAME } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Kategori" };
  return {
    title: category.seoTitle || category.name,
    description:
      category.seoDescription ||
      category.description ||
      `${category.name} ürünleri | ${COMPANY_SHORT_NAME}`,
    alternates: { canonical: `/kategori/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const result = await getProducts({ category: category.slug, limit: 24 });

  return (
    <div className="container-main py-10 md:py-14">
      <h1 className="font-display text-3xl font-semibold text-navy">
        {category.name}
      </h1>
      {category.description ? (
        <p className="mt-3 max-w-2xl text-muted">{category.description}</p>
      ) : null}

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
        {result.items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {result.items.length === 0 ? (
        <p className="mt-8 text-muted">Bu kategoride henüz ürün yok.</p>
      ) : null}
    </div>
  );
}
