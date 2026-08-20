import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";
import { requireAdmin } from "@/lib/admin";
import { successResponse, handleApiError } from "@/lib/api";
import { getSiteSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return successResponse(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    await connectDB();
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }
    return successResponse(settings);
  } catch (error) {
    return handleApiError(error);
  }
}
