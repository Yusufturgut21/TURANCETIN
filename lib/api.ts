import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  message = "Bir hata oluştu. Lütfen tekrar deneyin.",
  status = 500
) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function handleApiError(error: unknown) {
  console.error("[API Error]", error);

  if (error instanceof ZodError) {
    const message = error.issues.map((i) => i.message).join(", ");
    return errorResponse(message || "Geçersiz veri.", 400);
  }

  if (error instanceof Error) {
    if (error.message.includes("MONGODB_URI")) {
      return errorResponse(
        "Veritabanı yapılandırması eksik. Lütfen yöneticinize başvurun.",
        500
      );
    }
    if (error.name === "ValidationError") {
      return errorResponse("Girilen bilgiler geçersiz.", 400);
    }
    if (error.message.includes("duplicate key")) {
      return errorResponse("Bu kayıt zaten mevcut.", 409);
    }
  }

  return errorResponse();
}
