import { NextRequest } from "next/server";
import { searchProducts } from "@/lib/queries";
import { successResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q") || "";
    const items = await searchProducts(q, 10);
    return successResponse(items);
  } catch (error) {
    return handleApiError(error);
  }
}
