import Link from "next/link";
import { HeroBanner } from "@/components/banners/HeroBanner";
import { CategoryGrid } from "@/components/categories/CategoryGrid";
import { ProductCard } from "@/components/products/ProductCard";
import { WhyUs } from "@/components/home/WhyUs";
import { FeaturedByCategory } from "@/components/home/FeaturedByCategory";
import { FadeIn, SectionHeading } from "@/components/ui/Motion";
import {
  getActiveBanners,
  getActiveCategories,
  getProducts,
} from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { getWhatsAppUrl } from "@/lib/utils";
import { MessageCircle, Phone } from "lucide-react";
import type { ProductDTO } from "@/types/dto";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let banners: Awaited<ReturnType<typeof getActiveBanners>> = [];
  let categories: Awaited<ReturnType<typeof getActiveCategories>> = [];
  let featured = { items: [] as ProductDTO[] };
  let campaignProducts = { items: [] as ProductDTO[] };
  let productsByCategory: Record<string, ProductDTO[]> = {};
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null;

  try {
    [banners, categories, featured, campaignProducts, settings] =
      await Promise.all([
        getActiveBanners(),
        getActiveCategories(),
        getProducts({ featured: true, limit: 8 }),
        getProducts({ campaign: true, limit: 1000 }),
        getSiteSettings(),
      ]);

    if (categories.length > 0) {
      const entries = await Promise.all(
        categories.map(async (category) => {
          const result = await getProducts({
            category: category.slug,
            limit: 1000,
          });
          return [category.slug, result.items] as const;
        })
      );
      productsByCategory = Object.fromEntries(entries);
    }
  } catch {
    // DB henüz bağlı değilse boş ana sayfa göster
  }

  const showFeaturedSection =
    featured.items.length > 0 ||
    Object.values(productsByCategory).some((items) => items.length > 0);

  return (
    <>
      <HeroBanner banners={banners} />

      {categories.length > 0 ? (
        <section className="py-16 md:py-20">
          <div className="container-main">
            <FadeIn>
              <SectionHeading
                title="Ürün Kategorileri"
                subtitle="İhtiyacınıza uygun kategoriyi seçin."
              />
              <CategoryGrid categories={categories} />
            </FadeIn>
          </div>
        </section>
      ) : null}

      {campaignProducts.items.length > 0 ? (
        <section className="py-16 md:py-20">
          <div className="container-main">
          <FadeIn>
            <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
              <SectionHeading
                title="Kampanyalı Ürünler"
                subtitle="Avantajlı fırsatlar."
                className="mb-0"
              />
              <Link
                href="/urunler?campaign=1"
                className="hidden text-sm font-semibold text-navy hover:text-accent md:inline"
              >
                Tümünü gör →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
              {campaignProducts.items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="mt-6 text-center md:hidden">
              <Link
                href="/urunler?campaign=1"
                className="text-sm font-semibold text-navy hover:text-accent"
              >
                Tümünü gör →
              </Link>
            </div>
          </FadeIn>
          </div>
        </section>
      ) : null}

      {showFeaturedSection ? (
        <FadeIn>
          <FeaturedByCategory
            categories={categories.map((c) => ({
              _id: c._id,
              name: c.name,
              slug: c.slug,
            }))}
            featuredProducts={featured.items}
            campaignProducts={campaignProducts.items}
            productsByCategory={productsByCategory}
          />
        </FadeIn>
      ) : null}

      {settings?.whyUsItems?.length ? (
        <FadeIn>
          <WhyUs
            title={settings.whyUsTitle || "Neden Biz?"}
            items={settings.whyUsItems}
          />
        </FadeIn>
      ) : null}

      <section className="container-main py-16 md:py-20">
        <FadeIn>
          <div className="overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0b1f36] via-[#123153] to-[#1a4d6d] px-6 py-12 text-white shadow-[0_24px_60px_rgba(11,31,54,0.22)] md:px-12 md:py-14">
            <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight md:text-4xl">
                  WhatsApp ile hızlı bilgi alın
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
                  Ürün, stok ve güncel fiyat bilgisi için bize WhatsApp veya
                  telefon üzerinden ulaşabilirsiniz.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                {settings?.whatsapp ? (
                  <a
                    href={getWhatsAppUrl(
                      settings.whatsapp,
                      "Merhaba, ürünler hakkında bilgi almak istiyorum."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </a>
                ) : null}
                {settings?.phone ? (
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, "")}`}
                    className="btn-outline border-white/30 bg-transparent text-white hover:bg-white/10"
                  >
                    <Phone className="h-5 w-5" />
                    {settings.phone}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {settings?.aboutContent ? (
        <section className="border-t border-border bg-surface py-14 md:py-16">
          <div className="container-main max-w-3xl">
            <FadeIn>
              <h2 className="section-title font-display">
                {settings.aboutTitle || "Kurumsal"}
              </h2>
              <p className="mt-4 text-sm font-medium text-navy">
                {settings.companyName}
              </p>
              <div className="prose-content mt-4">
                <p>{settings.aboutContent}</p>
              </div>
              <Link href="/hakkimizda" className="mt-6 inline-flex text-sm font-semibold text-navy hover:underline">
                Daha fazla bilgi →
              </Link>
            </FadeIn>
          </div>
        </section>
      ) : null}
    </>
  );
}
