import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ContactMessage } from "@/models/ContactMessage";
import { requireAdmin } from "@/lib/admin";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const statusSchema = z.object({
  status: z.enum(["unread", "read", "deleted"]),
});

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = statusSchema.parse(await request.json());
    await connectDB();
    const item = await ContactMessage.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    );
    if (!item) return errorResponse("Mesaj bulunamadı.", 404);
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
    const item = await ContactMessage.findByIdAndUpdate(
      id,
      { status: "deleted" },
      { new: true }
    );
    if (!item) return errorResponse("Mesaj bulunamadı.", 404);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
