import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { requireAdmin } from "@/lib/admin";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";
import { getProducts } from "@/lib/queries";

async function uniqueProductSlug(base: string, excludeId?: string) {
  let slug = slugify(base) || "urun";
  let i = 0;
  while (true) {
    const candidate = i === 0 ? slug : `${slug}-${i}`;
    const existing = await Product.findOne({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    if (!existing) return candidate;
    i += 1;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const admin = searchParams.get("admin") === "1";

    if (admin) {
      const { error } = await requireAdmin();
      if (error) return error;

      await connectDB();
      const page = Number(searchParams.get("page") || 1);
      const limit = Number(searchParams.get("limit") || 20);
      const search = searchParams.get("search") || "";
      const status = searchParams.get("status");

      const category = searchParams.get("category");

      const query: Record<string, unknown> = {};
      if (search) {
        query.$or = [
          { title: new RegExp(search, "i") },
          { brand: new RegExp(search, "i") },
          { model: new RegExp(search, "i") },
        ];
      }
      if (status === "active") query.isActive = true;
      if (status === "inactive") query.isActive = false;
      if (status === "campaign") query.isCampaign = true;
      if (category) query.category = category;

      const [items, total] = await Promise.all([
        Product.find(query)
          .populate("category", "name")
          .sort({ createdAt: 1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Product.countDocuments(query),
      ]);

      return successResponse({
        items: JSON.parse(JSON.stringify(items)),
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      });
    }

    const result = await getProducts({
      brand: searchParams.get("brand") || undefined,
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      campaign: searchParams.get("campaign") === "1" || undefined,
      isNew: searchParams.get("new") === "1" || undefined,
      featured: searchParams.get("featured") === "1" || undefined,
      search: searchParams.get("search") || undefined,
      sort: (searchParams.get("sort") as "recommended") || "recommended",
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 12),
    });

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const data = productSchema.parse(body);

    await connectDB();
    const slug = await uniqueProductSlug(data.slug || data.title);

    const product = await Product.create({
      ...data,
      price: data.price ?? undefined,
      discountedPrice: data.discountedPrice ?? undefined,
      brandRef: data.brandRef || undefined,
      subCategory: data.subCategory || undefined,
      slug,
      isActive: data.isActive ?? true,
    });

    return successResponse(product, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
