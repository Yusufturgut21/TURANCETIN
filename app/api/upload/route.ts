import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { uploadImage, isCloudinaryConfigured } from "@/lib/cloudinary";
import { successResponse, errorResponse, handleApiError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    if (!isCloudinaryConfigured()) {
      return errorResponse(
        "Cloudinary yapılandırması eksik. Ortam değişkenlerini kontrol edin.",
        500
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "turancetin";

    if (!file) {
      return errorResponse("Dosya bulunamadı.", 400);
    }

    if (!file.type.startsWith("image/")) {
      return errorResponse("Sadece görsel dosyaları yüklenebilir.", 400);
    }

    if (file.size > 8 * 1024 * 1024) {
      return errorResponse("Dosya boyutu 8MB'dan küçük olmalıdır.", 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await uploadImage(base64, folder);
    return successResponse(result);
  } catch (error) {
    console.error("[upload]", error);
    if (error instanceof Error && error.message) {
      if (
        error.message.includes("Invalid api_key") ||
        error.message.includes("Invalid signature")
      ) {
        return errorResponse(
          "Cloudinary anahtarları hatalı. Vercel'deki CLOUDINARY_* değerlerini kontrol edin (sonunda boşluk/satır olmasın).",
          500
        );
      }
      return errorResponse(error.message, 500);
    }
    return handleApiError(error);
  }
}
