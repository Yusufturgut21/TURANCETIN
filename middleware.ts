import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
      });

      // Eğer kullanıcı giriş sayfasındaysa ve zaten giriş yapmışsa, panele yönlendir
      if (pathname.startsWith("/admin/giris")) {
        if (token) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } else {
        // Eğer başka bir admin sayfasındaysa ve giriş yapmamışsa, giriş sayfasına at
        if (!token) {
          const url = new URL("/admin/giris", request.url);
          url.searchParams.set("callbackUrl", pathname);
          return NextResponse.redirect(url);
        }
      }
    } catch (error) {
      console.error("[middleware] getToken failed:", error);
      if (!pathname.startsWith("/admin/giris")) {
        const url = new URL("/admin/giris", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
