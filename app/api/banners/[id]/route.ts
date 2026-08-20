import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Banner } from "@/models/Banner";
import { requireAdmin } from "@/lib/admin";
import { bannerSchema } from "@/lib/validations";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const item = await Banner.findById(id).lean();
    if (!item) return errorResponse("Banner bulunamadı.", 404);
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
    const data = bannerSchema.parse(body);
    await connectDB();
    const item = await Banner.findByIdAndUpdate(id, data, { new: true });
    if (!item) return errorResponse("Banner bulunamadı.", 404);
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
    const item = await Banner.findByIdAndDelete(id);
    if (!item) return errorResponse("Banner bulunamadı.", 404);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
