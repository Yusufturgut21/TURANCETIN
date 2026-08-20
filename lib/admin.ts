import { auth } from "@/lib/auth";
import { errorResponse } from "@/lib/api";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, error: errorResponse("Yetkisiz erişim.", 401) };
  }
  return { session, error: null };
}
