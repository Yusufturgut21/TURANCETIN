import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { requireAdmin } from "@/lib/admin";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

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

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const item = await Category.findById(id).lean();
    if (!item) return errorResponse("Kategori bulunamadı.", 404);
    return successResponse(JSON.parse(JSON.stringify(item)));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const data = categorySchema.parse(body);
    await connectDB();
    const slug = await uniqueSlug(data.slug || data.name, id);

    const item = await Category.findByIdAndUpdate(
      id,
      {
        ...data,
        parent: data.parent || null,
        image: data.image || undefined,
        slug,
      },
      { new: true }
    );
    if (!item) return errorResponse("Kategori bulunamadı.", 404);
    return successResponse(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    await connectDB();
    const item = await Category.findByIdAndDelete(id);
    if (!item) return errorResponse("Kategori bulunamadı.", 404);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
