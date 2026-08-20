import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Brand } from "@/models/Brand";
import { requireAdmin } from "@/lib/admin";
import { brandSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = slugify(base) || "marka";
  let i = 0;
  while (true) {
    const candidate = i === 0 ? slug : `${slug}-${i}`;
    const existing = await Brand.findOne({
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
    const items = await Brand.find(admin ? {} : { isActive: true })
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
    const data = brandSchema.parse(body);
    await connectDB();
    const slug = await uniqueSlug(data.slug || data.name);
    const brand = await Brand.create({
      ...data,
      logo: data.logo || undefined,
      slug,
      isActive: data.isActive ?? true,
    });
    return successResponse(brand, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
