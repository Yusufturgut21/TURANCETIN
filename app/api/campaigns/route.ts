import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Campaign } from "@/models/Campaign";
import { requireAdmin } from "@/lib/admin";
import { campaignSchema } from "@/lib/validations";
import { slugify, isCampaignActive } from "@/lib/utils";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";

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

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const admin = request.nextUrl.searchParams.get("admin") === "1";
    const items = await Campaign.find(admin ? {} : { isActive: true })
      .populate("products", "title slug images price discountedPrice brand")
      .sort({ createdAt: -1 })
      .lean();

    const filtered = admin
      ? items
      : items.filter((c) =>
          isCampaignActive(c.startDate, c.endDate, c.isActive)
        );

    return successResponse(JSON.parse(JSON.stringify(filtered)));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const data = campaignSchema.parse(body);
    await connectDB();
    const slug = await uniqueSlug(data.slug || data.title);

    const campaign = await Campaign.create({
      ...data,
      banner: data.banner || undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      products: data.products || [],
      slug,
      isActive: data.isActive ?? true,
    });

    return successResponse(campaign, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
