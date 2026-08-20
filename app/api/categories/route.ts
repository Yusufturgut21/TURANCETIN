import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { requireAdmin } from "@/lib/admin";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = slugify(base) || "kategori";
  let i = 0;
  while (true) {
    const candidate = i === 0 ? slug : `${slug}-${i}`;
    const existing = await Category.findOne({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    if (!existing) return candidate;
    i += 1;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const admin = request.nextUrl.searchParams.get("admin") === "1";
    const query = admin ? {} : { isActive: true };
    const items = await Category.find(query)
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    return successResponse(JSON.parse(JSON.stringify(items)));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const data = categorySchema.parse(body);
    await connectDB();
    const slug = await uniqueSlug(data.slug || data.name);

    const category = await Category.create({
      ...data,
      parent: data.parent || null,
      image: data.image || undefined,
      slug,
      isActive: data.isActive ?? true,
    });

    return successResponse(category, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
