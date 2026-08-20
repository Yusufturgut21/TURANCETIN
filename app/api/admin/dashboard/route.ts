import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Brand } from "@/models/Brand";
import { ContactMessage } from "@/models/ContactMessage";
import { requireAdmin } from "@/lib/admin";
import { successResponse, handleApiError } from "@/lib/api";

export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    await connectDB();

    const [
      totalProducts,
      activeProducts,
      campaignProducts,
      categoryCount,
      brandCount,
      unreadMessages,
      recentProducts,
      recentMessages,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isCampaign: true, isActive: true }),
      Category.countDocuments(),
      Brand.countDocuments(),
      ContactMessage.countDocuments({ status: "unread" }),
      Product.find().sort({ createdAt: -1 }).limit(5).lean(),
      ContactMessage.find({ status: { $ne: "deleted" } })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return successResponse({
      totalProducts,
      activeProducts,
      campaignProducts,
      categoryCount,
      brandCount,
      unreadMessages,
      recentProducts: JSON.parse(JSON.stringify(recentProducts)),
      recentMessages: JSON.parse(JSON.stringify(recentMessages)),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
