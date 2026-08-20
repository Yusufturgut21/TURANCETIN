import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/urunler",
    "/urunler?campaign=1",
    "/hakkimizda",
    "/iletisim",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  try {
    await connectDB();
    const [products, categories] = await Promise.all([
      Product.find({ isActive: true }).select("slug updatedAt").lean(),
      Category.find({ isActive: true }).select("slug updatedAt").lean(),
    ]);

    return [
      ...staticPages,
      ...products.map((p) => ({
        url: `${siteUrl}/urun/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...categories.map((c) => ({
        url: `${siteUrl}/kategori/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticPages;
  }
}
