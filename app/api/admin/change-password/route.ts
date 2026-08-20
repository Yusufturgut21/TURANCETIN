import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/admin";
import { passwordChangeSchema } from "@/lib/validations";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error || !session) return error;

    const body = passwordChangeSchema.parse(await request.json());
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) return errorResponse("Kullanıcı bulunamadı.", 404);

    const valid = await bcrypt.compare(body.currentPassword, user.password);
    if (!valid) return errorResponse("Mevcut şifre hatalı.", 400);

    user.password = await bcrypt.hash(body.newPassword, 12);
    await user.save();

    return successResponse({ message: "Şifre güncellendi." });
  } catch (error) {
    return handleApiError(error);
  }
}
