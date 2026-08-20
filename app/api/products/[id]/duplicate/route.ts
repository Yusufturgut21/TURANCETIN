import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    await connectDB();
    const original = await Product.findById(id).lean();
    if (!original) return errorResponse("Ürün bulunamadı.", 404);

    const baseSlug = slugify(`${original.title}-kopya`) || "urun-kopya";
    let slug = baseSlug;
    let i = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${i}`;
      i += 1;
    }

    const { _id, createdAt, updatedAt, ...rest } = original as Record<
      string,
      unknown
    > & { _id: unknown; createdAt: unknown; updatedAt: unknown };

    const copy = await Product.create({
      ...rest,
      title: `${original.title} (Kopya)`,
      slug,
      isActive: false,
    });

    return successResponse(copy, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
