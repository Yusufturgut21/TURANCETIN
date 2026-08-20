import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/admin";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "editor"]).optional(),
});

export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    await connectDB();
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    return successResponse(JSON.parse(JSON.stringify(users)));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = createUserSchema.parse(await request.json());
    await connectDB();

    const exists = await User.findOne({ email: body.email.toLowerCase() });
    if (exists) return errorResponse("Bu e-posta zaten kayıtlı.", 409);

    const hashed = await bcrypt.hash(body.password, 12);
    const user = await User.create({
      name: body.name,
      email: body.email.toLowerCase(),
      password: hashed,
      role: body.role || "admin",
    });

    return successResponse(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
