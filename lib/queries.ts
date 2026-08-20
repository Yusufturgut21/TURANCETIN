import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Brand } from "@/models/Brand";
import { Campaign } from "@/models/Campaign";
import { Banner } from "@/models/Banner";
import type { ProductFilters } from "@/types";
import type {
  BannerDTO,
  BrandDTO,
  CampaignDTO,
  CategoryDTO,
  ProductDTO,
  ProductsResult,
} from "@/types/dto";
import { isCampaignActive } from "@/lib/utils";

type MongoQuery = Record<string, unknown>;

function serialize<T>(data: unknown): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

export async function getActiveCategories(): Promise<CategoryDTO[]> {
  await connectDB();
  const categories = await Category.find({ isActive: true, parent: null })
    .sort({ sortOrder: 1, name: 1 })
    .lean();
  return serialize<CategoryDTO[]>(categories);
}

export async function getCategoryBySlug(
  slug: string
): Promise<CategoryDTO | null> {
  await connectDB();
  const category = await Category.findOne({ slug, isActive: true }).lean();
  return category ? serialize<CategoryDTO>(category) : null;
}

export async function getActiveBrands(): Promise<BrandDTO[]> {
  await connectDB();
  const brands = await Brand.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .lean();
  return serialize<BrandDTO[]>(brands);
}

export async function getBrandBySlug(slug: string): Promise<BrandDTO | null> {
  await connectDB();
  const brand = await Brand.findOne({ slug, isActive: true }).lean();
  return brand ? serialize<BrandDTO>(brand) : null;
}

export async function getActiveBanners(): Promise<BannerDTO[]> {
  await connectDB();
  const banners = await Banner.find({ isActive: true })
    .sort({ sortOrder: 1 })
    .lean();
  return serialize<BannerDTO[]>(banners);
}

export async function getActiveCampaigns(): Promise<CampaignDTO[]> {
  await connectDB();
  const campaigns = await Campaign.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();

  const now = new Date();
  const filtered = campaigns.filter((c) =>
    isCampaignActive(c.startDate, c.endDate, true)
  );

  const expiredIds = campaigns
    .filter((c) => c.endDate && new Date(c.endDate) < now && c.isActive)
    .map((c) => c._id);
  if (expiredIds.length) {
    await Campaign.updateMany(
      { _id: { $in: expiredIds } },
      { $set: { isActive: false } }
    );
  }

  return serialize<CampaignDTO[]>(filtered);
}

export async function getCampaignBySlug(
  slug: string
): Promise<CampaignDTO | null> {
  await connectDB();
  const campaign = await Campaign.findOne({ slug }).populate("products").lean();
  if (!campaign) return null;
  if (
    !isCampaignActive(campaign.startDate, campaign.endDate, campaign.isActive)
  ) {
    return null;
  }
  return serialize<CampaignDTO>(campaign);
}

export async function getProductBySlug(
  slug: string
): Promise<ProductDTO | null> {
  await connectDB();
  const product = await Product.findOne({ slug, isActive: true })
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .lean();
  return product ? serialize<ProductDTO>(product) : null;
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductsResult> {
  await connectDB();
  const {
    brand,
    category,
    minPrice,
    maxPrice,
    campaign,
    isNew,
    featured,
    search,
    sort = "recommended",
    page = 1,
    limit = 12,
  } = filters;

  const query: MongoQuery = { isActive: true };

  if (brand) {
    const brandDoc = await Brand.findOne({
      $or: [{ slug: brand }, { name: brand }],
    }).lean();
    if (brandDoc) {
      query.$or = [
        { brand: new RegExp(`^${brandDoc.name}$`, "i") },
        { brandRef: brandDoc._id },
      ];
    } else {
      query.brand = new RegExp(brand, "i");
    }
  }

  if (category) {
    const cat = await Category.findOne({
      $or: [
        { slug: category },
        ...(category.match(/^[a-f\d]{24}$/i) ? [{ _id: category }] : []),
      ],
    }).lean();
    if (cat) {
      query.category = cat._id;
    }
  }

  if (campaign) query.isCampaign = true;
  if (isNew) query.isNew = true;
  if (featured) query.isFeatured = true;

  if (search) {
    query.$and = [
      ...((query.$and as unknown[]) || []),
      {
        $or: [
          { title: new RegExp(search, "i") },
          { brand: new RegExp(search, "i") },
          { model: new RegExp(search, "i") },
          { shortDescription: new RegExp(search, "i") },
        ],
      },
    ];
  }

  const hasPriceFilter = minPrice != null || maxPrice != null;
  if (hasPriceFilter) {
    query.$and = [
      ...((query.$and as unknown[]) || []),
      {
        $expr: {
          $and: [
            {
              $gte: [
                { $ifNull: ["$discountedPrice", "$price"] },
                minPrice ?? 0,
              ],
            },
            ...(maxPrice != null
              ? [
                  {
                    $lte: [
                      { $ifNull: ["$discountedPrice", "$price"] },
                      maxPrice,
                    ],
                  },
                ]
              : []),
            { $ne: [{ $ifNull: ["$price", null] }, null] },
          ],
        },
      },
    ];
  }

  let sortOption: Record<string, 1 | -1> = { isFeatured: -1, createdAt: -1 };
  if (sort === "price-asc") sortOption = { price: 1 };
  if (sort === "price-desc") sortOption = { price: -1 };
  if (sort === "newest") sortOption = { createdAt: -1 };

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    items: serialize<ProductDTO[]>(items),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4
): Promise<ProductDTO[]> {
  await connectDB();
  const items = await Product.find({
    isActive: true,
    category: categoryId,
    _id: { $ne: excludeId },
  })
    .limit(limit)
    .lean();
  return serialize<ProductDTO[]>(items);
}

export async function searchProducts(
  q: string,
  limit = 8
): Promise<ProductDTO[]> {
  if (!q.trim()) return [];
  await connectDB();

  const categories = await Category.find({
    name: new RegExp(q, "i"),
    isActive: true,
  })
    .limit(5)
    .lean();

  const categoryIds = categories.map((c) => c._id);

  const products = await Product.find({
    isActive: true,
    $or: [
      { title: new RegExp(q, "i") },
      { brand: new RegExp(q, "i") },
      { model: new RegExp(q, "i") },
      ...(categoryIds.length ? [{ category: { $in: categoryIds } }] : []),
    ],
  })
    .populate("category", "name slug")
    .limit(limit)
    .lean();

  return serialize<ProductDTO[]>(products);
}
