import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { requireAdmin } from "@/lib/admin";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

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

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .lean();
    if (!product) return errorResponse("Ürün bulunamadı.", 404);
    return successResponse(JSON.parse(JSON.stringify(product)));
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
    const data = productSchema.parse(body);

    await connectDB();
    const slug = await uniqueProductSlug(data.slug || data.title, id);

    const updateDoc: Record<string, unknown> = {
      ...data,
      brandRef: data.brandRef || undefined,
      subCategory: data.subCategory || undefined,
      slug,
    };

    if (data.price == null) {
      delete updateDoc.price;
    } else {
      updateDoc.price = data.price;
    }

    if (data.discountedPrice == null) {
      delete updateDoc.discountedPrice;
    } else {
      updateDoc.discountedPrice = data.discountedPrice;
    }

    const unset: Record<string, 1> = {};
    if (data.price == null) unset.price = 1;
    if (data.discountedPrice == null) unset.discountedPrice = 1;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        $set: updateDoc,
        ...(Object.keys(unset).length ? { $unset: unset } : {}),
      },
      { new: true, runValidators: true }
    );

    if (!product) return errorResponse("Ürün bulunamadı.", 404);
    return successResponse(product);
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
    const product = await Product.findByIdAndDelete(id);
    if (!product) return errorResponse("Ürün bulunamadı.", 404);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
