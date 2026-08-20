import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ContactMessage } from "@/models/ContactMessage";
import { requireAdmin } from "@/lib/admin";
import { contactSchema } from "@/lib/validations";
import { successResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    await connectDB();
    const status = request.nextUrl.searchParams.get("status");
    const query =
      status && status !== "all"
        ? { status }
        : { status: { $ne: "deleted" } };

    const items = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .lean();
    return successResponse(JSON.parse(JSON.stringify(items)));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);
    await connectDB();
    const message = await ContactMessage.create({
      name: data.name,
      phone: data.phone || "",
      email: data.email || "",
      message: data.message,
      status: "unread",
    });
    return successResponse(
      { id: message._id, message: "Mesajınız alındı. En kısa sürede dönüş yapacağız." },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
