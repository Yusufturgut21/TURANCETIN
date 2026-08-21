import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/admin/giris");
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminPage) {
    if (isAuthPage) {
      if (isLoggedIn) {
        return Response.redirect(new URL("/admin", req.nextUrl));
      }
      return undefined;
    }
    if (!isLoggedIn) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return Response.redirect(
        new URL(
          `/admin/giris?callbackUrl=${encodeURIComponent(from)}`,
          req.nextUrl
        )
      );
    }
  }
  return undefined;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

