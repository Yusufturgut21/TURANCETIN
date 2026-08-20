import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { requireAdmin } from "@/lib/admin";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";
import { z } from "zod";

const bulkSchema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum(["activate", "deactivate", "delete"]),
});

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = bulkSchema.parse(await request.json());
    await connectDB();

    if (body.action === "delete") {
      await Product.deleteMany({ _id: { $in: body.ids } });
    } else {
      await Product.updateMany(
        { _id: { $in: body.ids } },
        { $set: { isActive: body.action === "activate" } }
      );
    }

    return successResponse({ message: "Toplu işlem tamamlandı." });
  } catch (error) {
    return handleApiError(error);
  }
}
