import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Brand } from "@/models/Brand";
import { requireAdmin } from "@/lib/admin";
import { brandSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

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

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const item = await Brand.findById(id).lean();
    if (!item) return errorResponse("Marka bulunamadı.", 404);
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
    const data = brandSchema.parse(body);
    await connectDB();
    const slug = await uniqueSlug(data.slug || data.name, id);
    const item = await Brand.findByIdAndUpdate(
      id,
      { ...data, logo: data.logo || undefined, slug },
      { new: true }
    );
    if (!item) return errorResponse("Marka bulunamadı.", 404);
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
    const item = await Brand.findByIdAndDelete(id);
    if (!item) return errorResponse("Marka bulunamadı.", 404);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
