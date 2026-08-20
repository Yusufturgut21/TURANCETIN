import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Campaign } from "@/models/Campaign";
import { requireAdmin } from "@/lib/admin";
import { campaignSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = slugify(base) || "kampanya";
  let i = 0;
  while (true) {
    const candidate = i === 0 ? slug : `${slug}-${i}`;
    const existing = await Campaign.findOne({
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
    const item = await Campaign.findById(id).populate("products").lean();
    if (!item) return errorResponse("Kampanya bulunamadı.", 404);
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
    const data = campaignSchema.parse(body);
    await connectDB();
    const slug = await uniqueSlug(data.slug || data.title, id);

    const item = await Campaign.findByIdAndUpdate(
      id,
      {
        ...data,
        banner: data.banner || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        products: data.products || [],
        slug,
      },
      { new: true }
    );
    if (!item) return errorResponse("Kampanya bulunamadı.", 404);
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
    const item = await Campaign.findByIdAndDelete(id);
    if (!item) return errorResponse("Kampanya bulunamadı.", 404);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
