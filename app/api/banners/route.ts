import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Banner } from "@/models/Banner";
import { requireAdmin } from "@/lib/admin";
import { bannerSchema } from "@/lib/validations";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const admin = request.nextUrl.searchParams.get("admin") === "1";
    const items = await Banner.find(admin ? {} : { isActive: true })
      .sort({ sortOrder: 1 })
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
    const data = bannerSchema.parse(body);
    await connectDB();
    const banner = await Banner.create({
      ...data,
      isActive: data.isActive ?? true,
    });
    return successResponse(banner, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
